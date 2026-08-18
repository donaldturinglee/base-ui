import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SwapContext } from "./SwapContext";
import type { SwapIndicatorElementProps, SwapIndicatorProps } from "./Swap.types";

const classes = {
    root: "swap-indicator",
    active: "swap-indicator-active",
};

// One of the two things the swap takes turns on. Which one it is is said rather than worked out
// from the order it was written in, so a caller can lay the pair out whichever way round reads
// better and still have the swap show the right one.
//
// The one standing back stays on the page: it is what the one being shown comes forward from, and
// taking it away would leave the swap with nothing to be measured by. It is kept from a screen
// reader and from the pointer instead, so a swap is read and pressed as the one thing it appears
// to be rather than as both at once
function SwapIndicator<As extends React.ElementType = "span">(
    props: SwapIndicatorProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        type,
        ...rest
    } = props as unknown as SwapIndicatorElementProps;
    const { swap } = React.useContext(SwapContext);

    const active = type === (swap ? "on" : "off");

    return (
        <Component
            ref={ref}
            aria-hidden={active ? undefined : "true"}
            className={classNames(classes.root, active && classes.active, className)}
            data-component="Swap.Indicator"
            data-type={type}
            data-active={active}
            {...rest}
        />
    );
}

SwapIndicator.displayName = "Swap.Indicator";

export default fixedForwardRef(SwapIndicator);
