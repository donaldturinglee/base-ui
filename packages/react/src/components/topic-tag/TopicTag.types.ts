import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type TopicTagProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        className?: string;
    }
>;

export type TopicTagGroupProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;
