import type * as React from "react";
import type { DistributiveOmit } from "../../utilities/polymorphic";
import type { ButtonVisual } from "../button";

// How far a sub-tree has got with fetching what it holds. Left unsaid, the sub-tree is
// taken to hold everything it will ever hold
export type TreeViewSubTreeState = "initial" | "loading" | "done" | "error";

// A visual either draws the same thing whatever the item is doing, or is handed whether
// the item is open so that it can draw something else while it is
export type TreeViewVisualChildren =
    React.ReactNode | ((props: { isExpanded: boolean }) => React.ReactNode);

// Something more an item can do, reached from a button standing at the end of the row or
// from the dialog those buttons are collected into
export type TreeViewSecondaryAction = {
    label: string;
    onClick: () => void;
    // An action carries no text of its own on the row, so it always has an icon to be
    // drawn as
    icon: NonNullable<ButtonVisual>;
    // Shown beside the label, for an action that stands for a number of things
    count?: number | string;
    className?: string;
};

export type TreeViewProps = React.ComponentPropsWithoutRef<"ul"> & {
    children?: React.ReactNode;
    // Draws every item at the same depth, for a tree standing in for a flat list
    flat?: boolean;
    // Cuts a label that is too long to fit rather than running it onto another line
    truncate?: boolean;
    className?: string;
};

type TreeViewItemBaseProps = {
    // Tells one item from another, and holds its open state across the times it is drawn
    id: string;
    children?: React.ReactNode;
    // Whether this is the item the reader is looking at
    current?: boolean;
    defaultExpanded?: boolean;
    // Holds the open state from outside. `null` says the item can never be opened, which
    // is what an item standing in for an empty sub-tree is
    expanded?: boolean | null;
    onExpandedChange?: (expanded: boolean) => void;
    // Called when the item is picked. Without one, picking the item opens it instead
    onSelect?: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    // Lets the browser skip drawing the row while it is out of view, given what to stand
    // in for its size until it comes back
    containIntrinsicSize?: string;
    secondaryActions?: TreeViewSecondaryAction[];
    className?: string;
};

// `onSelect` means something else on a plain `li`, so the item's own version replaces it.
// `DistributiveOmit` keeps the omit distributing over whatever `as` is given
export type TreeViewItemProps<As extends React.ElementType = "li"> = DistributiveOmit<
    React.ComponentPropsWithoutRef<React.ElementType extends As ? "li" : As>,
    "as" | "onSelect"
> &
    TreeViewItemBaseProps & { as?: As };

export type TreeViewSubTreeProps = {
    children?: React.ReactNode;
    state?: TreeViewSubTreeState;
    // How many rows to stand in for what is being fetched. Without one, a single spinner
    // stands in for the whole of it
    count?: number;
    "aria-label"?: string;
};

export type TreeViewVisualProps = {
    children?: TreeViewVisualChildren;
    // Says what the visual stands for, for a reader who cannot see it
    label?: string;
};

export type TreeViewTrailingActionProps = {
    items: TreeViewSecondaryAction[];
    // Says which keys reach the actions, since the buttons themselves are not tabbed to
    shortcutText: string;
};

export type TreeViewActionDialogProps = {
    items: TreeViewSecondaryAction[];
    onClose?: () => void;
};

export type TreeViewErrorDialogProps = {
    children?: React.ReactNode;
    title?: string;
    onRetry?: () => void;
    onDismiss?: () => void;
};
