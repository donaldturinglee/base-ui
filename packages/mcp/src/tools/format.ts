import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import type { Registry, RegistryProp } from "../registry/registry.types";

// Every answer is written in Markdown. What asks the questions reads prose rather than parsing
// a payload, and a heading and a list carry the shape of an answer in a way a wall of text
// does not

export const reply = (markdown: string): CallToolResult => {
    return { content: [{ type: "text", text: markdown }] };
};

export const fence = (language: string, source: string): string => {
    return ["```" + language, source, "```"].join("\n");
};

// How anything the library exports is reached. The package root is the one place an application
// ever imports from, however deep inside the library the component is written
export const importLine = (registry: Registry, names: string[]): string => {
    return `import { ${names.join(", ")} } from "${registry.package}";`;
};

// A prop said the way it is written, so that what is optional reads as optional
export const signature = (prop: RegistryProp): string => {
    return `${prop.name}${prop.required ? "" : "?"}: ${prop.type}`;
};

// So many of a thing, said with the word for one of them where there is only one
export const count = (amount: number, one: string, many = `${one}s`): string => {
    return `${amount} ${amount === 1 ? one : many}`;
};

// A list said as a sentence would say it rather than as a comma between everything
export const join = (values: string[]): string => {
    if (values.length < 2) {
        return values.join("");
    }
    return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
};
