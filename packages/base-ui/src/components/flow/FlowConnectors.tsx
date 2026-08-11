import * as React from "react";
import { classNames } from "../../lib/classnames";
import { connectorPath } from "./flowPath";
import type { FlowEdge, FlowOrientation, FlowPositions, FlowSize, FlowSizes } from "./Flow.types";

const classes = {
    root: "flow-connectors",
    path: "flow-connector",
    disabled: "flow-connector-disabled",
    arrowhead: "flow-arrowhead",
};

const EMPTY_SIZE: FlowSize = { width: 0, height: 0 };

// The joins are drawn by the flow rather than by the caller, since only the flow knows where
// every step ended up. The props are what it already worked out, handed straight over
export type FlowConnectorsRenderProps = {
    edges: FlowEdge[];
    positions: FlowPositions;
    sizes: FlowSizes;
    orientation: FlowOrientation;
    cornerRadius: number;
    width: number;
    height: number;
    // The arrowhead is pointed at from every join by name, and there is one set of names to a
    // page, so each flow makes its own
    markerId: string;
    className?: string;
};

// The lines between the steps, drawn as one sheet laid under them rather than as a line to each.
// A single sheet is what lets a join run from any step to any other without being clipped by the
// boxes it passes between.
//
// It is kept from a screen reader entirely: the order the steps are taken in is already carried
// by the list they stand in, and a reader hearing it twice would hear it once as an order and
// once as a heap of lines
const FlowConnectors = ({
    edges,
    positions,
    sizes,
    orientation,
    cornerRadius,
    width,
    height,
    markerId,
    className,
}: FlowConnectorsRenderProps) => {
    const drawn = edges
        .map((edge) => {
            const from = positions[edge.from];
            const to = positions[edge.to];

            if (!from || !to) {
                return null;
            }

            return {
                edge,
                d: connectorPath(
                    { ...from, ...(sizes[edge.from] ?? EMPTY_SIZE) },
                    { ...to, ...(sizes[edge.to] ?? EMPTY_SIZE) },
                    orientation,
                    cornerRadius,
                ),
            };
        })
        .filter((join) => join !== null);

    // A join that cannot be taken is drawn first, so where two of them meet the one that can be
    // taken is the one lying on top
    const ordered = [
        ...drawn.filter((join) => join.edge.disabled),
        ...drawn.filter((join) => !join.edge.disabled),
    ];

    return (
        <svg
            className={classNames(classes.root, className)}
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            data-component="Flow.Connectors"
        >
            <defs>
                <marker
                    id={markerId}
                    className={classes.arrowhead}
                    markerWidth="6"
                    markerHeight="6"
                    refX="5"
                    refY="3"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                >
                    <path d="M 0 0 L 6 3 L 0 6 Z" />
                </marker>
            </defs>

            {ordered.map(({ edge, d }) => (
                <path
                    key={`${edge.from}--${edge.to}`}
                    className={classNames(classes.path, edge.disabled && classes.disabled)}
                    d={d}
                    markerEnd={`url(#${markerId})`}
                    data-component="Flow.Connector"
                    data-from={edge.from}
                    data-to={edge.to}
                    data-disabled={edge.disabled}
                />
            ))}
        </svg>
    );
};

FlowConnectors.displayName = "Flow.Connectors";

export default FlowConnectors;
