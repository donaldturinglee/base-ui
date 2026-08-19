import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type TruncateProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        title: string;
        maxWidth?: number | string;
        inline?: boolean;
        expandable?: boolean;
        className?: string;
    }
>;
