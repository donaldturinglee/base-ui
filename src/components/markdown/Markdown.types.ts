import type * as React from "react";
import type { Transformer } from "@lexical/markdown";
import type { LexicalEditor } from "lexical";

// `children` is narrowed to a string, since what is passed is markdown to be read rather than
// elements to be drawn
export type MarkdownProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    // The markdown itself, as one string. It is read again whenever it changes
    children?: string;
    // Which syntax is looked for, and in what order. Only worth passing where a caller has
    // syntax of their own to add, or wants less of it read than the component reads by default
    transformers?: Transformer[];
    // Keeps every line break as it was written, rather than joining the lines of a paragraph
    // the way markdown does
    preserveNewLines?: boolean;
    // Tells one editor's clipboard from another's. There is nothing here to copy out as nodes,
    // so it is only worth setting to tell two of these apart while debugging
    namespace?: string;
    // Called where Lexical could not read the markdown. It throws by default, since markdown
    // that has quietly failed to be read looks the same as markdown that was empty
    onError?: (error: Error, editor: LexicalEditor) => void;
    className?: string;
};

// The one element the component renders, which is the element Lexical draws what it has read
// into. It is split out only because it has to stand inside the editor to reach it
export type MarkdownProseProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    source: string;
    transformers: Transformer[];
    preserveNewLines?: boolean;
    className?: string;
};
