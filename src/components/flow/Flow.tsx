import * as React from "react";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOverflow } from "../../hooks/useOverflow";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import FlowConnectors from "./FlowConnectors";
import { FlowContext } from "./FlowContext";
import FlowList from "./FlowList";
import FlowNode from "./FlowNode";
import FlowParallel from "./FlowParallel";
import { computeEdges, computeFlowRect, computePositions, nodeIds } from "./flowLayout";
import type {
    FlowListProps,
    FlowNodeProps,
    FlowParallelProps,
    FlowProps,
    FlowSize,
    FlowSizes,
    FlowTreeNode,
} from "./Flow.types";

const classes = {
    root: "flow",
    canvas: "flow-canvas",
    list: "flow-list",
};

// The room left between one step and the next along the flow, and between one branch and the
// next across it. A join has to turn twice to reach a branch beside the one it left, so there is
// more room along the flow than across it for the turns to be made in
const DEFAULT_COLUMN_GAP = 64;
const DEFAULT_ROW_GAP = 16;
const DEFAULT_CORNER_RADIUS = 8;

type FlowBuild = {
    branches: FlowTreeNode[];
    elements: React.ReactNode[];
};

// Reads the shape of the flow off what was written, and hands every step that was not named a
// name taken from where it stands.
//
// The shape is read rather than registered: a step could say what it is on the way up, through a
// context, but nothing would know the whole shape until every step had rendered and said so, and
// the flow would be laid out twice on arrival and again on every change. Reading it here means
// the whole shape is known before anything is drawn, and the only thing still to arrive is what
// each step measures
const buildFlow = (children: React.ReactNode, path: string): FlowBuild => {
    const branches: FlowTreeNode[] = [];
    const elements: React.ReactNode[] = [];

    React.Children.toArray(children).forEach((child, index) => {
        if (!React.isValidElement(child)) {
            elements.push(child);
            return;
        }

        const key = path === "" ? `${index}` : `${path}-${index}`;

        if (child.type === FlowNode) {
            const node = child as React.ReactElement<FlowNodeProps>;
            const id = node.props.id ?? `node-${key}`;

            branches.push({ kind: "node", id, disabled: node.props.disabled });
            elements.push(React.cloneElement(node, { id }));
            return;
        }

        if (child.type === FlowList) {
            const list = child as React.ReactElement<FlowListProps>;
            const inner = buildFlow(list.props.children, key);

            branches.push({ kind: "list", children: inner.branches });
            elements.push(React.cloneElement(list, undefined, inner.elements));
            return;
        }

        if (child.type === FlowParallel) {
            const parallel = child as React.ReactElement<FlowParallelProps>;
            const inner = buildFlow(parallel.props.children, key);

            branches.push({
                kind: "parallel",
                align: parallel.props.align,
                children: inner.branches,
            });
            elements.push(React.cloneElement(parallel, undefined, inner.elements));
            return;
        }

        // Anything that is not a step of the flow stands where it was written, and is left out
        // of the layout and out of the joins
        elements.push(child);
    });

    return { branches, elements };
};

// A diagram of the way something runs: the steps taken, in the order they are taken, with the
// places that branch drawn as branches.
//
//     <Flow aria-label="How a request is served">
//         <Flow.Node>Request</Flow.Node>
//         <Flow.Parallel>
//             <Flow.Node>Cache</Flow.Node>
//             <Flow.Node>Worker</Flow.Node>
//         </Flow.Parallel>
//         <Flow.Node>Response</Flow.Node>
//     </Flow>
//
// The flow is a run of steps itself, so the steps are written straight into it and only a branch
// needs a Flow.Parallel around it.
//
// Every step is put where the layout says rather than where the markup would leave it, since a
// step standing beside a branch has to stand beside all of them at once, which no ordinary flow
// of boxes will do. What the page keeps is the reading order: the steps are a list, and a branch
// is a list within it, so a reader who cannot see the lines is still told what follows what.
//
// The joins are drawn underneath as one sheet, which is what lets a line run between two boxes
// without being clipped by everything it passes
function Flow<As extends React.ElementType = "div">(
    props: FlowProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        orientation = "horizontal",
        align = "start",
        columnGap = DEFAULT_COLUMN_GAP,
        rowGap = DEFAULT_ROW_GAP,
        cornerRadius = DEFAULT_CORNER_RADIUS,
        children,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props as FlowProps<"div">;

    const uuid = useId();
    // React writes its own ids with colons either side, which a url() in an attribute cannot
    // point at, so the name the arrowhead is found under is stripped back to what will serve
    const markerId = `${uuid.replace(/[^a-zA-Z0-9-]/g, "")}-flow-arrowhead`;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);
    const hasOverflow = useOverflow(rootRef);

    const [sizes, setSizes] = React.useState<FlowSizes>({});

    // A step says what it measures on arrival and again whenever it changes. The answer is only
    // taken when it differs from the one before, so a step that was laid out again at the size it
    // already had does not send the flow round once more
    const reportSize = React.useCallback((id: string, size: FlowSize | null) => {
        setSizes((current) => {
            if (size === null) {
                if (!(id in current)) {
                    return current;
                }

                const next = { ...current };

                delete next[id];

                return next;
            }

            const previous = current[id];

            if (previous && previous.width === size.width && previous.height === size.height) {
                return current;
            }

            return { ...current, [id]: size };
        });
    }, []);

    const { tree, elements } = React.useMemo(() => {
        const built = buildFlow(children, "");

        return {
            tree: { kind: "list", children: built.branches } as FlowTreeNode,
            elements: built.elements,
        };
    }, [children]);

    // Until every step has said what it measures there is nowhere to put any of them, so the
    // flow is held out of sight rather than drawn in a heap at the corner and then scattered
    const measured = React.useMemo(() => nodeIds(tree).every((id) => id in sizes), [tree, sizes]);

    const positions = React.useMemo(
        () => computePositions(tree, { sizes, orientation, align, columnGap, rowGap }),
        [tree, sizes, orientation, align, columnGap, rowGap],
    );

    const edges = React.useMemo(() => computeEdges(tree), [tree]);
    const rect = React.useMemo(() => computeFlowRect(positions, sizes), [positions, sizes]);

    const context = { orientation, positions, measured, reportSize };

    // A flow with more of itself than it can show is scrolled to, so it is put in the tab order
    // and named where the caller named it. One that fits has nothing to move within, and a stop
    // there would only be a stop a keyboard has to pass through
    const scrollProps = hasOverflow
        ? {
              role: ariaLabel || ariaLabelledBy ? "region" : undefined,
              tabIndex: 0,
          }
        : {};

    return (
        <FlowContext.Provider value={context}>
            <Component
                ref={mergedRef}
                className={classNames(classes.root, className)}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                data-component="Flow"
                data-orientation={orientation}
                data-align={align}
                data-measured={measured}
                {...scrollProps}
                {...rest}
            >
                <div
                    className={classes.canvas}
                    style={{ width: `${rect.width}px`, height: `${rect.height}px` }}
                    data-component="Flow.Canvas"
                >
                    <FlowConnectors
                        edges={edges}
                        positions={positions}
                        sizes={sizes}
                        orientation={orientation}
                        cornerRadius={cornerRadius}
                        width={rect.width}
                        height={rect.height}
                        markerId={markerId}
                    />

                    <ol role="list" className={classes.list} data-component="Flow.Steps">
                        {elements}
                    </ol>
                </div>
            </Component>
        </FlowContext.Provider>
    );
}

Flow.displayName = "Flow";

export default fixedForwardRef(Flow);
