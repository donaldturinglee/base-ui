import ts from "typescript";
import type { RegistryProp, RegistryProps } from "../registry/registry.types";
import { isExported, readComment, tidy } from "./syntax";

// The library writes what a component takes in TypeScript rather than in documentation, so the
// types file beside the component is where the props are read from. It is read as it was
// written: the compiler parses the file and the tree that comes back is walked. Nothing is type
// checked and nothing outside the file is followed, so a type the library did not declare
// itself is carried as it was written instead of being resolved into members

// A props type is named for what it is props for, so the ones worth reading are found by their
// suffix rather than by a list kept somewhere else
const PROPS_SUFFIX = "Props";

// The helper every polymorphic component is typed through. It merges the props of the element
// being drawn with the ones the component adds, so what the component asks for is its third
// argument and what comes along with them is its second
const POLYMORPHIC = "PolymorphicProps";

// React's own helper for a component that draws whatever it is given between its tags
const WITH_CHILDREN = "PropsWithChildren";

// `as` and `children` are added by the helper a component is typed through rather than declared
// by the component, so both would be missing from every entry typed that way if props were only
// ever read out of a members list
const AS_PROP: RegistryProp = {
    name: "as",
    type: "React.ElementType",
    required: false,
    description: "The element or component this is drawn as, in place of its default",
};

const CHILDREN_PROP: RegistryProp = {
    name: "children",
    type: "React.ReactNode",
    required: false,
    description: "What the component draws between its tags",
};

type Aliases = Map<string, ts.TypeAliasDeclaration>;

type Context = {
    source: ts.SourceFile;
    aliases: Aliases;
};

// What a type came out as once it was taken apart: the props that can be named, the types
// standing behind it that cannot, and the types of the file's own it was made out of
type Flattened = {
    props: RegistryProp[];
    inherits: string[];
    reached: string[];
};

// A props type along with the other props types in its file that it was made out of, which is
// what tells a type declared to be read on its own from one declared only to be built on
export type ReadProps = RegistryProps & {
    reached: string[];
};

export const readProps = (file: string, text: string): ReadProps[] => {
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const aliases: Aliases = new Map();

    source.forEachChild((node) => {
        if (ts.isTypeAliasDeclaration(node)) {
            aliases.set(node.name.text, node);
        }
    });

    const context: Context = { source, aliases };
    const groups: ReadProps[] = [];

    for (const [name, alias] of aliases) {
        if (!name.endsWith(PROPS_SUFFIX) || !isExported(alias)) {
            continue;
        }
        const flattened = flatten(alias.type, context, new Set([name]));
        groups.push({
            name,
            props: dedupe(flattened.props),
            inherits: dedupe(flattened.inherits.map(tidy)),
            reached: dedupe(flattened.reached),
        });
    }

    return groups;
};

// The names of the types the file declares, which are what a caller types its own props with
export const readTypeNames = (file: string, text: string): string[] => {
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const names: string[] = [];

    source.forEachChild((node) => {
        if (ts.isTypeAliasDeclaration(node) && isExported(node)) {
            names.push(node.name.text);
        }
    });

    return names;
};

const flatten = (node: ts.TypeNode, context: Context, seen: Set<string>): Flattened => {
    if (ts.isParenthesizedTypeNode(node)) {
        return flatten(node.type, context, seen);
    }

    if (ts.isTypeLiteralNode(node)) {
        return {
            props: node.members
                .filter(ts.isPropertySignature)
                .map((member) => readProp(member, context)),
            inherits: [],
            reached: [],
        };
    }

    if (ts.isIntersectionTypeNode(node)) {
        const parts = node.types.map((type) => flatten(type, context, seen));
        return {
            props: parts.flatMap((part) => part.props),
            inherits: parts.flatMap((part) => part.inherits),
            reached: parts.flatMap((part) => part.reached),
        };
    }

    if (ts.isTypeReferenceNode(node)) {
        return flattenReference(node, context, seen);
    }

    // Anything left is a type the props were made out of rather than a shape with members of
    // its own, and is worth more said as it was written than taken apart
    return opaque(node);
};

const flattenReference = (
    node: ts.TypeReferenceNode,
    context: Context,
    seen: Set<string>,
): Flattened => {
    const name = node.typeName.getText();
    // A helper is known by its own name whether or not it was reached for through the
    // namespace it was imported under
    const helper = name.slice(name.lastIndexOf(".") + 1);
    const args = node.typeArguments ?? [];

    if (helper === POLYMORPHIC) {
        const own = args[2] ? flatten(args[2], context, seen) : empty();
        const element = args[1] ? args[1].getText() : '"div"';
        return {
            props: [...own.props, AS_PROP],
            inherits: [...own.inherits, `ComponentPropsWithRef<${element}>`],
            reached: own.reached,
        };
    }

    if (helper === WITH_CHILDREN && args[0]) {
        const own = flatten(args[0], context, seen);
        return { ...own, props: [...own.props, CHILDREN_PROP] };
    }

    // A type that is only ever narrowed says nothing on its own, so what it narrows is taken
    // apart first and, where that came back opaque, the whole of it is kept as it was written
    if ((helper === "Omit" || helper === "Pick") && args.length === 2) {
        const flattened = flatten(args[0], context, seen);
        if (flattened.props.length === 0) {
            return opaque(node);
        }
        const keys = readKeys(args[1]);
        const kept = (prop: RegistryProp) =>
            helper === "Omit" ? !keys.includes(prop.name) : keys.includes(prop.name);
        return { ...flattened, props: flattened.props.filter(kept) };
    }

    const alias = context.aliases.get(name);
    if (alias && !seen.has(name)) {
        const flattened = flatten(alias.type, context, new Set([...seen, name]));
        return { ...flattened, reached: [...flattened.reached, name] };
    }

    return opaque(node);
};

const empty = (): Flattened => {
    return { props: [], inherits: [], reached: [] };
};

const opaque = (node: ts.TypeNode): Flattened => {
    return { props: [], inherits: [node.getText()], reached: [] };
};

const readProp = (member: ts.PropertySignature, context: Context): RegistryProp => {
    return {
        name: member.name.getText(),
        type: member.type ? tidy(member.type.getText()) : "unknown",
        required: member.questionToken === undefined,
        description: readComment(member, context.source),
        options: member.type ? readOptions(member.type, context.aliases, new Set()) : undefined,
    };
};

// The values a prop takes, where its type names them one by one. A union holding anything that
// is not a literal is describing a shape rather than listing values, so it is left alone
const readOptions = (
    node: ts.TypeNode,
    aliases: Aliases,
    seen: Set<string>,
): string[] | undefined => {
    if (ts.isUnionTypeNode(node)) {
        const values = node.types.map(readLiteral);
        return values.every((value) => value !== undefined) ? (values as string[]) : undefined;
    }

    if (ts.isTypeReferenceNode(node)) {
        const name = node.typeName.getText();
        const alias = aliases.get(name);
        if (alias && !seen.has(name)) {
            return readOptions(alias.type, aliases, new Set([...seen, name]));
        }
    }

    return undefined;
};

const readLiteral = (node: ts.TypeNode): string | undefined => {
    if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) {
        return node.literal.text;
    }
    if (node.kind === ts.SyntaxKind.NullKeyword) {
        return "null";
    }
    return undefined;
};

// The keys a narrowing was written against, which are string literals either on their own or
// in a union of them
const readKeys = (node: ts.TypeNode): string[] => {
    if (ts.isUnionTypeNode(node)) {
        return node.types.flatMap(readKeys);
    }
    const literal = readLiteral(node);
    return literal === undefined ? [] : [literal];
};

// A prop written on both sides of an intersection is the one prop, and a type is worth naming
// once however many times it was reached for
const dedupe = <T extends string | RegistryProp>(values: T[]): T[] => {
    const seen = new Set<string>();
    return values.filter((value) => {
        const key = typeof value === "string" ? value : value.name;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
};
