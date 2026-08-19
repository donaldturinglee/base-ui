import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type PlaceholderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        width?: string;
        height: string;
        label?: string;
        className?: string;
    }
>;
