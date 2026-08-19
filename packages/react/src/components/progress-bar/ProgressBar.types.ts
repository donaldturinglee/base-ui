import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type ProgressBarSize = "small" | "medium" | "large";

export type ProgressBarVariant =
    "accent" | "attention" | "danger" | "done" | "neutral" | "severe" | "sponsors" | "success";

export type ProgressBarProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        progress?: number;
        size?: ProgressBarSize;
        variant?: ProgressBarVariant;
        inline?: boolean;
        animated?: boolean;
        className?: string;
    }
>;

export type ProgressBarItemProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        progress?: number;
        variant?: ProgressBarVariant;
        animated?: boolean;
        className?: string;
    }
>;
