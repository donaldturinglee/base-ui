import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type TextSize = "large" | "medium" | "small";

export type TextWeight = "light" | "normal" | "medium" | "semibold";

export type TextWhiteSpace = "pre" | "normal" | "nowrap" | "pre-wrap" | "pre-line";

export type TextProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        size?: TextSize;
        weight?: TextWeight;
        whiteSpace?: TextWhiteSpace;
        className?: string;
    }
>;
