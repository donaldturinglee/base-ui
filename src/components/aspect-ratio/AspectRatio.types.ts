import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// The shape the box keeps, either one of the ones asked for often enough to name or one
// worked out from a width and a height of the caller's own
export type AspectRatioRatio = "1:1" | "16:9" | "4:3" | "custom";

export type AspectRatioProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        ratio?: AspectRatioRatio;
        width?: number;
        height?: number;
        className?: string;
    }
>;
