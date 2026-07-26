import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type AlertVariant = "default" | "success" | "warning" | "danger";

export type AlertProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        variant?: AlertVariant;
        full?: boolean;
        className?: string;
    }
>;
