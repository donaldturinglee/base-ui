import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type ProgressCircleSize = "small" | "medium" | "large";

export type ProgressCircleVariant =
    "accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success";

export type ProgressCircleProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        progress?: number;
        size?: ProgressCircleSize;
        variant?: ProgressCircleVariant;
        className?: string;
    }
>;
