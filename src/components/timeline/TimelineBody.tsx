import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineBodyProps } from "./Timeline.types";

const classes = {
    root: "timeline-body",
};

function TimelineBody(
    props: TimelineBodyProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Timeline.Body"
            {...rest}
        />
    );
}

TimelineBody.displayName = "Timeline.Body";

export default fixedForwardRef(TimelineBody);
