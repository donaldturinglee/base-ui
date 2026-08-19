import ts from "typescript";
import type { RegistryExample } from "../registry/registry.types";
import { isExported, mentions, normalize, readComment, titleize } from "./syntax";

// Storybook is where the components are developed and read, so the stories beside a component
// are the worked examples of it that already exist. They are read back out of the story file
// as they would be written in an application: the framing Storybook needs is dropped, the paths
// inside the library become the path an application imports from, and whatever a story reaches
// for beside itself comes with it

// The playground is driven by its controls rather than showing something, so it documents the
// props instead of being an example of anything
const PLAYGROUND = "Playground";

// What a story file says about the props of the component it draws, which is where a prop the
// types file left uncommented is often described instead
export type StoryDocs = Record<string, { description?: string; options?: string[] }>;

export type Stories = {
    examples: RegistryExample[];
    docs: StoryDocs;
};

type ImportKind = "named" | "namespace" | "default";

type StoryImport = {
    name: string;
    // Where it is imported from once the story is read outside the library
    from: string;
    kind: ImportKind;
    type: boolean;
};

type Helper = {
    name: string;
    source: string;
};

type Story = {
    title: string;
    source: string;
};

export const readStories = (file: string, text: string, importPath: string): Stories => {
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const imports = readImports(source, importPath);
    const helpers: Helper[] = [];
    const stories: Story[] = [];
    let docs: StoryDocs = {};

    source.forEachChild((node) => {
        if (ts.isExpressionStatement(node)) {
            // A prop is described once however many stories are annotated with it
            docs = { ...readDocs(node), ...docs };
            return;
        }

        if (isExported(node)) {
            const story = ts.isVariableStatement(node) ? readStory(node, source) : undefined;
            if (story) {
                stories.push(story);
            }
            return;
        }

        const helper = readHelper(node);
        if (helper) {
            helpers.push(helper);
        }
    });

    return {
        examples: stories.map((story) => ({
            title: story.title,
            source: assemble(story, imports, helpers),
        })),
        docs,
    };
};

const readImports = (source: ts.SourceFile, importPath: string): StoryImport[] => {
    const imports: StoryImport[] = [];

    source.forEachChild((node) => {
        if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier)) {
            return;
        }

        const specifier = node.moduleSpecifier.text;
        // Storybook frames the stories rather than being part of what they show
        if (specifier.startsWith("@storybook/")) {
            return;
        }

        // A path into the library is what the package publishes it under once the story is read
        // from outside it
        const from = specifier.startsWith(".") ? importPath : specifier;
        const clause = node.importClause;
        if (!clause) {
            return;
        }

        if (clause.name) {
            imports.push({
                name: clause.name.text,
                from,
                kind: "default",
                type: clause.isTypeOnly,
            });
        }

        const bindings = clause.namedBindings;
        if (bindings && ts.isNamespaceImport(bindings)) {
            imports.push({
                name: bindings.name.text,
                from,
                kind: "namespace",
                type: clause.isTypeOnly,
            });
        }

        if (bindings && ts.isNamedImports(bindings)) {
            for (const element of bindings.elements) {
                imports.push({
                    name: element.name.text,
                    from,
                    kind: "named",
                    type: clause.isTypeOnly || element.isTypeOnly,
                });
            }
        }
    });

    return imports;
};

const writeImports = (imports: StoryImport[]): string[] => {
    const lines: string[] = [];
    const groups: { from: string; type: boolean; names: string[] }[] = [];

    for (const one of imports) {
        if (one.kind === "namespace") {
            lines.push(`import * as ${one.name} from "${one.from}";`);
            continue;
        }
        if (one.kind === "default") {
            lines.push(`import ${one.name} from "${one.from}";`);
            continue;
        }

        const group = groups.find((candidate) => {
            return candidate.from === one.from && candidate.type === one.type;
        });
        if (group) {
            group.names.push(one.name);
        } else {
            groups.push({ from: one.from, type: one.type, names: [one.name] });
        }
    }

    for (const group of groups) {
        const keyword = group.type ? "import type" : "import";
        lines.push(`${keyword} { ${group.names.join(", ")} } from "${group.from}";`);
    }

    return lines;
};

// Whatever a story file declares beside its stories is there to be reached for by them, so it
// is kept under the name it is reached for by
const readHelper = (node: ts.Node): Helper | undefined => {
    if (ts.isVariableStatement(node)) {
        const declaration = node.declarationList.declarations[0];
        if (declaration && ts.isIdentifier(declaration.name)) {
            return { name: declaration.name.text, source: node.getText() };
        }
        return;
    }

    if ((ts.isFunctionDeclaration(node) || ts.isTypeAliasDeclaration(node)) && node.name) {
        return { name: node.name.text, source: node.getText() };
    }

    return;
};

const readStory = (node: ts.VariableStatement, source: ts.SourceFile): Story | undefined => {
    const declaration = node.declarationList.declarations[0];
    if (!declaration || !ts.isIdentifier(declaration.name) || !declaration.initializer) {
        return;
    }

    const name = declaration.name.text;
    const initializer = declaration.initializer;
    if (name === PLAYGROUND || !ts.isArrowFunction(initializer)) {
        return;
    }

    return {
        // The comment above a story is the author saying what it shows, which is worth more
        // than the name it had to be given to be exported under
        title: readComment(node, source) ?? titleize(name),
        // The type it is annotated with says it is a story rather than saying anything about
        // what it draws, so it is left behind along with the export it was declared under
        source: `const ${name} = ${initializer.getText()};`,
    };
};

const readDocs = (node: ts.ExpressionStatement): StoryDocs => {
    const assignment = node.expression;
    if (!ts.isBinaryExpression(assignment)) {
        return {};
    }
    if (assignment.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
        return {};
    }
    if (
        !ts.isPropertyAccessExpression(assignment.left) ||
        !ts.isObjectLiteralExpression(assignment.right)
    ) {
        return {};
    }
    if (assignment.left.name.text !== "argTypes") {
        return {};
    }

    const docs: StoryDocs = {};

    for (const property of assignment.right.properties) {
        if (
            !ts.isPropertyAssignment(property) ||
            !ts.isObjectLiteralExpression(property.initializer)
        ) {
            continue;
        }
        const name = readName(property.name);
        if (!name) {
            continue;
        }
        docs[name] = {
            description: readText(readProperty(property.initializer, "description")),
            options: readTexts(readProperty(property.initializer, "options")),
        };
    }

    return docs;
};

const readProperty = (
    object: ts.ObjectLiteralExpression,
    name: string,
): ts.Expression | undefined => {
    for (const property of object.properties) {
        if (ts.isPropertyAssignment(property) && readName(property.name) === name) {
            return property.initializer;
        }
    }
    return;
};

const readName = (node: ts.PropertyName): string | undefined => {
    if (ts.isIdentifier(node) || ts.isStringLiteral(node)) {
        return node.text;
    }
    return;
};

const readText = (node?: ts.Expression): string | undefined => {
    if (node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))) {
        return normalize(node.text);
    }
    return;
};

const readTexts = (node?: ts.Expression): string[] | undefined => {
    if (!node || !ts.isArrayLiteralExpression(node)) {
        return;
    }
    const values = node.elements.map(readText);
    return values.every((value) => value !== undefined) ? (values as string[]) : undefined;
};

// A story on its own is only the half of an example that is worth reading. What it reaches for
// beside itself is brought along with it, and the imports it is left needing are written out
const assemble = (story: Story, imports: StoryImport[], helpers: Helper[]): string => {
    const kept: string[] = [];
    let text = story.source;

    // A helper reaching for another helper brings that one along too, so the list is walked
    // from the last of them back and what has been kept is read against as it grows
    for (const helper of [...helpers].reverse()) {
        if (mentions(text, helper.name)) {
            kept.unshift(helper.source);
            text = `${helper.source}\n${text}`;
        }
    }

    const used = imports.filter((one) => mentions(text, one.name));

    return [writeImports(used).join("\n"), ...kept, story.source]
        .filter((part) => part !== "")
        .join("\n\n");
};
