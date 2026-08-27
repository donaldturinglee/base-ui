import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MarqueeContext } from "./MarqueeContext";
import type { MarqueeViewportProps } from "./Marquee.types";

const classes = {
    root: "marquee-viewport",
};

// The window the run is seen through. Everything standing outside it is cut off rather than
// reflowed, so a run keeps its length whatever room the page has for it.
//
// The window is also what the marquee measures against: how much of the run can be seen at once
// is what says how many copies it takes to leave nothing behind the one going by, so the element
// is handed back to the marquee alongside whatever ref the caller asked for
function MarqueeViewport<As extends React.ElementType = "div">(
    props: MarqueeViewportProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as MarqueeViewportProps<"div">;
    const { viewportRef } = React.useContext(MarqueeContext);

    const mergedRef = useMergedRefs(ref, viewportRef);

    return (
        <Component
            ref={mergedRef}
            className={classNames(classes.root, className)}
            data-component="Marquee.Viewport"
            {...rest}
        />
    );
}

MarqueeViewport.displayName = "Marquee.Viewport";

export default fixedForwardRef(MarqueeViewport);
