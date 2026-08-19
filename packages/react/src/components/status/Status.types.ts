import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type StatusVariant =
    "accent" | "success" | "attention" | "severe" | "danger" | "done" | "neutral";

export type StatusSize = "small" | "medium" | "large";

export type StatusProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        variant?: StatusVariant;
        size?: StatusSize;
        srText?: string;
        className?: string;
    }
>;

export type StatusIndicatorProps = React.ComponentPropsWithoutRef<"span"> & {
    variant?: StatusVariant;
    size?: StatusSize;
    className?: string;
};

export type StatusContextValue = {
    variant?: StatusVariant;
    size?: StatusSize;
};
