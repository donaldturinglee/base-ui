import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type SkeletonBoxProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        width?: string;
        height?: string;
        className?: string;
    }
>;
