import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimerSeparatorProps } from "./Timer.types";

const classes = {
    root: "timer-separator",
};

// What stands between one unit and the next, a colon or a full stop. It is there to be seen rather
// than read out: a reader who cannot see the face is told the units by the words beside them, and
// a colon read aloud between every pair of figures says nothing they need
function TimerSeparator<As extends React.ElementType = "div">(
    props: TimerSeparatorProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as TimerSeparatorProps<"div">;

    return (
        <Component
            ref={ref}
            aria-hidden="true"
            className={classNames(classes.root, className)}
            data-component="Timer.Separator"
            {...rest}
        />
    );
}

TimerSeparator.displayName = "Timer.Separator";

export default fixedForwardRef(TimerSeparator);
