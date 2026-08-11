import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { FlowListProps } from "./Flow.types";

const classes = {
    root: "flow-group",
    list: "flow-group-list",
};

// A run of steps taken one after another, standing as one branch of the group around it. The flow
// itself is already a run, so this is only wanted inside a Flow.Parallel, where a branch is more
// than a single step.
//
// Every step in the flow is put where the layout says rather than where the markup would leave
// it, so this draws no box of its own: it is here to say, to anything reading the page rather
// than looking at it, that these steps belong together and are taken in this order
function FlowList(
    props: FlowListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    return (
        <li
            ref={ref}
            // The box is taken away rather than the element, so the steps within are still laid
            // against the canvas. A box that is not drawn is dropped from the accessibility tree
            // by some browsers along with the meaning it carried, so the meaning is said again
            role="listitem"
            className={classNames(classes.root, className)}
            data-component="Flow.List"
            {...rest}
        >
            <ol role="list" className={classes.list}>
                {children}
            </ol>
        </li>
    );
}

FlowList.displayName = "Flow.List";

export default fixedForwardRef(FlowList);
