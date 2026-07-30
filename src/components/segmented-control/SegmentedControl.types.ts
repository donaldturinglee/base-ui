import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { ButtonVisual } from "../button";
import type { TooltipDirection, TooltipType } from "../tooltip";

// How much room the segments are given
export type SegmentedControlSize = "small" | "medium";

// What the control falls back to where there is no room to draw it in full: the labels are
// dropped and only the icons kept, or the whole row gives way to a menu
export type SegmentedControlVariant = "default" | "hideLabels" | "dropdown";

// A row of segments says nothing on its own, so the control has to be named
type SegmentedControlAccessibleName =
    | { "aria-label": string; "aria-labelledby"?: undefined }
    | { "aria-label"?: undefined; "aria-labelledby": string };

type SegmentedControlOwnProps = {
    // Fills the width of its container
    fullWidth?: boolean | ResponsiveValue<boolean>;
    // Called with the index of the segment that was picked
    onChange?: (selectedIndex: number) => void;
    size?: SegmentedControlSize;
    // A fallback is only ever a way out of a tight space, so it is given per viewport range
    variant?: "default" | ResponsiveValue<SegmentedControlVariant>;
    className?: string;
};

export type SegmentedControlProps = Omit<
    React.ComponentPropsWithoutRef<"ul">,
    "onChange" | "aria-label" | "aria-labelledby"
> &
    SegmentedControlOwnProps &
    SegmentedControlAccessibleName;

// The same props with the name left open, for reading inside the component
export type SegmentedControlElementProps = Omit<React.ComponentPropsWithoutRef<"ul">, "onChange"> &
    SegmentedControlOwnProps;

// What both kinds of segment are told, whichever of them the control was written with
type SegmentedControlSegmentOwnProps = {
    // Whether the segment is the one being shown. This is for a control the caller holds the
    // state of, and is kept up to date through the control's `onChange`
    selected?: boolean;
    // Picks the segment on the first render, for a control that keeps its own state
    defaultSelected?: boolean;
    // Reads as unavailable while staying in the tab order, so it can still be explained
    disabled?: boolean;
    className?: string;
};

export type SegmentedControlButtonProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children"
> &
    SegmentedControlSegmentOwnProps & {
        // The label the segment carries, which is also what the menu shows in its place
        children: string;
        // The visual that comes before the label
        leadingVisual?: ButtonVisual;
        // Shows a counter after the label
        count?: number | string;
    };

export type SegmentedControlIconButtonProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "children" | "aria-label"
> &
    SegmentedControlSegmentOwnProps & {
        // An icon says nothing on its own, so an icon segment has to be named
        "aria-label": string;
        icon: NonNullable<ButtonVisual>;
        // Says more about the segment, and is read from the tooltip in place of its name
        description?: string;
        tooltipDirection?: TooltipDirection;
    };

// The shell both kinds of segment are drawn with, which is the box, the button inside it and
// the knob that shows which segment the control is resting on
export type SegmentedControlSegmentProps = React.ComponentPropsWithoutRef<"button"> &
    Omit<SegmentedControlSegmentOwnProps, "defaultSelected"> & {
        // Says which of the two kinds of segment is being drawn
        component: string;
        // Named from a tooltip rather than from the button itself, as an icon segment is
        tooltip?: string;
        tooltipType?: TooltipType;
        tooltipDirection?: TooltipDirection;
    };
