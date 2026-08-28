import { constructorNameOf, DEFAULT_MAX_PREVIEW_ITEMS } from "./jsonNodes";
import type { JSONNode, JSONNodeType, JSONToken, JSONTreeViewOptions } from "./JSONTreeView.types";

// What stands either side of what a value holds, which is what says at a glance whether the rows
// underneath are a list or a set of names
const BRACKETS: Partial<Record<JSONNodeType, readonly [string, string]>> = {
    object: ["{", "}"],
    class: ["{", "}"],
    error: ["{", "}"],
    map: ["{", "}"],
    set: ["{", "}"],
    array: ["[", "]"],
};

// What a function is written as. A function is drawn by what it is rather than by what it does,
// since what it does is not something a tree has any way of showing
const functionText = (value: unknown) => {
    const name = (value as { name?: string }).name;
    const called = name === undefined || name === "" ? "anonymous" : name;
    const kind = Object.prototype.toString.call(value);

    if (kind === "[object AsyncFunction]") {
        return `async ƒ ${called}()`;
    }

    if (kind === "[object GeneratorFunction]" || kind === "[object AsyncGeneratorFunction]") {
        return `ƒ* ${called}()`;
    }

    return `ƒ ${called}()`;
};

// A string cut to the length it was allowed to run to, with something to say it was cut. The cut
// falls inside the quotes rather than taking one of them off, so a shortened string still reads as
// a string rather than as one somebody forgot to close
const clampString = (value: string, collapseStringsAfterLength: number) =>
    collapseStringsAfterLength > 0 && value.length > collapseStringsAfterLength
        ? `${value.slice(0, collapseStringsAfterLength)}…`
        : value;

// A value that holds nothing, written out as the one piece of text it reads as
export const toLeafText = (node: JSONNode, options: JSONTreeViewOptions = {}): string => {
    const { collapseStringsAfterLength = 0 } = options;
    const brackets = BRACKETS[node.type];

    // Something built to hold values that turned out to hold none reads as the pair of brackets it
    // would have been written between
    if (brackets !== undefined) {
        return `${countText(node)}${brackets[0]}${brackets[1]}`;
    }

    switch (node.type) {
        case "string":
            return `"${clampString(node.value as string, collapseStringsAfterLength)}"`;
        case "bigint":
            return `${String(node.value)}n`;
        case "function":
            return functionText(node.value);
        case "date":
            return (node.value as Date).toISOString();
        case "regex":
        case "symbol":
            return String(node.value);
        case "circular":
            return "[Circular]";
        default:
            return String(node.value);
    }
};

// How many things a row holds, written the way the kind of row is counted. A list says only how
// long it is; a map and a set say so under the name they were made by, since that is how they are
// written down everywhere else
const countText = (node: JSONNode) => {
    const held = node.children?.length ?? 0;

    if (node.type === "map" || node.type === "set") {
        return `${constructorNameOf(node.value)}(${held})`;
    }

    if (node.type === "class" || node.type === "error") {
        return constructorNameOf(node.value);
    }

    return "";
};

// The glimpse of a value given inside a closed row: enough of what it holds to tell it from its
// neighbours, and nothing like the whole of it
const toGlimpse = (node: JSONNode, options: JSONTreeViewOptions): string => {
    if (node.children === undefined) {
        return toLeafText(node, options);
    }

    const [open, close] = BRACKETS[node.type] ?? ["{", "}"];

    return `${countText(node)}${open}…${close}`;
};

// A value written out as the pieces it is drawn from, each carrying what it is so that it can be
// drawn as what it is.
//
// Whichever way a row is written, it closes every bracket it opens. Nothing standing under a row
// in a tree ever closes one for it — there is no line at the foot of what it holds, the way there
// is in a file — so a row that opened a bracket and left it would leave the reader looking at one
// that nothing ever answers.
//
// A closed row stands in place of everything it holds, so it gives as much of that away as it is
// allowed to. An open row has all of it standing underneath already, so it says only that it holds
// something: writing it out again above it would say the same thing twice, and a long line of it
// would be cut off at the end of the row — taking the closing bracket with it, which is the one
// part of the line that has to be there
export const toValueTokens = (
    node: JSONNode,
    options: JSONTreeViewOptions = {},
    isExpanded = false,
): JSONToken[] => {
    if (node.children === undefined) {
        return [{ text: toLeafText(node, options), type: node.type }];
    }

    const { maxPreviewItems = DEFAULT_MAX_PREVIEW_ITEMS } = options;
    const [open, close] = BRACKETS[node.type] ?? ["{", "}"];
    const name = countText(node);

    const tokens: JSONToken[] = [];

    if (name !== "") {
        tokens.push({ text: name, kind: "constructor" });
    }

    tokens.push({ text: open, kind: "bracket" });

    if (isExpanded) {
        tokens.push({ text: "…", kind: "more" }, { text: close, kind: "bracket" });

        return tokens;
    }

    // A list gives away what it holds; anything else gives away what it calls what it holds, since
    // a row of bare values says little about an object and its names say a great deal
    const shown = node.children.slice(0, Math.max(maxPreviewItems, 0));

    shown.forEach((child, index) => {
        if (index > 0) {
            tokens.push({ text: ", ", kind: "separator" });
        }

        if (node.type !== "array" && node.type !== "set" && child.key !== undefined) {
            tokens.push({ text: `${child.key}: `, kind: "separator" });
        }

        tokens.push({ text: toGlimpse(child, options), type: child.type });
    });

    if (shown.length < node.children.length) {
        tokens.push({ text: shown.length > 0 ? ", …" : "…", kind: "more" });
    }

    tokens.push({ text: close, kind: "bracket" });

    return tokens;
};

// What the row is called for a reader who cannot see it. The punctuation a value is written in is
// what tells a string from a number and a list from an object on the page, and none of it reads
// aloud as anything, so the row says in words what its brackets and quotes say by sight
export const describeNode = (node: JSONNode, options: JSONTreeViewOptions = {}): string => {
    const called = node.key === undefined ? "" : `${node.key}, `;

    if (node.children === undefined) {
        return `${called}${node.type}, ${toLeafText(node, options)}`;
    }

    const held = node.children.length;

    return `${called}${node.type}, ${held} ${held === 1 ? "item" : "items"}`;
};
