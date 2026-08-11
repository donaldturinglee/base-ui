import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type EmSize = "large" | "medium" | "small";

export type EmWeight = "light" | "normal" | "medium" | "semibold";

export type EmProps<As extends React.ElementType = "em"> = PolymorphicProps<
    As,
    "em",
    {
        size?: EmSize;
        weight?: EmWeight;
        className?: string;
    }
>;
