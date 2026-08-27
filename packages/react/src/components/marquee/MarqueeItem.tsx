import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MarqueeItemProps } from "./Marquee.types";

const classes = {
    root: "marquee-item",
};

// One thing in the run. The gap to the next one is carried here rather than by the copy holding
// them all, so that the last thing in a copy is followed by the same gap as everything else and
// the join between one copy and the next cannot be picked out
function MarqueeItem<As extends React.ElementType = "div">(
    props: MarqueeItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as MarqueeItemProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Marquee.Item"
            {...rest}
        />
    );
}

MarqueeItem.displayName = "Marquee.Item";

export default fixedForwardRef(MarqueeItem);
