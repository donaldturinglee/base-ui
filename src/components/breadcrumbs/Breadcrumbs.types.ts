import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// What becomes of the trail once it no longer fits across the page
export type BreadcrumbsOverflow = "wrap" | "menu" | "menu-with-root";

// How much room each step of the trail is given
export type BreadcrumbsVariant = "normal" | "spacious";

export type BreadcrumbsProps = React.PropsWithChildren<{
    overflow?: BreadcrumbsOverflow;
    variant?: BreadcrumbsVariant;
    className?: string;
    style?: React.CSSProperties;
}>;

export type BreadcrumbsItemProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        // Marks the item as the page the reader is already on, which is the last step of
        // the trail and the one step that is not somewhere to go
        selected?: boolean;
        className?: string;
    }
>;

export type BreadcrumbsOverflowMenuProps = {
    // The steps that no longer fit, given as the items the trail was written with
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: React.ReactElement<any>[];
};
