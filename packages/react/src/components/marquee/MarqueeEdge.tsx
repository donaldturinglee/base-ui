import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MarqueeEdgeProps } from "./Marquee.types";

const classes = {
    root: "marquee-edge",
};

// The run faded out where it meets one edge of the window rather than cut off at it, so that
// something on its way in or out is not simply there and then gone. It is drawn over the run and
// takes no presses, since there is nothing there to press, and it says nothing to a reader who
// cannot see it: an edge is a way of drawing the window, not a thing standing in it
function MarqueeEdge<As extends React.ElementType = "div">(
    props: MarqueeEdgeProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        side,
        ...rest
        // `side` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as MarqueeEdgeProps<"div">;

    return (
        <Component
            ref={ref}
            aria-hidden="true"
            className={classNames(classes.root, className)}
            data-component="Marquee.Edge"
            data-side={side}
            {...rest}
        />
    );
}

MarqueeEdge.displayName = "Marquee.Edge";

export default fixedForwardRef(MarqueeEdge);
