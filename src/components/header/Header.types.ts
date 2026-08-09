import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type HeaderProps<As extends React.ElementType = "header"> = PolymorphicProps<
    As,
    "header",
    {
        className?: string;
    }
>;

export type HeaderItemProps = React.ComponentPropsWithoutRef<"div"> & {
    // Gives the item whatever room the rest of the row leaves, which pushes everything
    // after it to the far end
    full?: boolean;
    className?: string;
};

export type HeaderLinkProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        className?: string;
    }
>;
