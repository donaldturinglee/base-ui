import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TimerContext } from "./TimerContext";
import type { TimerControlProps } from "./Timer.types";

const classes = {
    root: "timer-control",
};

// The row the triggers stand in. It is kept apart from the face so that the two are laid out
// against one another rather than each having to know where the other is, and so a clock that is
// only there to be watched leaves it out altogether
function TimerControl<As extends React.ElementType = "div">(
    props: TimerControlProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as TimerControlProps<"div">;
    const { status } = React.useContext(TimerContext);

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Timer.Control"
            data-status={status}
            {...rest}
        />
    );
}

TimerControl.displayName = "Timer.Control";

export default fixedForwardRef(TimerControl);
