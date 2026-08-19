import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// How the picture is made to sit in the box it is given, where that box is a shape of its own
// rather than one the picture settles for itself
export type ImageFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export type ImageBorderRadius = "none" | "small" | "medium" | "large" | "full";

export type ImageProps<As extends React.ElementType = "img"> = PolymorphicProps<
    As,
    "img",
    {
        fit?: ImageFit;
        borderRadius?: ImageBorderRadius;
        fallbackSrc?: string;
        className?: string;
    }
>;
