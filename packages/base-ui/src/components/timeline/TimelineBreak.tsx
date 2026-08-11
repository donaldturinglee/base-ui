import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineBreakProps } from "./Timeline.types";

const classes = {
    root: "timeline-break",
    beforeCondensed: "timeline-break-before-condensed",
};

function TimelineBreak(
    props: TimelineBreakProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <li
            ref={ref}
            // The break is only a line across the rail, so it is left out of the list it
            // stands in
            role="presentation"
            className={classNames(classes.root, classes.beforeCondensed, className)}
            data-component="Timeline.Break"
            {...rest}
        />
    );
}

TimelineBreak.displayName = "Timeline.Break";

export default fixedForwardRef(TimelineBreak);
