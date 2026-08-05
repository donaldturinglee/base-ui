import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { StepsItemContext } from "./StepsItemContext";
import { useStepsItem } from "./useStepsItem";
import type { StepStatus, StepsItemProps } from "./Steps.types";

const classes = {
    root: "steps-item",
    status: "sr-only",
};

// What a screen reader hears for the state a step is in. The circle beside the words is drawn
// rather than said, so without this a step that is done and one that is still to come would read
// alike. The step being worked on says so through `aria-current`, so it says nothing again here
const statusLabels = {
    complete: "Completed",
    current: "",
    incomplete: "Not completed",
} satisfies Record<StepStatus, string>;

// One step of the flow. It takes where it stands from the list around it, unless it was told
// where it stands in its own right, and hands that on to the circle and the words it holds
function StepsItem(
    props: StepsItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, status, statusLabel, ...rest } = props;

    const { index, status: countedStatus } = useStepsItem();
    const resolvedStatus = status ?? countedStatus;
    const label = statusLabel ?? statusLabels[resolvedStatus];

    const context = React.useMemo(
        () => ({ index, status: resolvedStatus }),
        [index, resolvedStatus],
    );

    return (
        <StepsItemContext.Provider value={context}>
            <li
                ref={ref}
                // The step being worked on is the one the reader is on, which is what the
                // attribute is there to say
                aria-current={resolvedStatus === "current" ? "step" : undefined}
                className={classNames(classes.root, className)}
                data-component="Steps.Item"
                data-status={resolvedStatus}
                data-index={index}
                {...rest}
            >
                {children}
                {label ? <span className={classes.status}>{label}</span> : null}
            </li>
        </StepsItemContext.Provider>
    );
}

StepsItem.displayName = "Steps.Item";

export default fixedForwardRef(StepsItem);
