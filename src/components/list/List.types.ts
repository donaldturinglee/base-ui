import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// What marks each item off from the next. The words match the ones the markdown renderer
// already draws its lists by, so a bulleted list is a bulleted list wherever it comes from
export type ListVariant = "bullet" | "number" | "plain";

// How far apart the items sit, for a run read as prose against one read as a set of things
export type ListSpacing = "condensed" | "normal" | "spacious";

export type ListProps<As extends React.ElementType = "ul"> = PolymorphicProps<
    As,
    "ul",
    {
        variant?: ListVariant;
        spacing?: ListSpacing;
        className?: string;
    }
>;

export type ListItemProps<As extends React.ElementType = "li"> = PolymorphicProps<
    As,
    "li",
    {
        className?: string;
    }
>;
