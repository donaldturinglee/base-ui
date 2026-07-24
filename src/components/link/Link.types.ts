import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type LinkProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        muted?: boolean;
        inline?: boolean;
        className?: string;
    }
>;
