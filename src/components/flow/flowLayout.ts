import type {
    FlowEdge,
    FlowLayoutOptions,
    FlowPositions,
    FlowSize,
    FlowSizes,
    FlowTreeNode,
} from "./Flow.types";

// How far a subtree runs along the flow, and how far it stands across it. Both are measured in
// the flow's own two directions rather than in x and y, so the same arithmetic lays out a flow
// that reads across and one that reads down
type FlowExtent = {
    main: number;
    cross: number;
};

const EMPTY_SIZE: FlowSize = { width: 0, height: 0 };

// Measures every subtree once and keeps the answer, since laying a subtree out asks for the
// extent of every subtree within it and of the subtree itself
const measurer = ({ sizes, orientation, columnGap, rowGap }: FlowLayoutOptions) => {
    const cache = new Map<FlowTreeNode, FlowExtent>();

    const measure = (tree: FlowTreeNode): FlowExtent => {
        const cached = cache.get(tree);

        if (cached) {
            return cached;
        }

        let extent: FlowExtent;

        if (tree.kind === "node") {
            const size = sizes[tree.id] ?? EMPTY_SIZE;

            extent =
                orientation === "horizontal"
                    ? { main: size.width, cross: size.height }
                    : { main: size.height, cross: size.width };
        } else if (tree.kind === "list") {
            // A run of steps follows one another along the flow, and stands as far across it as
            // its widest step
            extent = tree.children.reduce<FlowExtent>(
                (total, child, index) => {
                    const child_ = measure(child);

                    return {
                        main: total.main + child_.main + (index > 0 ? columnGap : 0),
                        cross: Math.max(total.cross, child_.cross),
                    };
                },
                { main: 0, cross: 0 },
            );
        } else {
            // Branches stand beside one another across the flow, and the group runs as far along
            // it as its longest branch
            extent = tree.children.reduce<FlowExtent>(
                (total, child, index) => {
                    const child_ = measure(child);

                    return {
                        main: Math.max(total.main, child_.main),
                        cross: total.cross + child_.cross + (index > 0 ? rowGap : 0),
                    };
                },
                { main: 0, cross: 0 },
            );
        }

        cache.set(tree, extent);

        return extent;
    };

    return measure;
};

// Where every step stands, worked out from what the steps measure and the shape they are written
// in. Nothing is read off the page here and nothing is written to it: the same shape and the same
// measurements always give the same answer
export const computePositions = (tree: FlowTreeNode, options: FlowLayoutOptions): FlowPositions => {
    const { orientation, align, columnGap, rowGap } = options;
    const measure = measurer(options);
    const positions: FlowPositions = {};

    const place = (subtree: FlowTreeNode, mainStart: number, crossStart: number) => {
        if (subtree.kind === "node") {
            positions[subtree.id] =
                orientation === "horizontal"
                    ? { x: mainStart, y: crossStart }
                    : { x: crossStart, y: mainStart };

            return;
        }

        const extent = measure(subtree);

        if (subtree.kind === "list") {
            let main = mainStart;

            subtree.children.forEach((child) => {
                const childExtent = measure(child);
                // A step shorter across the flow than the run it stands in either lines up with
                // the start of the run or stands in the middle of it
                const cross =
                    align === "center"
                        ? crossStart + (extent.cross - childExtent.cross) / 2
                        : crossStart;

                place(child, main, cross);
                main += childExtent.main + columnGap;
            });

            return;
        }

        let cross = crossStart;

        subtree.children.forEach((child) => {
            const childExtent = measure(child);
            // A branch shorter along the flow than the group begins with the group, unless the
            // group was told to have its branches end together instead
            const main =
                subtree.align === "end" ? mainStart + (extent.main - childExtent.main) : mainStart;

            place(child, main, cross);
            cross += childExtent.cross + rowGap;
        });
    };

    place(tree, 0, 0);

    return positions;
};

// The places a subtree is entered at. A run is entered at the first of its steps, and a group at
// every one of its branches at once
export const entryIds = (tree: FlowTreeNode): string[] => {
    if (tree.kind === "node") {
        return [tree.id];
    }

    if (tree.kind === "parallel") {
        return tree.children.flatMap(entryIds);
    }

    for (const child of tree.children) {
        const ids = entryIds(child);

        // A run may begin with something holding no steps at all, which is passed over rather
        // than taken as the way in
        if (ids.length > 0) {
            return ids;
        }
    }

    return [];
};

// And the places it is left by, which is the same rule read from the other end
export const exitIds = (tree: FlowTreeNode): string[] => {
    if (tree.kind === "node") {
        return [tree.id];
    }

    if (tree.kind === "parallel") {
        return tree.children.flatMap(exitIds);
    }

    for (let index = tree.children.length - 1; index >= 0; index -= 1) {
        const ids = exitIds(tree.children[index]);

        if (ids.length > 0) {
            return ids;
        }
    }

    return [];
};

// Every step in the flow, in the order it was written. What it is for is knowing when they have
// all said what they measure, since until they have there is nowhere to put any of them
export const nodeIds = (tree: FlowTreeNode): string[] =>
    tree.kind === "node" ? [tree.id] : tree.children.flatMap(nodeIds);

const disabledIdsOf = (tree: FlowTreeNode, into: Set<string> = new Set()): Set<string> => {
    if (tree.kind === "node") {
        if (tree.disabled) {
            into.add(tree.id);
        }

        return into;
    }

    tree.children.forEach((child) => disabledIdsOf(child, into));

    return into;
};

// Which steps are joined to which. Only a run joins anything: within it, everything the step
// before is left by is joined to everything the step after is entered at, so a step standing
// beside a group is joined to each of its branches
export const computeEdges = (tree: FlowTreeNode): FlowEdge[] => {
    const disabled = disabledIdsOf(tree);
    const edges: FlowEdge[] = [];

    const walk = (subtree: FlowTreeNode) => {
        if (subtree.kind === "node") {
            return;
        }

        subtree.children.forEach(walk);

        if (subtree.kind !== "list") {
            return;
        }

        for (let index = 0; index < subtree.children.length - 1; index += 1) {
            const before = subtree.children[index];
            const after = subtree.children[index + 1];

            // Two groups standing next to one another would be joined branch to branch, every
            // one of the first to every one of the second. The crossing lines say less than the
            // gap between them does, so they are left unjoined
            if (before.kind === "parallel" && after.kind === "parallel") {
                continue;
            }

            exitIds(before).forEach((from) => {
                entryIds(after).forEach((to) => {
                    edges.push({
                        from,
                        to,
                        disabled: disabled.has(from) || disabled.has(to) || undefined,
                    });
                });
            });
        }
    };

    walk(tree);

    return edges;
};

// How much room the laid-out flow takes, which is what the canvas it is drawn on is sized to
export const computeFlowRect = (positions: FlowPositions, sizes: FlowSizes): FlowSize =>
    Object.entries(positions).reduce<FlowSize>(
        (rect, [id, position]) => {
            const size = sizes[id] ?? EMPTY_SIZE;

            return {
                width: Math.max(rect.width, position.x + size.width),
                height: Math.max(rect.height, position.y + size.height),
            };
        },
        { width: 0, height: 0 },
    );
