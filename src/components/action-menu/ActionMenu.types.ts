import type * as React from "react";
import type {
    AnchoredOverlayAnchorProps,
    AnchoredOverlayProps,
} from "../anchored-overlay/AnchoredOverlay.types";
import type { ButtonProps } from "../button";

// What dismissed the menu. A menu closes for more reasons than the overlay under it does,
// since picking an item or tabbing away closes it as well
export type ActionMenuCloseGesture =
    | "anchor-click"
    | "click-outside"
    | "escape"
    | "close-button"
    | "tab"
    | "item-select"
    | "arrow-left";

export type ActionMenuProps = {
    // Recommended: an `ActionMenu.Button` or `ActionMenu.Anchor`, and an `ActionMenu.Overlay`
    children: React.ReactNode;
    // Holds the open state outside the menu, alongside `onOpenChange`
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    // Stands in for the ref the menu would otherwise hold its anchor with
    anchorRef?: React.RefObject<HTMLElement | null>;
};

export type ActionMenuAnchorProps = React.HTMLAttributes<HTMLElement> & {
    // The one element the menu opens from
    children: React.ReactElement;
    id?: string;
};

export type ActionMenuButtonProps<As extends React.ElementType = "button"> = ButtonProps<As>;

export type ActionMenuOverlayProps = Pick<
    AnchoredOverlayProps,
    "align" | "side" | "width" | "height" | "variant" | "preventOverflow" | "className"
> & {
    // Recommended: an `ActionList`
    children: React.ReactNode;
    // Names the menu in place of the button that opens it
    "aria-labelledby"?: string;
    // Takes focus once the menu closes, in place of the anchor
    returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export type ActionMenuContextValue = {
    anchorRef: React.RefObject<HTMLElement | null>;
    // Handed to the overlay, which spreads it onto whatever the anchor renders
    renderAnchor: ((props: AnchoredOverlayAnchorProps) => React.ReactElement) | null;
    anchorId?: string;
    open: boolean;
    onOpen?: () => void;
    onClose?: (gesture: ActionMenuCloseGesture) => void;
    // A menu opened from an item of another menu, which closes with its parent
    isSubmenu?: boolean;
};
