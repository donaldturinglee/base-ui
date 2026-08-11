import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type ButtonGroupProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;
