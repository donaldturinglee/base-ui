import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type AspectRatioProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        // The shape the box keeps, written the way it is worked out, so 16 / 9 rather than a
        // number a caller has to divide first
        ratio?: number;
        className?: string;
    }
>;
