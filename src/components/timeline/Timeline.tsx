import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineClipSidebar, TimelineProps } from "./Timeline.types";

const classes = {
    root: "timeline",
    clipStart: "timeline-clip-start",
    clipEnd: "timeline-clip-end",
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
