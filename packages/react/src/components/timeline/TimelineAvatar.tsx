import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineAvatarProps } from "./Timeline.types";

const classes = {
    root: "timeline-avatar",
};

function TimelineAvatar(
    props: TimelineAvatarProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Timeline.Avatar"
            {...rest}
        />
    );
}

TimelineAvatar.displayName = "Timeline.Avatar";

export default fixedForwardRef(TimelineAvatar);
