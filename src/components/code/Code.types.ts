import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type CodeProps<As extends React.ElementType = "code"> = PolymorphicProps<
    As,
    "code",
    {
        className?: string;
    }
>;
