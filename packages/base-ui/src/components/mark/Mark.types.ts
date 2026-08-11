import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type MarkVariant = "attention" | "accent" | "success" | "danger" | "neutral";

export type MarkSize = "large" | "medium" | "small";

export type MarkWeight = "light" | "normal" | "medium" | "semibold";

export type MarkProps<As extends React.ElementType = "mark"> = PolymorphicProps<
    As,
    "mark",
    {
        variant?: MarkVariant;
        size?: MarkSize;
        weight?: MarkWeight;
        className?: string;
    }
>;
