import type * as React from "react";
import type { AnchoredOverlayProps } from "../anchored-overlay/AnchoredOverlay.types";

// Where on the page the menu was asked for. A press leaves nothing standing behind for the
// menu to be measured against, so the point it was made at is measured against instead
export type ContextMenuPoint = {
    x: number;
    y: number;
    // How much room is left around the point. A finger covers what it presses, so a menu
    // opened by one stands clear of it rather than underneath it
    size: number;
};

export type ContextMenuProps = {
    // Recommended: a `ContextMenu.Trigger` and a `ContextMenu.Overlay`
    children: React.ReactNode;
    // Holds the open state outside the menu, alongside `onOpenChange`. A menu opened this
    // way stands where it was last pressed open, and at the top left corner until it has been
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    // Leaves the press alone, so the browser answers it with the menu it would have shown
    disabled?: boolean;
    // Which registered portal the menu is rendered into, for a page that keeps more than one
    portalContainerName?: string;
};

export type ContextMenuTriggerProps = React.ComponentPropsWithoutRef<"div"> & {
    // Whatever the menu is about, which is drawn as it was given
    children?: React.ReactNode;
    className?: string;
};

export type ContextMenuOverlayProps = Pick<
    AnchoredOverlayProps,
    "align" | "side" | "width" | "height" | "variant" | "preventOverflow" | "className"
> & {
    // Recommended: an `ActionList`
    children: React.ReactNode;
    // Names the menu, which has no button standing on the page to take a name from
    "aria-label"?: string;
    // Names it after something already on the page, in place of `aria-label`
    "aria-labelledby"?: string;
    // Takes focus once the menu closes, in place of the area it was opened from
    returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export type ContextMenuContextValue = {
    // The area the menu was opened from, which takes focus back once it closes
    triggerRef: React.RefObject<HTMLDivElement | null>;
    // Where the press that opened the menu landed
    point: ContextMenuPoint;
    open: boolean;
    disabled?: boolean;
    onOpen?: (point: ContextMenuPoint) => void;
    onClose?: () => void;
    portalContainerName?: string;
};
