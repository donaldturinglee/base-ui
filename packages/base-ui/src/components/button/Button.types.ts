import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

export type ButtonVariant = "default" | "primary" | "danger" | "invisible" | "link";

export type ButtonSize = "small" | "medium" | "large";

export type ButtonAlignContent = "start" | "center";

// A visual is given either as the component to render, or as an element that is already built
export type ButtonVisual = React.ElementType | React.ReactElement | null;

export type ButtonBaseProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    // Fills the width of its container
    block?: boolean;
    // Swaps the visuals for a spinner and stops the button being pressed
    loading?: boolean;
    loadingAnnouncement?: string;
    // Reads as unavailable while staying in the tab order, so it can still be explained
    inactive?: boolean;
    // Lets a long label run onto more than one line
    labelWrap?: boolean;
    className?: string;
};

// What a button lays out around its label, shared with the link button
export type ButtonContentProps = {
    alignContent?: ButtonAlignContent;
    leadingVisual?: ButtonVisual;
    trailingVisual?: ButtonVisual;
    trailingAction?: ButtonVisual;
    // Shows a counter after the label, or in place of a trailing visual
    count?: number | string;
};

export type ButtonProps<As extends React.ElementType = "button"> = PolymorphicProps<
    As,
    "button",
    ButtonBaseProps & ButtonContentProps
>;
