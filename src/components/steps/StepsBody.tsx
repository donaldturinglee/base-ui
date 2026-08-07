import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { StepsBodyProps } from "./Steps.types";

const classes = {
    root: "steps-body",
};

// The words beside the circle, which stack so that a step saying more than its name has room
// for the rest of it
function StepsBody(
    props: StepsBodyProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Steps.Body"
            {...rest}
        />
    );
}

StepsBody.displayName = "Steps.Body";

export default fixedForwardRef(StepsBody);
