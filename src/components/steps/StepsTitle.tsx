import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StepsTitleProps } from "./Steps.types";

const classes = {
    root: "steps-title",
};

// What the step is called. How it is drawn follows the state the step around it is in, so the
// one being worked on stands out from the ones that are done and the ones still to come
function StepsTitle(
    props: StepsTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Steps.Title"
            {...rest}
        />
    );
}

StepsTitle.displayName = "Steps.Title";

export default fixedForwardRef(StepsTitle);
