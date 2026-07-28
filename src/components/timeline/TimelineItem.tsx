import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineItemProps } from "./Timeline.types";

const classes = {
    root: "relative flex px-0 py-[var(--base-size-16)] ms-[var(--base-size-16)]",
    // The rail is drawn by the item rather than by the timeline, so it runs from one item
    // straight into the next however many there are
    rail: "before:content-[''] before:absolute before:inset-y-0 before:start-0 before:block before:w-[var(--border-width-thick)] before:bg-[var(--border-color-muted)]",
    // A condensed item gives up its lower padding, so a run of them reads as one block. The
    // last of the run takes it back, since there is nothing below to close the gap
    condensed: "pt-[var(--base-size-4)] pb-0 last:pb-[var(--base-size-16)]",
    // Its badge comes down to the height of a line of text, and its avatar follows
    condensedBadge:
        "[&_[data-component='Timeline.Badge']]:h-[var(--base-size-16)] [&_[data-component='Timeline.Badge']]:my-[var(--base-size-8)] [&_[data-component='Timeline.Badge']]:border-0 [&_[data-component='Timeline.Badge']]:bg-[var(--background-color-default)] [&_[data-component='Timeline.Badge']]:[color:var(--foreground-color-muted)]",
    condensedAvatar:
        "[&_[data-component='Timeline.Avatar']]:top-[calc(var(--base-size-4)_+_var(--base-size-8)_+_var(--base-size-8))]",
    // With little room to spare the actions drop below the body, and the badge keeps the
    // left column so the rail stays where it is
    narrow: "@max-[480px]/timeline:grid @max-[480px]/timeline:grid-cols-[auto_1fr] @max-[480px]/timeline:[grid-template-areas:'badge_body''._actions']",
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
