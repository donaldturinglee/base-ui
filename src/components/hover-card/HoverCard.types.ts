import type * as React from "react";
import type { AnchorAlignment, AnchorSide } from "../tooltip/anchoredPosition";

export type HoverCardProps = {
    // Which edge of the trigger the card stands off, and where along that edge it lines up
    side?: AnchorSide;
    align?: AnchorAlignment;
    // How far the card stands clear of the trigger
    anchorOffset?: number;
    // How far the card is moved along the edge it lines up against
    alignmentOffset?: number;
    // How long the pointer has to rest on the trigger before the card opens, in milliseconds,
    // so a pointer crossing the page does not leave a trail of them
    openDelay?: number;
    // How long the card is left standing once the pointer has left, in milliseconds. This is
    // what gives the reader room to move the pointer off the trigger and onto the card itself
    closeDelay?: number;
    // Whether the card is open, where the caller keeps hold of that. Left out for a card that
    // opens and closes on its own
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    // Stops the card opening at all, for a trigger with nothing to say yet
    disabled?: boolean;
    // Which registered portal the card is rendered into, for a page that keeps more than one
    portalContainerName?: string;
    children?: React.ReactNode;
    className?: string;
};

export type HoverCardTriggerProps = {
    children?: React.ReactNode;
};

export type HoverCardContentProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// What the trigger is handed so that it opens and closes the card, gathered in one place
// because the card holds the state and the trigger is only what the reader arrives at
export type HoverCardTriggerHandlers = {
    ref: React.Ref<HTMLElement>;
    "aria-describedby"?: string;
    onPointerEnter: React.PointerEventHandler;
    onPointerLeave: React.PointerEventHandler;
    onFocus: React.FocusEventHandler;
    onBlur: React.FocusEventHandler;
};

export type HoverCardContextValue = {
    triggerHandlers?: HoverCardTriggerHandlers;
};
