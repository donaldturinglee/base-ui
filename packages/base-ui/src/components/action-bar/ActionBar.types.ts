import type * as React from "react";
import type { ActionListItemVariant, ActionListSelectEvent } from "../action-list";
import type { ButtonProps, ButtonVisual } from "../button";
import type { IconButtonProps } from "../icon-button";

export type ActionBarSize = "small" | "medium" | "large";

// How much room is left between one item and the next
export type ActionBarGap = "none" | "condensed";

// A toolbar has to be named, one way or the other, since it is a landmark of its own
type ActionBarAccessibleName =
    | { "aria-label": string; "aria-labelledby"?: undefined }
    | { "aria-label"?: undefined; "aria-labelledby": string };

export type ActionBarProps = {
    size?: ActionBarSize;
    children?: React.ReactNode;
    // Lets the bar sit flush with whatever holds it, rather than held in from the edges
    flush?: boolean;
    gap?: ActionBarGap;
    className?: string;
} & ActionBarAccessibleName;

export type ActionBarButtonProps = ButtonProps;

export type ActionBarIconButtonProps = IconButtonProps;

export type ActionBarDividerProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type ActionBarGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// What the menu holds, given as plain objects rather than as elements, so that the same
// items can be drawn in the bar's own overflow menu
export type ActionBarMenuItem =
    | {
          type?: "action";
          label: string;
          disabled?: boolean;
          variant?: ActionListItemVariant;
          leadingVisual?: ButtonVisual;
          trailingVisual?: ButtonVisual | string;
          onClick?: (event: ActionListSelectEvent) => void;
          // Items of its own, which the item brings out as a menu within the menu
          items?: ActionBarMenuItem[];
      }
    | { type: "divider" };

// The menu button is always named by `aria-label`, since the overflow menu shows that name
// as the label of the item it becomes
export type ActionBarMenuProps = Omit<
    IconButtonProps,
    "icon" | "aria-label" | "aria-labelledby"
> & {
    "aria-label": string;
    icon: NonNullable<ButtonVisual>;
    items: ActionBarMenuItem[];
    // Stands in for the icon once the menu itself has been moved into the overflow menu
    overflowIcon?: ButtonVisual;
    // Takes focus once the menu closes, in place of the button that opened it
    returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export type ActionBarContextValue = {
    size: ActionBarSize;
    // The row the items are clipped by, which is what says whether they still fit
    rootRef?: React.RefObject<HTMLElement | null>;
    setOverflowing?: (index: number, overflowing: boolean) => void;
};

export type ActionBarItemContextValue = {
    // Where the item stands in the bar, which is how it reports that it no longer fits
    index?: number;
    // An item inside a group is carried by the group, so it never reports for itself
    inGroup?: boolean;
};
