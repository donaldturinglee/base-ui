import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type LabelSize = "small" | "medium" | "large";

export type LabelVariant =
    | "default"
    | "primary"
    | "secondary"
    | "accent"
    | "success"
    | "attention"
    | "severe"
    | "danger"
    | "done"
    | "sponsors";

export type LabelProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        variant?: LabelVariant;
        size?: LabelSize;
        className?: string;
    }
>;
