import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonVisual } from "../button";

// How far the items are held in from the edges of whatever the list is drawn on
export type ActionListVariant = "inset" | "full";

// Whether one item or several can be picked
export type ActionListSelectionVariant = "single" | "multiple";

export type ActionListItemVariant = "default" | "danger";

export type ActionListItemSize = "medium" | "large";

// Whether the secondary text stands beside the label or below it
export type ActionListDescriptionVariant = "inline" | "block";

// How much a group is set apart from what surrounds it
export type ActionListGroupVariant = "subtle" | "filled";

// An item is picked either by pointer or by key, and the caller is handed whichever it was
export type ActionListSelectEvent =
    React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;

export type ActionListProps<As extends React.ElementType = "ul"> = PolymorphicProps<
    As,
    "ul",
    {
        variant?: ActionListVariant;
        selectionVariant?: ActionListSelectionVariant;
        // Draws a line above every item that does not already follow one
        showDividers?: boolean;
        // Leaves the arrow keys alone, for a list that is navigated some other way
        disableFocusZone?: boolean;
        className?: string;
    }
>;

// `onSelect` means something else on a plain `li`, so the list item's own version replaces
// it. The content element is whatever `as` says, in place of the button or the plain box
// the list semantics would otherwise call for
export type ActionListItemProps<As extends React.ElementType = never> = Omit<
    React.ComponentPropsWithoutRef<"li">,
    "onSelect"
> & {
    // Called when the item is picked, by pointer or by key. An item that is disabled,
    // inactive or loading is never picked
    onSelect?: (event: ActionListSelectEvent) => void;
    selected?: boolean;
    // The one item the list is currently showing. There is never more than one
    active?: boolean;
    variant?: ActionListItemVariant;
    size?: ActionListItemSize;
    disabled?: boolean;
    loading?: boolean;
    // Says why the item cannot be used at the moment, and stops it being used
    inactiveText?: string;
    className?: string;
    // Renders the content as something else, which is what a link item is
    as?: As;
};

export type ActionListLinkItemProps<As extends React.ElementType = "a"> = Omit<
    ActionListItemProps<As>,
    "selected" | "loading" | "onSelect"
> &
    Pick<React.ComponentPropsWithoutRef<"a">, "href" | "hrefLang" | "rel" | "target" | "download">;

export type ActionListGroupProps = React.ComponentPropsWithoutRef<"li"> & {
    variant?: ActionListGroupVariant;
    // Overrides what the list itself says about picking items
    selectionVariant?: ActionListSelectionVariant | false;
    className?: string;
};

export type ActionListGroupHeadingProps = Omit<React.ComponentPropsWithoutRef<"h3">, "children"> & {
    // Required where the list is a plain list, since a heading there is a real heading and
    // needs a level. A menu or a listbox renders it as presentation instead
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    variant?: ActionListGroupVariant;
    // Secondary text below the heading
    auxiliaryText?: string;
    children?: React.ReactNode;
    className?: string;
};

export type ActionListHeadingProps<As extends React.ElementType = "h3"> = PolymorphicProps<
    As,
    "h3",
    {
        as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
        // Names the list for a screen reader without being drawn on the page
        visuallyHidden?: boolean;
        className?: string;
    }
>;

export type ActionListDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    variant?: ActionListDescriptionVariant;
    className?: string;
};

export type ActionListDividerProps = React.ComponentPropsWithoutRef<"li"> & {
    className?: string;
};

export type ActionListVisualProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

// A second thing an item can do, standing beside the item's own action rather than inside
// it. `label` is what names it, so there is nothing left for a caller to name it with
export type ActionListTrailingActionProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "aria-label" | "aria-labelledby"
> & {
    icon?: ButtonVisual;
    // Names the action, and is the label itself where there is no icon
    label: string;
    className?: string;
};

export type ActionListContextValue = {
    variant?: ActionListVariant;
    selectionVariant?: ActionListSelectionVariant;
    showDividers?: boolean;
    role?: React.AriaRole;
    headingId?: string;
};

export type ActionListItemContextValue = {
    variant?: ActionListItemVariant;
    size?: ActionListItemSize;
    disabled?: boolean;
    inactive?: boolean;
    inlineDescriptionId?: string;
    blockDescriptionId?: string;
    trailingVisualId?: string;
};

export type ActionListGroupContextValue = {
    selectionVariant?: ActionListSelectionVariant | false;
    groupHeadingId?: string;
};

// What a component that holds an `ActionList` inside itself — a menu, say — tells the list
// about the surroundings it has been put in
export type ActionListContainerContextValue = {
    // Which component the list is standing inside, where it is standing inside one
    container?: string;
    listRole?: React.AriaRole;
    listLabelledBy?: string;
    selectionAttribute?: "aria-selected" | "aria-checked";
    // Called after an item is picked, so the container can close itself
    afterSelect?: (event: ActionListSelectEvent) => void;
    enableFocusZone?: boolean;
    // Stands at the end of every item that has no trailing visual of its own
    defaultTrailingVisual?: React.ReactNode;
};
