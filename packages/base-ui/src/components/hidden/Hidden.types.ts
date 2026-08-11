import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type HiddenViewport = "narrow" | "regular" | "wide";

export type HiddenProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        when: HiddenViewport | HiddenViewport[];
        className?: string;
    }
>;
