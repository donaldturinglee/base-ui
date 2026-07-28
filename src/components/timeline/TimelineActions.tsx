import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TimelineActionsProps } from "./Timeline.types";

const classes = {
    // The minimum height matches the badge, so whatever the actions hold is centred against
    // it rather than against the whole item
    root: "flex items-center self-start shrink-0 ms-auto gap-[var(--base-size-8)] min-h-[var(--base-size-32)] [grid-area:actions]",
    // On its own row the actions lead from the start, with nothing left to push them over
    narrow: "@max-[480px]/timeline:mt-[var(--base-size-8)] @max-[480px]/timeline:ms-0 @max-[480px]/timeline:justify-start @max-[480px]/timeline:min-h-0",
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
