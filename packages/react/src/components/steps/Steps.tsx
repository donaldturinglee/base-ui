import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { StepsItemContext } from "./StepsItemContext";
import type { StepStatus, StepsOrientation, StepsProps, StepsSize } from "./Steps.types";

// Which step a flow has reached where it is not told otherwise, being the first of them
export const DEFAULT_CURRENT_STEP = 1;

const stepsVariants = cva("steps", {
    variants: {
        orientation: {
            horizontal: "steps-horizontal",
            vertical: "steps-vertical",
        } satisfies Record<StepsOrientation, string>,
        size: {
            small: "steps-small",
            // A medium list takes the size the steps are already drawn at
            medium: "",
        } satisfies Record<StepsSize, string>,
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type StepsChild = React.ReactElement<any>;

const getSteps = (children: React.ReactNode): StepsChild[] =>
    React.Children.toArray(children).filter((child): child is StepsChild =>
        React.isValidElement(child),
    );

// Where a step stands against the one the flow has reached. Both are counted from one here, so
// that the number a step is drawn with is the number it is compared by
const resolveStatus = (index: number, currentStep: number): StepStatus => {
    const step = index + 1;

    if (step < currentStep) {
        return "complete";
    }

    return step === currentStep ? "current" : "incomplete";
};

// The way through a flow of several steps, read as a row or a column of them. How far along the
// flow has come is said once, to the list, and each step is handed where it stands from that
// rather than being told one at a time.
//
// A step that stands somewhere the count cannot say — one that was skipped, or one already done
// out of order — can still be told where it stands in its own right, and what it is told is kept
function Steps(
    props: StepsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        currentStep = DEFAULT_CURRENT_STEP,
        orientation = "horizontal",
        size = "medium",
        ...rest
    } = props;

    const steps = getSteps(children);

    return (
        <ol
            ref={ref}
            // Safari takes the list semantics away from a list with no markers, so the role
            // is stated rather than left to the element
            role="list"
            className={classNames(stepsVariants({ orientation, size }), className)}
            data-component="Steps"
            data-orientation={orientation}
            data-size={size}
            data-count={steps.length}
            {...rest}
        >
            {steps.map((step, index) => (
                <StepsItemContext.Provider
                    // The keys come from the children themselves, so a step added or dropped
                    // ahead of the others does not remount the ones below it
                    key={step.key}
                    value={{ index, status: resolveStatus(index, currentStep) }}
                >
                    {step}
                </StepsItemContext.Provider>
            ))}
        </ol>
    );
}

Steps.displayName = "Steps";

export default fixedForwardRef(Steps);
