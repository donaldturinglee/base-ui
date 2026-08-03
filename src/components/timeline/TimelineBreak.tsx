import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineBreakProps } from "./Timeline.types";

const classes = {
    // The break stands over the rail and cuts it with its own fill, then pulls the item
    // below back up so the gap is only as wide as the line
    root: "relative z-1 h-[var(--base-size-24)] m-0 ms-0 mb-[calc(-1_*_var(--base-size-16))] bg-background-default border-0 border-t-[length:var(--border-width-thicker)] border-t-border-default",
    // A condensed item below the break sits closer, so the pull is shorter to match
    beforeCondensed: "has-[+[data-condensed]]:mb-[calc(-1_*_var(--base-size-12))]",
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
