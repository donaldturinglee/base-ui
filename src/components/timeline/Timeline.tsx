import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineClipSidebar, TimelineProps } from "./Timeline.types";

const classes = {
    // The timeline responds to the room it is given rather than to the viewport, so it reads
    // the same inside a side panel as it does across a page
    root: "@container/timeline flex flex-col list-none p-0 m-0",
    // The rail runs the height of each item, so clipping it means taking the padding off the
    // item at that end and bringing its avatar back up to meet the badge
    clipStart:
        "[&>[data-timeline-item]:first-child]:pt-0 [&>[data-timeline-item]:first-child_[data-component='Timeline.Avatar']]:top-[var(--base-size-16)] [&>[data-timeline-item][data-condensed]:first-child]:before:top-[var(--base-size-12)] [&>[data-timeline-item][data-condensed]:first-child_[data-component='Timeline.Avatar']]:top-[calc(var(--base-size-8)_+_var(--base-size-8))]",
    clipEnd:
        "[&>[data-timeline-item]:last-child]:pb-0 [&>[data-timeline-item][data-condensed]:last-child]:before:h-[var(--base-size-12)]",
};

// `true` trims both ends, and either end can be named on its own
const resolveClipSidebar = (clipSidebar: TimelineClipSidebar | undefined) => {
    if (clipSidebar === true || clipSidebar === "both") {
        return "both";
    }

    if (clipSidebar === "start" || clipSidebar === "end") {
        return clipSidebar;
    }

    return undefined;
};

function Timeline(
    props: TimelineProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, clipSidebar, ...rest } = props;

    const clip = resolveClipSidebar(clipSidebar);

    return (
        <ol
            ref={ref}
            // Safari takes the list semantics away from a list with no markers, so the role
            // is stated rather than left to the element
            role="list"
            className={classNames(
                classes.root,
                (clip === "start" || clip === "both") && classes.clipStart,
                (clip === "end" || clip === "both") && classes.clipEnd,
                className,
            )}
            data-component="Timeline"
            data-clip-sidebar={clip}
            {...rest}
        />
    );
}

Timeline.displayName = "Timeline";

export default fixedForwardRef(Timeline);
