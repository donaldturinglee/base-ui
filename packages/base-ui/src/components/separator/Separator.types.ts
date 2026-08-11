import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type SeparatorOrientation = "horizontal" | "vertical";

// How much weight the line carries against whatever it is drawn on
export type SeparatorVariant = "subtle" | "default" | "emphasis";

export type SeparatorProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        orientation?: SeparatorOrientation;
        variant?: SeparatorVariant;
        className?: string;
    }
>;
