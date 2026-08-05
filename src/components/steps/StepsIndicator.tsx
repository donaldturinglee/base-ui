import * as React from "react";
import { CheckmarkRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useStepsItem } from "./useStepsItem";
import type { StepsIndicatorProps } from "./Steps.types";

const classes = {
    root: "steps-indicator",
    icon: "steps-indicator-icon",
};

// The circle a step is marked with: the number it stands at while it is still to come or being
// worked on, and a checkmark once it is done. Anything put inside it is drawn in place of both,
// which is where an icon of the caller's own goes.
//
// Whatever it ends up holding is a picture of the state the step says in words of its own, so it
// is kept from a screen reader rather than read out twice
function StepsIndicator(
    props: StepsIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    const { index, status } = useStepsItem();

    return (
        <span
            ref={ref}
            aria-hidden="true"
            className={classNames(classes.root, className)}
            data-component="Steps.Indicator"
            data-status={status}
            {...rest}
        >
            {children ??
                (status === "complete" ? <CheckmarkRegular className={classes.icon} /> : index + 1)}
        </span>
    );
}

StepsIndicator.displayName = "Steps.Indicator";

export default fixedForwardRef(StepsIndicator);
