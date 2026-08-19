import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type LayerCardProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

// Both layers take the same props. The primary one is often a link to whatever it stands for,
// which is what the `as` prop is for
export type LayerCardSectionProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;
