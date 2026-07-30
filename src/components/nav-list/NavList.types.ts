import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type {
    ActionListDescriptionProps,
    ActionListDividerProps,
    ActionListGroupHeadingProps,
    ActionListTrailingActionProps,
    ActionListVisualProps,
} from "../action-list";
import type { ButtonVisual } from "../button";

// Which page of a site the item stands for, in the terms `aria-current` is read in
export type NavListCurrent = "page" | "step" | "location" | "date" | "time" | "true" | "false";

// A nav list is named by a heading of its own, and its groups are headed one level deeper.
// The page title is the h1, so the list never stands as high as that, and it never runs
// deeper than an h4
export type NavListHeadingLevel = "h2" | "h3";

export type NavListProps = React.ComponentPropsWithoutRef<"nav"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavListHeadingProps = Omit<React.ComponentPropsWithoutRef<"h2">, "children"> & {
    as?: NavListHeadingLevel;
    // Names the list for a screen reader without being drawn on the page
    visuallyHidden?: boolean;
    children?: React.ReactNode;
    className?: string;
};

export type NavListItemProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        children?: React.ReactNode;
        // Which page the item stands for. The item that stands for the page being read is
        // the one the list shows as current
        "aria-current"?: NavListCurrent | boolean;
        // Opens an item's sub-list from the start. Only means anything on an item that has
        // one, since there is otherwise nothing to open
        defaultOpen?: boolean;
        className?: string;
    }
>;

export type NavListSubNavProps = React.ComponentPropsWithoutRef<"ul"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavListGroupProps = React.ComponentPropsWithoutRef<"li"> & {
    children?: React.ReactNode;
    // Names the group. Use `NavList.GroupHeading` instead where the heading holds more
    // than plain text, a link say
    title?: string;
    // Leaves out the line that would otherwise set the group apart from what comes before
    hideDivider?: boolean;
    className?: string;
};

export type NavListGroupHeadingProps = ActionListGroupHeadingProps;

// An item of a group that is only shown once the group has been expanded. The list draws
// these itself, so they are described rather than written out
export type NavListGroupExpandItem = Omit<NavListItemProps, "children"> & {
    text: string;
    leadingVisual?: React.ElementType;
    trailingVisual?: React.ElementType | React.ReactNode;
    trailingAction?: NavListTrailingActionProps;
    // Marks the item a reader is sent to once more of the group has been shown. The list
    // sets this itself, and a renderer of the caller's own has to pass it on
    "data-expand-focus-target"?: string;
};

export type NavListGroupExpandProps = Omit<
    React.ComponentPropsWithoutRef<"li">,
    "children" | "onSelect"
> & {
    // What the button that shows more items says
    label?: string;
    // How many presses it takes to show every item. Left at none, one press shows them all
    pages?: number;
    items: NavListGroupExpandItem[];
    // Draws an item in place of the list's own rendering
    renderItem?: (item: NavListGroupExpandItem) => React.ReactNode;
    className?: string;
};

export type NavListDescriptionProps = ActionListDescriptionProps;

export type NavListLeadingVisualProps = ActionListVisualProps;

export type NavListTrailingVisualProps = ActionListVisualProps;

export type NavListTrailingActionProps = ActionListTrailingActionProps;

export type NavListDividerProps = ActionListDividerProps;

export type NavListVisual = ButtonVisual;
