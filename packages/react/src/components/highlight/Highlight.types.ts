import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { MarkVariant } from "../mark";

// What to look for. A single term is the usual case; a list picks out several at once
export type HighlightMatch = string | string[];

// One run of the text as it is drawn: either a run a term stood for, or the text between two
// of them. The runs come in the order they are read, and together they hold the whole of the
// text they were split from
export type HighlightChunk = {
    text: string;
    matched: boolean;
};

export type HighlightProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        // The text the terms are looked for in, which is given as text rather than as elements
        // so that the runs can be found within it
        children?: string;
        // The term or terms to pick out. An empty term is passed over, and none at all leaves
        // the text as it was written
        match?: HighlightMatch;
        // Whether a term only stands where the letters match in case as well
        caseSensitive?: boolean;
        // Colour the runs are picked out in, which the marks are drawn with
        variant?: MarkVariant;
        className?: string;
    }
>;
