import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// What closed the drawer, so a caller can tell one way of dismissing it from another
export type DrawerCloseGesture = "close-button" | "escape";

// Which edge of the screen the drawer settles against, and the edge it arrives from
export type DrawerPosition = "left" | "right" | "top" | "bottom";

export type DrawerNamedSize = "small" | "medium" | "large" | "xlarge";

// A named size takes a step of the overlay scale; anything else is passed straight through as
// a CSS length. Either way it is read as a width where the drawer comes in from the side, and
// as a height where it comes in from the top or the bottom
export type DrawerSize = DrawerNamedSize | Exclude<React.CSSProperties["width"], undefined>;

// `title` and `onClose` both mean something else on a plain div, so the div's own versions are
// dropped in favour of the drawer's
export type DrawerProps = Omit<React.ComponentPropsWithoutRef<"div">, "title" | "onClose"> & {
    // Names the drawer to a screen reader as well as titling it
    title?: React.ReactNode;
    // Rendered below the title in smaller type, and describes the drawer to a screen reader.
    // A header of the caller's own describes the drawer itself
    subtitle?: React.ReactNode;
    // Called when the drawer is dismissed, with the gesture that dismissed it
    onClose: (gesture: DrawerCloseGesture) => void;
    position?: DrawerPosition;
    // How far the drawer comes in from the edge it settles against
    size?: DrawerSize;
    // A modeless drawer leaves the page behind it to be used: nothing is dimmed, focus is free
    // to move on and the page still scrolls
    modal?: boolean;
    // Takes focus once the drawer closes, in place of whatever held it beforehand
    returnFocusRef?: React.RefObject<HTMLElement | null>;
    // Takes focus as the drawer opens, in place of the first thing inside it that can
    initialFocusRef?: React.RefObject<HTMLElement | null>;
    className?: string;
};

export type DrawerHeaderProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type DrawerTitleProps<As extends React.ElementType = "h1"> = PolymorphicProps<
    As,
    "h1",
    {
        className?: string;
    }
>;

export type DrawerSubtitleProps<As extends React.ElementType = "h2"> = PolymorphicProps<
    As,
    "h2",
    {
        className?: string;
    }
>;

export type DrawerBodyProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

export type DrawerFooterProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        className?: string;
    }
>;

// The button is named for a screen reader by the drawer itself, so there is nothing left for a
// caller to name it with
export type DrawerCloseButtonProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "onClick" | "aria-label" | "aria-labelledby"
> & {
    // Called when the button is pressed. A button standing in a header of the caller's own
    // closes the drawer around it without being told how
    onClose?: () => void;
    className?: string;
};

export type DrawerContextValue = {
    // The id of the element naming the drawer, which the title carries
    labelId?: string;
    // The id of the element describing the drawer, which the subtitle carries
    descriptionId?: string;
    // Closes the drawer, for a close button standing in a header of the caller's own
    onClose?: () => void;
};
