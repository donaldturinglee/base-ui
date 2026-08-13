import ts from "typescript";

// The few things every reader of a TypeScript source needs, kept here rather than in whichever
// of them happened to want it first

export const isExported = (node: ts.Node): boolean => {
    return (
        ts.canHaveModifiers(node) &&
        (ts.getModifiers(node) ?? []).some((modifier) => {
            return modifier.kind === ts.SyntaxKind.ExportKeyword;
        })
    );
};

// What was said just above a declaration. Several lines of comment are one thing said over
// several lines rather than several things, so they come back as one line of prose
export const readComment = (node: ts.Node, source: ts.SourceFile): string | undefined => {
    const text = source.getFullText();
    const ranges = ts.getLeadingCommentRanges(text, node.getFullStart()) ?? [];
    const said = ranges
        .map((range) => text.slice(range.pos, range.end))
        .map((comment) => comment.replace(/^\/\/+|^\/\*+|\*+\/$/g, ""))
        .map((comment) => comment.replace(/^\s*\*/gm, ""))
        .join(" ");

    const description = normalize(said);
    return description === "" ? undefined : description;
};

// A type or a declaration is written across as many lines as it reads well over, and none of
// that survives being quoted back on its own
export const normalize = (text: string): string => {
    return text.replace(/\s+/g, " ").trim();
};

// The same again, for what was written to be read as one thing rather than as prose: a type or
// a value broken over several lines to fit a column comes back carrying the room those lines
// left inside its brackets, along with the comma that only the last line of a list is given.
// Neither is how it would have been written on a line of its own
export const tidy = (text: string): string => {
    return normalize(text)
        .replace(/([<(])\s+/g, "$1")
        .replace(/,?\s+([>)])/g, "$1");
};

// A name written the way a declaration is said the way a sentence is, so that a story called
// `VariantScale` is offered as the variant scale it shows
export const titleize = (name: string): string => {
    return name
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
        .trim();
};

// Whether a source reaches for a name, which is as much as can be told without resolving it
export const mentions = (source: string, name: string): boolean => {
    return new RegExp(`\\b${name}\\b`).test(source);
};
