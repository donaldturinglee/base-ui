import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type StackGap = "none" | "tight" | "condensed" | "cozy" | "normal" | "spacious";

export type StackDirection = "horizontal" | "vertical";

export type StackAlign = "stretch" | "start" | "center" | "end" | "baseline";

export type StackWrap = "wrap" | "nowrap";

export type StackJustify = "start" | "center" | "end" | "space-between" | "space-evenly";

export type StackPadding = "none" | "tight" | "condensed" | "cozy" | "normal" | "spacious";

export type StackProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        gap?: StackGap;
        direction?: StackDirection;
        align?: StackAlign;
        wrap?: StackWrap;
        justify?: StackJustify;
        padding?: StackPadding;
        paddingBlock?: StackPadding;
        paddingInline?: StackPadding;
        className?: string;
    }
>;

export type StackItemProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        grow?: boolean;
        shrink?: boolean;
        className?: string;
    }
>;
