import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Exactly one of the two labels has to be given, so an overflowing region is never
// announced without a name
type Labelled =
    | { "aria-label": string; "aria-labelledby"?: never }
    | { "aria-label"?: never; "aria-labelledby": string };

export type ScrollableRegionProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    Labelled & {
        className?: string;
    }
>;
