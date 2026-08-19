import type * as React from "react";
import type { FocusTrapOptions } from "../../hooks/useFocusTrap";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { AnchorAlignment, AnchoredPosition, AnchorSide } from "../tooltip/anchoredPosition";

// What reached for the overlay, so a caller can tell one way of opening it from another
export type AnchoredOverlayOpenGesture = "anchor-click" | "anchor-key-press";

// What dismissed the overlay, in the same way
export type AnchoredOverlayCloseGesture =
    "anchor-click" | "click-outside" | "escape" | "close-button";

// A step of the overlay width scale, or the width of whatever the overlay holds
export type AnchoredOverlayWidth = "xsmall" | "small" | "medium" | "large" | "xlarge" | "auto";

// A step of the overlay height scale, or the height of whatever the overlay holds
export type AnchoredOverlayHeight = "small" | "medium" | "large" | "xlarge" | "auto";

// A narrow viewport has no room to stand an overlay beside its anchor, so it can be given
// the whole screen instead
export type AnchoredOverlayVariant = ResponsiveValue<"anchored", "anchored" | "fullscreen">;

// What the anchor renderer is handed, and has to spread onto whatever it renders
export type AnchoredOverlayAnchorProps = {
    // The anchor is measured through this, so it has to reach the element itself
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.Ref<any>;
    id: string;
    "aria-haspopup": "true";
    "aria-expanded": boolean;
    tabIndex: number;
    onClick: React.MouseEventHandler<HTMLElement>;
    onKeyDown: React.KeyboardEventHandler<HTMLElement>;
};

// Renders the element the overlay is positioned against
export type AnchoredOverlayAnchorRenderer = (
    props: AnchoredOverlayAnchorProps,
) => React.ReactElement;

// The overlay is an element of its own beside the anchor, so anything meant for it is
// passed through here rather than alongside the anchor's own props
export type AnchoredOverlayOverlayProps = Omit<React.ComponentPropsWithRef<"div">, "children"> & {
    // The portal container the overlay is rendered into, in place of the default one
    portalContainerName?: string;
};

// The overlay is what holds focus, so the container is not the caller's to name
export type AnchoredOverlayFocusTrapSettings = Omit<FocusTrapOptions, "containerRef">;

// Closing the overlay is all the button does, and it is named "Close" unless the caller
// names it something else
export type AnchoredOverlayCloseButtonProps = Omit<
    React.ComponentPropsWithRef<"button">,
    "children" | "onClick" | "aria-labelledby"
>;

type AnchoredOverlayPropsWithAnchor = {
    // Renders the anchor the overlay is positioned against
    renderAnchor: AnchoredOverlayAnchorRenderer;
    // Stands in for the ref the overlay would otherwise hold the anchor with
    anchorRef?: React.RefObject<HTMLElement | null>;
    // Stands in for the id the overlay would otherwise give the anchor
    anchorId?: string;
};

type AnchoredOverlayPropsWithoutAnchor = {
    // An overlay that renders no anchor of its own stands against one that is already on
    // the page, which it has to be handed a ref to
    renderAnchor: null;
    anchorRef: React.RefObject<HTMLElement | null>;
    anchorId?: string;
};

export type AnchoredOverlayAnchorConfig =
    AnchoredOverlayPropsWithAnchor | AnchoredOverlayPropsWithoutAnchor;

export type AnchoredOverlayBaseProps = React.PropsWithChildren<{
    // Whether the overlay is shown
    open: boolean;
    // Called when the overlay is closed and a gesture that would open it is made
    onOpen?: (
        gesture: AnchoredOverlayOpenGesture,
        event?: React.KeyboardEvent<HTMLElement>,
    ) => void;
    // Called when the overlay is open and a gesture that would dismiss it is made
    onClose?: (gesture: AnchoredOverlayCloseGesture) => void;
    // Which edge of the anchor the overlay stands off
    side?: AnchorSide;
    // Where along that edge it lines up
    align?: AnchorAlignment;
    // How far it stands clear of the anchor
    anchorOffset?: number;
    // How far it is moved along the edge it lines up against
    alignmentOffset?: number;
    width?: AnchoredOverlayWidth;
    height?: AnchoredOverlayHeight;
    // Props to spread on the overlay itself
    overlayProps?: AnchoredOverlayOverlayProps;
    // Settings for the focus trap the overlay holds focus with
    focusTrapSettings?: AnchoredOverlayFocusTrapSettings;
    // Holds the overlay to its own width, rather than narrowing it to what the viewport has
    // room for
    preventOverflow?: boolean;
    variant?: AnchoredOverlayVariant;
    // Shows a close button, which only an overlay filling a narrow screen has a use for
    displayCloseButton?: boolean;
    closeButtonProps?: AnchoredOverlayCloseButtonProps;
    // Called whenever the overlay is placed, with where it ended up
    onPositionChange?: (event: { position: AnchoredPosition }) => void;
    className?: string;
}>;

export type AnchoredOverlayProps = AnchoredOverlayBaseProps & AnchoredOverlayAnchorConfig;
