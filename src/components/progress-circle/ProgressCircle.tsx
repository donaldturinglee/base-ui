import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    ProgressCircleProps,
    ProgressCircleSize,
    ProgressCircleVariant,
} from "./ProgressCircle.types";

const classes = {
    ring: "progress-circle-ring",
    track: "progress-circle-track",
    indicator: "progress-circle-indicator",
    label: "progress-circle-label",
};

// The ring is drawn once in the SVG's own units and scaled to whatever width the size class
// gives it, so the line keeps its proportions rather than thinning as the circle grows. The
// radius leaves half the line on either side of it, so the ring is drawn inside the box rather
// than clipped by it
const viewBoxSize = 32;
const center = viewBoxSize / 2;
const radius = 14;

// Normalising the path to a hundred units lets the length that is drawn be the percentage
// itself, so nothing has to be worked back out of the radius to fill the ring
const pathLength = 100;

const progressCircleVariants = cva("progress-circle", {
    variants: {
        size: {
            small: "progress-circle-small",
            medium: "progress-circle-medium",
            large: "progress-circle-large",
        } satisfies Record<ProgressCircleSize, string>,
        variant: {
            accent: "progress-circle-accent",
            attention: "progress-circle-attention",
            danger: "progress-circle-danger",
            done: "progress-circle-done",
            neutral: "progress-circle-neutral",
            severe: "progress-circle-severe",
            sponsors: "progress-circle-sponsors",
            success: "progress-circle-success",
        } satisfies Record<ProgressCircleVariant, string>,
    },
});

// The reading a ProgressBar gives, drawn as a ring for the places a line has no room to run: the
// corner of a card, a cell in a table, the space an avatar would otherwise take.
//
// The percentage is handed to the stylesheet as a custom property rather than turned into an arc
// here, so how far round the ring runs is settled in the same place as the colour and the size it
// is drawn with.
//
// Children are laid in the middle of the ring, which is where a percentage is usually read. A
// progressbar keeps its contents from a screen reader, so the number the eye reads there is the
// one aria-valuenow already carries rather than a second copy of it
function ProgressCircle<As extends React.ElementType = "span">(
    props: ProgressCircleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        progress = 0,
        size = "medium",
        variant = "success",
        style,
        children,
        "aria-valuenow": ariaValueNow,
        ...rest
    } = props as ProgressCircleProps<"span">;

    // A ring has no end to overrun the way a bar does, so a progress past either end of the track
    // is brought back to the one it ran past before the arc or the value are taken from it
    const value = Math.min(Math.max(progress, 0), 100);

    // Counts the children that actually render, so booleans, null and undefined do not stand in
    // for a label
    const hasLabel = React.Children.toArray(children).length > 0;

    return (
        <Component
            ref={ref}
            role="progressbar"
            aria-valuenow={ariaValueNow ?? Math.round(value)}
            aria-valuemin={0}
            aria-valuemax={100}
            className={classNames(progressCircleVariants({ size, variant }), className)}
            style={
                {
                    ...style,
                    "--progress-circle-progress": value,
                } as React.CSSProperties
            }
            data-component="ProgressCircle"
            data-size={size}
            data-variant={variant}
            {...rest}
        >
            <svg
                className={classes.ring}
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle
                    className={classes.track}
                    cx={center}
                    cy={center}
                    r={radius}
                    pathLength={pathLength}
                />
                <circle
                    className={classes.indicator}
                    cx={center}
                    cy={center}
                    r={radius}
                    pathLength={pathLength}
                />
            </svg>
            {hasLabel ? <span className={classes.label}>{children}</span> : null}
        </Component>
    );
}

ProgressCircle.displayName = "ProgressCircle";

export default fixedForwardRef(ProgressCircle);
