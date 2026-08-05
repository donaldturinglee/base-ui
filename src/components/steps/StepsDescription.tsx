import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StepsDescriptionProps } from "./Steps.types";

const classes = {
    root: "steps-description",
};

// Secondary text saying more about a step than its title does
function StepsDescription(
    props: StepsDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Steps.Description"
            {...rest}
        />
    );
}

StepsDescription.displayName = "Steps.Description";

export default fixedForwardRef(StepsDescription);
