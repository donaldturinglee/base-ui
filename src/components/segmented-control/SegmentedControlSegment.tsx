import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { Tooltip } from "../tooltip";
import type { ButtonVisual } from "../button";
import type { SegmentedControlSegmentProps } from "./SegmentedControl.types";

const classes = {
    // Neighbouring segments pull over the track's own border, so the row keeps a single
    // outline rather than drawing one around every segment
    item: "relative block grow -my-px first:-ms-px last:-me-px [&:not(:last-child)]:me-px",
    // The line between two segments is drawn by the one on the left, and stops short of the
    // track at both ends
    separator:
        "[&:not(:last-child)]:after:content-[''] [&:not(:last-child)]:after:absolute [&:not(:last-child)]:after:top-[var(--base-size-8)] [&:not(:last-child)]:after:bottom-[var(--base-size-8)] [&:not(:last-child)]:after:end-[calc(-1_*_var(--base-size-2))] [&:not(:last-child)]:after:w-px [&:not(:last-child)]:after:bg-border-default",
    // The segment being shown is already set apart by the knob it carries, so no line is
    // drawn on either side of it. Nor is one drawn where it would show through a focus ring
    separatorHidden:
        "[&:not(:last-child)[data-selected]]:after:bg-transparent [&:not(:last-child):has(+[data-selected])]:after:bg-transparent [&:not(:last-child):has(:focus-visible)]:after:w-0",
    // The button fills the segment and holds its content in by the room the knob needs to
    // stand clear of the track. `group/segment` lets that content answer the pointer
    button: "group/segment w-full h-full p-[var(--base-size-4)] [font-family:inherit] [font-size:inherit] [font-weight:var(--base-text-weight-normal)] [color:currentColor] cursor-pointer appearance-none bg-transparent border-0 rounded-[var(--border-radius-medium)]",
    // The ring is drawn just inside the track's border, where an offset of its own would
    // leave it sitting on top of it
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[calc(-1_*_var(--border-width-thin))]",
    // A coarse pointer is given a target taller than the segment itself to aim at
    target: "pointer-coarse:before:content-[''] pointer-coarse:before:absolute pointer-coarse:before:inset-x-0 pointer-coarse:before:top-1/2 pointer-coarse:before:-translate-y-1/2 pointer-coarse:before:min-h-[var(--control-min-target-coarse)]",
    // The knob takes the room the button was inset by, so the label keeps its place as the
    // reader moves along the row
    buttonSelected: "p-0 [font-weight:var(--base-text-weight-semibold)]",
    buttonDisabled: "cursor-not-allowed text-foreground-disabled",
    // What is drawn inside the button: the knob where the segment is the one being shown, and
    // the hover and press states where it is not
    content:
        "flex h-full items-center justify-center px-[calc(var(--control-medium-padding-inline-normal)_-_var(--base-size-4))] border-solid border-[length:var(--border-width-thin)] border-transparent rounded-[calc(var(--border-radius-medium)_-_var(--base-size-2))]",
    contentSelected:
        "px-[var(--control-medium-padding-inline-normal)] bg-[var(--control-knob-background-color-rest)] border-[color:var(--control-knob-border-color-rest)] rounded-[var(--border-radius-medium)]",
    // Only a segment that can still be picked answers the pointer
    contentInteractive:
        "group-hover/segment:bg-[var(--control-track-background-color-hover)] group-active/segment:bg-[var(--control-track-background-color-active)]",
};

// A visual is given either as the component to render, or as an element that is already built
export const renderSegmentVisual = (visual: NonNullable<ButtonVisual>) => {
    const Visual = visual as React.ElementType;

    return React.isValidElement(visual) ? visual : <Visual />;
};

// The look of one segment, shared by the segment that carries a label and the one that carries
// only an icon. The control itself says which segment is being shown, so the shell is told
// rather than holding any of that
function SegmentedControlSegment(props: SegmentedControlSegmentProps) {
    const {
        component,
        className,
        children,
        selected,
        disabled,
        tooltip,
        tooltipType,
        tooltipDirection,
        "aria-disabled": ariaDisabled,
        ...rest
    } = props;

    // A segment that cannot be picked says so rather than being taken out of the tab order,
    // so a reader can still reach it and be told why. It keeps the look of the knob where it
    // is the segment being shown
    const unavailable = Boolean(disabled) || ariaDisabled === true || ariaDisabled === "true";

    const button = (
        <button
            type="button"
            aria-pressed={selected}
            aria-disabled={unavailable || undefined}
            className={classNames(
                classes.button,
                classes.focus,
                classes.target,
                selected && classes.buttonSelected,
                unavailable && !selected && classes.buttonDisabled,
                className,
            )}
            {...rest}
        >
            <span
                className={classNames(
                    classes.content,
                    selected && classes.contentSelected,
                    !selected && !unavailable && classes.contentInteractive,
                )}
            >
                {children}
            </span>
        </button>
    );

    return (
        <li
            className={classNames(classes.item, classes.separator, classes.separatorHidden)}
            data-component={component}
            data-selected={selected ? "" : undefined}
        >
            {tooltip ? (
                <Tooltip text={tooltip} type={tooltipType} direction={tooltipDirection}>
                    {button}
                </Tooltip>
            ) : (
                button
            )}
        </li>
    );
}

SegmentedControlSegment.displayName = "SegmentedControlSegment";

export default SegmentedControlSegment;
