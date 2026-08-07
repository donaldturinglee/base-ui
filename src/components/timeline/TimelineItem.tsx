import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineItemProps } from "./Timeline.types";

const classes = {
    root: "timeline-item",
    rail: "timeline-item-rail",
    condensed: "timeline-item-condensed",
    condensedBadge: "timeline-item-condensed-badge",
    condensedAvatar: "timeline-item-condensed-avatar",
    narrow: "timeline-item-narrow",
};

function TimelineItem(
    props: TimelineItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, condensed, ...rest } = props;

    return (
        <li
            ref={ref}
            className={classNames(
                classes.root,
                classes.rail,
                classes.narrow,
                condensed && classes.condensed,
                condensed && classes.condensedBadge,
                condensed && classes.condensedAvatar,
                className,
            )}
            data-component="Timeline.Item"
            // The timeline trims the rail against the first and last item, and a break is a
            // list item as well, so the items are marked out from it
            data-timeline-item=""
            data-condensed={condensed ? "" : undefined}
            {...rest}
        />
    );
}

TimelineItem.displayName = "Timeline.Item";

export default fixedForwardRef(TimelineItem);
