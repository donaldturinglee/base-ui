import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineBadgeProps, TimelineBadgeVariant } from "./Timeline.types";

const classes = {
    wrapper: "timeline-badge-wrapper",
};

const timelineBadgeVariants = cva("timeline-badge", {
    variants: {
        variant: {
            accent: "timeline-badge-accent",
            success: "timeline-badge-success",
            attention: "timeline-badge-attention",
            severe: "timeline-badge-severe",
            danger: "timeline-badge-danger",
            done: "timeline-badge-done",
            open: "timeline-badge-open",
            closed: "timeline-badge-closed",
            sponsors: "timeline-badge-sponsors",
        } satisfies Record<TimelineBadgeVariant, string>,
    },
});

function TimelineBadge(
    props: TimelineBadgeProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, variant, ...rest } = props;

    return (
        <div className={classes.wrapper}>
            <div
                ref={ref}
                className={classNames(timelineBadgeVariants({ variant }), className)}
                data-component="Timeline.Badge"
                data-variant={variant}
                {...rest}
            />
        </div>
    );
}

TimelineBadge.displayName = "Timeline.Badge";

export default fixedForwardRef(TimelineBadge);
