import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type DividerOrientation = "horizontal" | "vertical";

// How much weight the line carries against whatever it is drawn on
export type DividerVariant = "subtle" | "default" | "emphasis";

export type DividerProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        orientation?: DividerOrientation;
        variant?: DividerVariant;
        className?: string;
    }
>;
