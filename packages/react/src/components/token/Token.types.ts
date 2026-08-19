import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { ButtonVisual } from "../button";

// How much room the token is given. The scale is its own, since a token is smaller than the
// controls it usually stands beside
export type TokenSize = "small" | "medium" | "large" | "xlarge";

export type TokenBaseProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        size?: TokenSize;
        // Whether the token is one of the ones that have been picked
        isSelected?: boolean;
        // Called when the remove button is pressed, or when Backspace or Delete is pressed
        // while the token holds focus
        onRemove?: () => void;
        // Stops the token answering the reader at all
        disabled?: boolean;
        className?: string;
    }
>;

export type TokenProps<As extends React.ElementType = "span"> = TokenBaseProps<As> & {
    // What the token says
    text: React.ReactNode;
    // Stands before the text. A small token has no room for one, so it is left out there
    leadingVisual?: ButtonVisual;
    // Leaves out the remove button, for a token that is removed some other way
    hideRemoveButton?: boolean;
};

export type IssueLabelTokenProps<As extends React.ElementType = "span"> = TokenBaseProps<As> & {
    // What the label says
    text: React.ReactNode;
    // The one colour every colour the label is drawn in is worked out from, written as hex
    // or as `rgb()`
    fillColor?: string;
    hideRemoveButton?: boolean;
};

export type TokenTextProps<As extends React.ElementType = "span"> = PolymorphicProps<
    As,
    "span",
    {
        // Stretches the text over the whole token, so that a click anywhere on it lands on
        // the same thing
        interactive?: boolean;
        className?: string;
    }
>;

// The button is named by the token itself, so there is nothing left for a caller to name it
// with
export type TokenRemoveButtonProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "aria-label" | "aria-labelledby"
> & {
    size?: TokenSize;
    // A token that already answers the reader cannot hold a button of its own, since one
    // cannot stand inside another
    isParentInteractive?: boolean;
    className?: string;
};

// What decides whether a token answers the reader, which is read by the token and by the
// remove button standing in it
export type TokenInteractiveProps = {
    as?: React.ElementType;
    onClick?: React.MouseEventHandler<HTMLElement>;
    onFocus?: React.FocusEventHandler<HTMLElement>;
    tabIndex?: number;
    disabled?: boolean;
};
