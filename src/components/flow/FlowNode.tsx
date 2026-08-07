import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { FlowContext } from "./FlowContext";
import type { FlowNodeProps } from "./Flow.types";

const classes = {
    root: "flow-node",
    disabled: "flow-node-disabled",
};

// One step of the flow: a box holding whatever the step is, standing where the layout put it.
//
// It measures itself and says so, rather than being measured from above: a step is drawn from
// whatever the caller put in it, so only the browser knows how much room it takes, and it takes a
// different amount again as the page is resized or the font it is set in arrives. Every step
// saying its own size is what lets the layout be worked out from numbers rather than read back
// off the page a second time.
//
// Until they have all said, there is nowhere to put any of them, so the whole flow is held out of
// sight rather than drawn in a heap at the corner and then scattered
function FlowNode(
    props: FlowNodeProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, id, disabled, style, ...rest } = props;
    const { positions, reportSize, measured } = React.useContext(FlowContext);

    const elementRef = React.useRef<HTMLLIElement>(null);
    const mergedRef = useMergedRefs(ref, elementRef);

    // A step standing outside a flow has nobody to say its size to, and nowhere to be put
    const nodeId = id ?? "";

    useIsomorphicLayoutEffect(() => {
        const element = elementRef.current;

        if (!element || !reportSize || nodeId === "") {
            return;
        }

        const measure = () => {
            reportSize(nodeId, { width: element.offsetWidth, height: element.offsetHeight });
        };

        measure();

        // The first measurement is taken as soon as the step is on the page; the observer is
        // only there for what happens to it afterwards, which is why a runtime without one is
        // left with the first measurement rather than with nothing
        if (typeof ResizeObserver === "undefined") {
            return () => {
                reportSize(nodeId, null);
            };
        }

        const observer = new ResizeObserver(measure);

        observer.observe(element);

        return () => {
            observer.disconnect();
            reportSize(nodeId, null);
        };
    }, [nodeId, reportSize]);

    const position = positions?.[nodeId];

    return (
        <li
            ref={mergedRef}
            className={classNames(classes.root, disabled && classes.disabled, className)}
            style={{
                ...style,
                insetInlineStart: position ? `${position.x}px` : undefined,
                insetBlockStart: position ? `${position.y}px` : undefined,
            }}
            data-component="Flow.Node"
            data-node-id={nodeId || undefined}
            data-disabled={disabled}
            // A step that has not been put anywhere yet is still being measured, and a reader
            // arriving at a heap of them in the corner would be told the flow runs in an order
            // it does not
            aria-hidden={measured ? undefined : true}
            {...rest}
        />
    );
}

FlowNode.displayName = "Flow.Node";

export default fixedForwardRef(FlowNode);
