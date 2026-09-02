import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type StrongSize = "large" | "medium" | "small";

export type StrongProps<As extends React.ElementType = "strong"> = PolymorphicProps<
    As,
    "strong",
    {
        size?: StrongSize;
        className?: string;
    }
>;
