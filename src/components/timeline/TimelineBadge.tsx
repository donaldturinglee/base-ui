import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineBadgeProps, TimelineBadgeVariant } from "./Timeline.types";

const classes = {
    // The wrapper is what the rail runs behind, and what takes the left column where the
    // item has to lay itself out again
    wrapper: "relative z-1 [grid-area:badge]",
    // The badge sits over the rail, and its border is the gap it cuts through it. The 15px
    // pull is half the badge less half the rail, which centres it on the line
    root: "flex items-center justify-center shrink-0 overflow-hidden size-[var(--base-size-32)] me-[var(--base-size-8)] -ms-[15px] rounded-full border-solid border-[length:var(--border-width-thick)] border-background-default bg-[var(--timeline-badge-background-color,var(--background-color-muted))] text-foreground-muted",
    // A variant fills the badge, so its contents are set against the fill instead
    variant: {
        accent: "[--timeline-badge-background-color:var(--background-color-accent-emphasis)] text-foreground-on-emphasis",
        success:
            "[--timeline-badge-background-color:var(--background-color-success-emphasis)] text-foreground-on-emphasis",
        attention:
            "[--timeline-badge-background-color:var(--background-color-attention-emphasis)] text-foreground-on-emphasis",
        severe: "[--timeline-badge-background-color:var(--background-color-severe-emphasis)] text-foreground-on-emphasis",
        danger: "[--timeline-badge-background-color:var(--background-color-danger-emphasis)] text-foreground-on-emphasis",
        done: "[--timeline-badge-background-color:var(--background-color-done-emphasis)] text-foreground-on-emphasis",
        open: "[--timeline-badge-background-color:var(--background-color-open-emphasis)] text-foreground-on-emphasis",
        closed: "[--timeline-badge-background-color:var(--background-color-closed-emphasis)] text-foreground-on-emphasis",
        sponsors:
            "[--timeline-badge-background-color:var(--background-color-sponsors-emphasis)] text-foreground-on-emphasis",
    } satisfies Record<TimelineBadgeVariant, string>,
};

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
                className={classNames(classes.root, variant && classes.variant[variant], className)}
                data-component="Timeline.Badge"
                data-variant={variant}
                {...rest}
            />
        </div>
    );
}

TimelineBadge.displayName = "Timeline.Badge";

export default fixedForwardRef(TimelineBadge);
