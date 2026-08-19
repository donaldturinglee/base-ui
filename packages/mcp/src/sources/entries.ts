import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import ts from "typescript";
import type { RegistryEntry, RegistryProps, RegistrySection } from "../registry/registry.types";
import { readProps, readTypeNames } from "./props";
import type { ReadProps } from "./props";
import { readStories } from "./stories";
import type { StoryDocs } from "./stories";
import { isExported } from "./syntax";

// A component is a directory rather than a file: what it draws, what it takes, what it is shown
// doing, and the one file that says which of it is anybody else's to reach for. An entry is
// that directory read as a whole, and a provider is read the same way since it is written the
// same way

type Index = {
    exports: string[];
    parts: string[];
};

export const readEntry = (
    directory: string,
    section: RegistrySection,
    importPath: string,
): RegistryEntry | undefined => {
    const files = readdirSync(directory);
    // A directory that exports nothing is not an entry yet, whatever else it is holding
    if (!files.includes("index.ts")) {
        return;
    }

    const folder = basename(directory);
    const index = readIndex(read(directory, "index.ts"));
    const name = primary(index.exports, folder);
    if (!name) {
        return;
    }

    const typeFiles = files.filter((file) => file.endsWith(".types.ts"));
    const groups = typeFiles.flatMap((file) => readProps(file, read(directory, file)));
    const types = typeFiles.flatMap((file) => readTypeNames(file, read(directory, file)));

    // The story a component is introduced by is worth reading before the ones that take it
    // apart feature by feature, whatever order the directory happens to list them in
    const storyFiles = files
        .filter((file) => file.endsWith(".stories.tsx"))
        .sort(
            (one, other) =>
                Number(one.includes(".features.")) - Number(other.includes(".features.")),
        );
    const stories = storyFiles.map((file) => readStories(file, read(directory, file), importPath));
    const docs = stories.reduce<StoryDocs>((all, one) => ({ ...all, ...one.docs }), {});

    return {
        name,
        directory: folder,
        section,
        exports: [name, ...index.exports.filter((exported) => exported !== name)],
        parts: index.parts,
        types,
        props: describe(declared(groups, name), docs),
        examples: stories.flatMap((one) => one.examples),
    };
};

export const readSection = (
    directory: string,
    section: RegistrySection,
    importPath: string,
): RegistryEntry[] => {
    return readdirSync(directory, { withFileTypes: true })
        .filter((file) => file.isDirectory())
        .map((file) => readEntry(join(directory, file.name), section, importPath))
        .filter((entry): entry is RegistryEntry => entry !== undefined)
        .sort((one, other) => one.name.localeCompare(other.name));
};

// What the package holds for the entry, and what is hung off it rather than exported beside it.
// Only the values are read: a type is exported for a caller to write against rather than to be
// drawn, and is read out of the types file instead
const readIndex = (text: string): Index => {
    const source = ts.createSourceFile("index.ts", text, ts.ScriptTarget.Latest, true);
    const exports: string[] = [];
    const parts: string[] = [];

    source.forEachChild((node) => {
        if (ts.isExportDeclaration(node)) {
            if (!node.isTypeOnly && node.exportClause && ts.isNamedExports(node.exportClause)) {
                for (const element of node.exportClause.elements) {
                    if (!element.isTypeOnly) {
                        exports.push(element.name.text);
                    }
                }
            }
            return;
        }

        if (ts.isVariableStatement(node) && isExported(node)) {
            const declaration = node.declarationList.declarations[0];
            if (declaration && ts.isIdentifier(declaration.name)) {
                exports.push(declaration.name.text);
                parts.push(...readParts(declaration.initializer));
            }
        }
    });

    return { exports, parts };
};

// A component that has parts hangs them off itself as it is exported, so that they are reached
// through it rather than imported one by one
const readParts = (node?: ts.Expression): string[] => {
    if (!node || !ts.isCallExpression(node) || node.expression.getText() !== "Object.assign") {
        return [];
    }

    const shape = node.arguments[1];
    if (!shape || !ts.isObjectLiteralExpression(shape)) {
        return [];
    }

    return shape.properties
        .map((property) => {
            return ts.isPropertyAssignment(property) ? property.name.getText() : undefined;
        })
        .filter((name): name is string => name !== undefined);
};

// Which of the exports is the entry itself. It is named for the directory it is written in,
// except where what is written there is a provider, whose name says what it does as well
const primary = (exports: string[], directory: string): string | undefined => {
    const expected = pascal(directory);
    return (
        exports.find((one) => one === expected) ??
        exports.find((one) => one.startsWith(expected)) ??
        exports[0]
    );
};

const pascal = (directory: string): string => {
    return directory
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");
};

// A props type the component's own was built out of has already been said through it, so it is
// left out rather than said a second time under a name a caller never writes. What the entry
// itself takes is said first, and the rest keep the order the library declared them in
const declared = (groups: ReadProps[], name: string): RegistryProps[] => {
    const built = new Set(groups.flatMap((group) => group.reached));

    return groups
        .filter((group) => group.name === `${name}Props` || !built.has(group.name))
        .sort((one, other) => rank(one.name, name) - rank(other.name, name))
        .map((group) => ({ name: group.name, props: group.props, inherits: group.inherits }));
};

// A prop the types file left uncommented is often described by the control the playground
// gives it, which is the same thing said in the other place it could have been said
const describe = (groups: RegistryProps[], docs: StoryDocs): RegistryProps[] => {
    return groups.map((group) => ({
        ...group,
        props: group.props.map((prop) => ({
            ...prop,
            description: prop.description ?? docs[prop.name]?.description,
            options: prop.options ?? docs[prop.name]?.options,
        })),
    }));
};

// What the entry itself takes comes before what its parts take, and the rest stay in the order
// the library declared them in
const rank = (group: string, name: string): number => {
    return group === `${name}Props` ? 0 : 1;
};

const read = (directory: string, file: string): string => {
    return readFileSync(join(directory, file), "utf8");
};
