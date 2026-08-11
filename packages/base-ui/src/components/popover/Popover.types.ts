import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Which edge the caret stands on, and where along that edge it stands. The two halves are read in
// that order, so `top-left` is a caret on the top edge over towards the left, while `left-top` is
// one on the left edge up towards the top
export type PopoverCaret =
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "left-top"
    | "left-bottom"
    | "right-top"
    | "right-bottom";

// A step of the overlay width scale, or the width of whatever the content holds
export type PopoverContentWidth = "xsmall" | "small" | "medium" | "large" | "xlarge" | "auto";

// A step of the overlay height scale, the height of whatever the content holds, or as much of it
// as the content needs
export type PopoverContentHeight = "small" | "medium" | "large" | "xlarge" | "auto" | "fit-content";

// What becomes of content taller or wider than the height and width it was given
export type PopoverContentOverflow = "auto" | "hidden" | "scroll" | "visible";

export type PopoverProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        caret?: PopoverCaret;
        // Whether the popover is shown. It is the caller's to hold, since what opens a popover is
        // whatever it was opened from rather than anything the popover itself can see
        open?: boolean;
        // Stands the popover in the flow, after whatever it was written after, rather than laying
        // it out against the nearest positioned ancestor
        relative?: boolean;
        className?: string;
    }
>;

export type PopoverContentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        width?: PopoverContentWidth;
        height?: PopoverContentHeight;
        // A value that clips takes the caret with it, since the caret is drawn past the edge of
        // the surface it points from
        overflow?: PopoverContentOverflow;
        // Called where a press lands anywhere outside the content while the popover is open
        onClickOutside?: (event: MouseEvent | TouchEvent) => void;
        // Called where Escape is pressed while the popover is open
        onEscape?: (event: KeyboardEvent) => void;
        // Elements a press on which is not counted as a press outside. The control the popover was
        // opened from belongs here, since it closes the popover itself and would otherwise be
        // closing one this had already closed
        ignoreClickRefs?: React.RefObject<HTMLElement | null>[];
        className?: string;
    }
>;

export type PopoverContextValue = {
    // Whether the popover is open, read by the content so that it only answers Escape and presses
    // outside while there is something on screen to dismiss
    open?: boolean;
    // Which caret the popover was given, read by the content because the caret is drawn on the
    // surface rather than on the room the surface stands in
    caret?: PopoverCaret;
};
