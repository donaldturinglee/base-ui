import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FlowParallelProps } from "./Flow.types";

const classes = {
    root: "flow-group",
    list: "flow-group-list",
};

// A set of branches taken at the same time rather than one after another. The step before the
// group is joined to every branch of it, and every branch back to the step after, which is what
// draws the fan out and the fan back in.
//
// A branch is a single Flow.Node, or a Flow.List where it is more than one step. Like the run
// above it, this draws no box of its own: the layout is what says where its branches stand
function FlowParallel(
    props: FlowParallelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, align = "start", ...rest } = props;

    return (
        <li
            ref={ref}
            // The box is taken away rather than the element, so the branches within are still
            // laid against the canvas. A box that is not drawn is dropped from the accessibility
            // tree by some browsers along with the meaning it carried, so it is said again
            role="listitem"
            className={classNames(classes.root, className)}
            data-component="Flow.Parallel"
            data-align={align}
            {...rest}
        >
            <ol role="list" className={classes.list}>
                {children}
            </ol>
        </li>
    );
}

FlowParallel.displayName = "Flow.Parallel";

export default fixedForwardRef(FlowParallel);
