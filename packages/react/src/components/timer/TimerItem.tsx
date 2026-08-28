import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TimerContext } from "./TimerContext";
import type { TimerItemProps } from "./Timer.types";

const classes = {
    root: "timer-item",
};

// One unit of the time, written out and padded to the width it is read at. The unit is asked for
// rather than the figure handed in, so a caller lays out the face they want and the clock behind
// it goes on being the one run.
//
// A caller who would rather show something else — a shortened form, or the figure set beside a
// word naming it — puts that in as children, and the unit goes on being what the item is for
function TimerItem<As extends React.ElementType = "div">(
    props: TimerItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        type,
        children,
        ...rest
        // `type` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as TimerItemProps<"div">;

    const { formattedTime } = React.useContext(TimerContext);

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Timer.Item"
            data-unit={type}
            {...rest}
        >
            {children ?? formattedTime?.[type]}
        </Component>
    );
}

TimerItem.displayName = "Timer.Item";

export default fixedForwardRef(TimerItem);
