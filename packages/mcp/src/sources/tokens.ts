import type { RegistryToken, RegistryTokenScheme } from "../registry/registry.types";
import { normalize, tidy } from "./syntax";

// The design tokens are written in CSS rather than in TypeScript, as custom properties on one
// block per stylesheet: the primitives on `@theme`, and a scheme's own on the `[data-theme]` it
// answers under. Nothing else in those files is a token, so a block is only read where its
// selector says the tokens are what it holds

// Either a comment, a custom property, or a brace: the three things worth stopping at in a
// stylesheet that is being read for what it declares rather than for what it draws
const SCANNER = /\/\*([\s\S]*?)\*\/|(--[\w-]+)\s*:\s*([^;]*);|([{}])/g;

export type TokenSource = {
    // Which scheme the stylesheet's values hold under, since the same token is answered by a
    // value of its own in each of them
    scheme: RegistryTokenScheme;
    text: string;
};

type Declaration = {
    name: string;
    value: string;
    group: string;
    description?: string;
};

export const readTokens = (sources: TokenSource[]): RegistryToken[] => {
    const tokens = new Map<string, RegistryToken>();

    for (const source of sources) {
        for (const declaration of readDeclarations(source.text)) {
            const token = tokens.get(declaration.name) ?? {
                name: declaration.name,
                group: namespace(declaration.name),
                values: {},
            };

            token.values[source.scheme] = declaration.value;
            // A stylesheet that groups its tokens under a heading has said something a name
            // cannot, so that is taken over the namespace the name was read for
            if (declaration.group !== "") {
                token.group = declaration.group;
            }
            token.description = token.description ?? declaration.description;
            tokens.set(declaration.name, token);
        }
    }

    return [...tokens.values()].sort((one, other) => one.name.localeCompare(other.name));
};

const readDeclarations = (text: string): Declaration[] => {
    const declarations: Declaration[] = [];
    let depth = 0;
    let selector = "";
    let group = "";
    let cursor = 0;
    // The declaration a comment would be describing, where the comment turns out to be on the
    // same line as it rather than on a line of its own above the next one
    let described: Declaration | undefined;
    let describedEnd = 0;

    for (const match of text.matchAll(SCANNER)) {
        const [whole, comment, name, value, brace] = match;
        const index = match.index;

        if (brace !== undefined) {
            depth += brace === "{" ? 1 : -1;
            if (brace === "{" && depth === 1) {
                selector = normalize(text.slice(cursor, index));
                group = "";
            }
            described = undefined;
        } else if (comment !== undefined) {
            const trailing = described && !text.slice(describedEnd, index).includes("\n");
            if (trailing && described) {
                described.description = normalize(comment.replace(/^\*+/, ""));
            } else if (depth === 1) {
                group = normalize(comment);
            }
            described = undefined;
        } else if (name !== undefined && depth === 1 && holdsTokens(selector)) {
            const declaration = { name, value: tidy(value ?? ""), group };
            declarations.push(declaration);
            described = declaration;
            describedEnd = index + whole.length;
        }

        cursor = index + whole.length;
    }

    return declarations;
};

// The two blocks a token is ever declared on. Everything else a stylesheet holds declares
// custom properties to draw with rather than to be read as design tokens
const holdsTokens = (selector: string): boolean => {
    return selector.startsWith("@theme") || selector.startsWith("[data-theme");
};

// What the token's name starts with, which is the closest thing to a group a stylesheet that
// does not head its tokens with one gives them
const namespace = (name: string): string => {
    return name.replace(/^--/, "").split("-")[0] ?? "";
};
