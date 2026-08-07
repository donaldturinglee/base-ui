import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineActionsProps } from "./Timeline.types";

const classes = {
    root: "timeline-actions",
    narrow: "timeline-actions-narrow",
};

function TimelineActions(
    props: TimelineActionsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, classes.narrow, className)}
            data-component="Timeline.Actions"
            {...rest}
        />
    );
}

TimelineActions.displayName = "Timeline.Actions";

export default fixedForwardRef(TimelineActions);
