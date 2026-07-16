import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type SpinnerSize = "small" | "medium" | "large";

export type SpinnerProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        size?: SpinnerSize;
        srText?: string | null;
        className?: string;
    }
>;
