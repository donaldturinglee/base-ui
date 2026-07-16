import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type HeadingSize = "large" | "medium" | "small";

export type HeadingProps<As extends React.ElementType = "h2"> = PolymorphicProps<
    As,
    "h2",
    {
        size?: HeadingSize;
        className?: string;
    }
>;
