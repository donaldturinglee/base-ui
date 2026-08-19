import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type CounterLabelVariant = "primary" | "secondary";

export type CounterLabelProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        variant?: CounterLabelVariant;
        className?: string;
    }
>;
