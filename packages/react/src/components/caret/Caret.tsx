import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CaretEdge, CaretLocation, CaretProps } from "./Caret.types";

const classes = {
    triangle: "caret-triangle",
    border: "caret-border",
};

const caretVariants = cva("caret", {
    variants: {
        location: {
            top: "caret-top",
            bottom: "caret-bottom",
            left: "caret-left",
            right: "caret-right",
            "top-left": "caret-top-left",
            "top-right": "caret-top-right",
            "bottom-left": "caret-bottom-left",
            "bottom-right": "caret-bottom-right",
            "left-top": "caret-left-top",
            "left-bottom": "caret-left-bottom",
            "right-top": "caret-right-top",
            "right-bottom": "caret-right-bottom",
        } satisfies Record<CaretLocation, string>,
    },
});

const DEFAULT_SIZE = 8;

// The triangle is drawn once pointing down and then turned to face away from whichever edge it
// was given, so there is one shape to keep rather than four. Each turn is taken about the corner
// of the box, so the box is walked back around under the shape afterwards
const getTransform = (edge: CaretEdge, size: number) =>
    ({
        top: `translate(${size},${size * 2}) rotate(180)`,
        right: `translate(0,${size}) rotate(-90)`,
        bottom: `translate(${size},0)`,
        left: `translate(${size * 2},${size}) rotate(90)`,
    })[edge];

// The point a surface is drawn with to say what it was opened from. It is laid out against
// whichever ancestor is positioned, which the surface itself usually is, so where along an edge it
// ends up is settled by the location it is given rather than by anything worked out here.
//
// It is kept from a screen reader altogether: a caret says which way a surface points, and what a
// surface points at is already carried by the order the page is written in
function Caret(
    props: CaretProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        location = "bottom",
        size = DEFAULT_SIZE,
        background,
        borderColor,
        borderWidth,
        className,
        style,
        ...rest
    } = props;

    const edge = location.split("-")[0] as CaretEdge;

    // The corners of the triangle, as [x, y] pairs. A path takes each of its points as `x,y`,
    // which is what a pair of two becomes once it is written into a string, so the pairs are
    // handed to the path as they stand
    const start = [-size, 0];
    const point = [0, size];
    const end = [size, 0];

    // The fill is the whole triangle, while the outline is only the two sides that run to the
    // point: the third lies along the edge the caret stands against, where the surface already
    // draws a line of its own
    const triangle = `M${start}L${point}L${end}L${start}Z`;
    const outline = `M${start}L${point}L${end}`;

    return (
        <svg
            ref={ref}
            width={size * 2}
            height={size * 2}
            className={classNames(caretVariants({ location }), className)}
            style={
                {
                    ...style,
                    "--caret-size": `${size}px`,
                    "--caret-background": background,
                    "--caret-border-color": borderColor,
                    "--caret-border-width": borderWidth,
                } as React.CSSProperties
            }
            data-component="Caret"
            data-location={location}
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <g transform={getTransform(edge, size)}>
                <path className={classes.triangle} d={triangle} />
                <path className={classes.border} d={outline} />
            </g>
        </svg>
    );
}

Caret.displayName = "Caret";

export default fixedForwardRef(Caret);
