import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type BlockquoteSize = "large" | "medium" | "small";

// How much weight the rule down the leading edge carries against whatever it is drawn on
export type BlockquoteVariant = "subtle" | "default" | "emphasis";

export type BlockquoteProps<As extends React.ElementType = "blockquote"> = PolymorphicProps<
    As,
    "blockquote",
    {
        size?: BlockquoteSize;
        variant?: BlockquoteVariant;
        className?: string;
    }
>;
