import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineAvatarProps } from "./Timeline.types";

const classes = {
    // The avatar stands out in the gutter beside the rail, lined up with the actor avatars
    // around the timeline, and centred against the badge it belongs to
    root: "absolute z-1 -translate-y-1/2 start-[calc(-1_*_(var(--base-size-40)_+_var(--base-size-32)))] top-[calc(var(--base-size-16)_+_var(--base-size-16))]",
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
