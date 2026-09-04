import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import {
    clamp,
    constraintsOf,
    isCollapsed,
    resizeAt,
    sameLayout,
    setSizeAt,
    settle,
    startingSizes,
    sum,
    toLayout,
    toPercentage,
} from "./resizableLayout";
import type {
    ResizableConstraints,
    ResizablePanelRecord,
    ResizableSizeContext,
} from "./resizableLayout";
import type {
    ResizableLayout,
    ResizableOrientation,
    ResizablePanelSize,
    ResizablePanelSizes,
    ResizableProps,
} from "./Resizable.types";

// How far a trigger moves for one press of an arrow key, as a share of the group. Small enough to
// place a panel and large enough that a reader is not held on the key
const KEYBOARD_STEP = 5;

// Two sizes that differ only in the last place of a floating point number are the same size, not a
// reason to lay the panels out again
const EPSILON = 0.0001;

// The triggers standing in a group, which is how the room left to the panels is worked out, and
// the ones a keyboard can reach, which is what stepping from one to the next runs through
const TRIGGER_SELECTOR = '[data-component="Resizable.ResizeTrigger"]';

const REACHABLE_TRIGGER_SELECTOR = `${TRIGGER_SELECTOR}[tabindex]`;

// Which way a group runs, what a pointer moving along it is read from, and which way a trigger
// standing in it runs: the other way about, since panels side by side are parted by a line
// standing up
const AXIS = {
    horizontal: { size: "width", point: "clientX", cursor: "col-resize" },
    vertical: { size: "height", point: "clientY", cursor: "row-resize" },
} as const;

const lengthOf = (element: Element | null | undefined, orientation: ResizableOrientation) =>
    element ? element.getBoundingClientRect()[AXIS[orientation].size] : 0;

const fontSizeOf = (element: Element | null) =>
    element ? Number.parseFloat(getComputedStyle(element).fontSize) || 16 : 16;

// What a panel says about itself, and what it wants to hear back. The callback is kept here rather
// than with the sizes, so that the maths the layout is worked out by has nothing to call
type PanelRegistration = ResizablePanelRecord & {
    onResize?: (
        size: ResizablePanelSizes,
        id: string,
        previous: ResizablePanelSizes | undefined,
    ) => void;
};

// The panels a group holds, in the order they are drawn in. It is read off the elements rather
// than off the order they registered in, since a panel added later registers last however far up
// the group it stands
const panelOrder = (group: HTMLElement | null, records: Map<string, PanelRegistration>) => {
    if (!group) {
        return [...records.values()];
    }

    const drawn: PanelRegistration[] = [];

    for (const child of Array.from(group.children)) {
        const id = (child as HTMLElement).dataset.panel;
        const record = id === undefined ? undefined : records.get(id);

        if (record) {
            drawn.push(record);
        }
    }

    return drawn;
};

// Which pair of panels a trigger stands between, counted off the elements it is a sibling of. The
// trigger after the first panel is the first trigger, whatever else has been put in the group
const triggerIndexOf = (group: HTMLElement | null, trigger: HTMLElement) => {
    if (!group) {
        return -1;
    }

    let panels = 0;

    for (const child of Array.from(group.children)) {
        if (child === trigger) {
            return panels - 1;
        }

        if ((child as HTMLElement).dataset.panel !== undefined) {
            panels += 1;
        }
    }

    return -1;
};

export type UseResizableProps = Pick<
    ResizableProps,
    | "orientation"
    | "disabled"
    | "disableCursor"
    | "defaultLayout"
    | "onLayoutChange"
    | "onLayoutChanged"
>;

// Everything a group of panels needs and nothing that draws one: where the panels stand, what they
// will and will not do, and the ways of moving them. The panels and the triggers are all drawn
// from this, so a group built out of the parts is working from the one layout rather than each
// part keeping a reading of its own
export const useResizable = (props: UseResizableProps = {}) => {
    const {
        orientation = "horizontal",
        disabled = false,
        disableCursor = false,
        defaultLayout,
        onLayoutChange,
        onLayoutChanged,
    } = props;

    const groupRef = React.useRef<HTMLDivElement | null>(null);
    const records = React.useRef(new Map<string, PanelRegistration>());

    const [layout, setLayout] = React.useState<ResizableLayout>(() => defaultLayout ?? {});

    // The layout as the handlers read it. They are set up once and live as long as the group, so
    // they cannot close over a reading that has since moved; the state is what the panels draw
    // themselves from and this is what everything else works against
    const layoutRef = React.useRef(layout);
    layoutRef.current = layout;

    // Bumped as panels arrive and leave, which is what says the group has to be laid out again.
    // The panels themselves are kept in a ref, so registering one does not draw the group twice
    const [registered, setRegistered] = React.useState(0);

    // What the last size reported for a panel was, so a panel is only told its size has changed
    // when it has, and what it stood at before it was folded away, so bringing it back returns it
    // to where the reader left it
    const reported = React.useRef(new Map<string, ResizablePanelSizes>());
    const beforeCollapse = React.useRef(new Map<string, number>());

    // The handlers are read as the layout moves, and one written fresh each render would set the
    // reading up again on every pass; the latest are held aside instead
    const onLayoutChangeRef = React.useRef(onLayoutChange);
    const onLayoutChangedRef = React.useRef(onLayoutChanged);

    React.useEffect(() => {
        onLayoutChangeRef.current = onLayoutChange;
        onLayoutChangedRef.current = onLayoutChanged;
    }, [onLayoutChange, onLayoutChanged]);

    // What a size given in something other than a share is read against. It is measured rather
    // than remembered, since the group is laid out within whatever room it was given and that room
    // is not the group's to know
    const sizeContext = React.useCallback((): ResizableSizeContext => {
        const group = groupRef.current;
        const triggers = group
            ? Array.from(group.querySelectorAll<HTMLElement>(TRIGGER_SELECTOR))
            : [];
        const spent = sum(triggers.map((trigger) => lengthOf(trigger, orientation)));

        return {
            availablePx: Math.max(lengthOf(group, orientation) - spent, 0),
            remPx: fontSizeOf(typeof document === "undefined" ? null : document.documentElement),
            emPx: fontSizeOf(group),
            vhPx: typeof window === "undefined" ? 0 : window.innerHeight / 100,
            vwPx: typeof window === "undefined" ? 0 : window.innerWidth / 100,
        };
    }, [orientation]);

    // The panels as the maths reads them: what each of them says about itself, in the order they
    // are drawn, with what each will and will not do worked out against the room there is, and
    // where each of them stands just now
    const readPanels = React.useCallback(() => {
        const context = sizeContext();
        const drawn = panelOrder(groupRef.current, records.current);

        return {
            context,
            drawn,
            constraints: drawn.map((panel) => constraintsOf(panel, context)),
            sizes: drawn.map((panel) => layoutRef.current[panel.id] ?? 0),
        };
    }, [sizeContext]);

    // The shares written back, with everything that follows from them: the panels told where they
    // stand, and whoever is watching told the layout has moved. A layout that has not moved is not
    // reported as though it had
    const commit = React.useCallback(
        (drawn: PanelRegistration[], sizes: number[], settled = false) => {
            const next = toLayout(drawn, sizes);

            if (sameLayout(layoutRef.current, next)) {
                return next;
            }

            layoutRef.current = next;
            setLayout(next);
            onLayoutChangeRef.current?.(next);

            if (settled) {
                onLayoutChangedRef.current?.(next, { isUserInteraction: true });
            }

            return next;
        },
        [],
    );

    // The panels laid out again from the ground up: read off the elements, started where they were
    // told to start, and held to what they will take. It runs as panels arrive and leave and as
    // the room around the group changes, since a size given in pixels is a different share at
    // every width
    const relayout = React.useCallback(() => {
        const { context, drawn, constraints } = readPanels();

        if (!drawn.length) {
            return;
        }

        const known = drawn.map((panel) => layoutRef.current[panel.id]);
        const settledSizes = settle(
            known.every((size) => typeof size === "number")
                ? (known as number[])
                : startingSizes(drawn, context, layoutRef.current),
            constraints,
        );
        const next = toLayout(drawn, settledSizes);

        if (sameLayout(layoutRef.current, next)) {
            return;
        }

        layoutRef.current = next;
        setLayout(next);
        onLayoutChangeRef.current?.(next);
    }, [readPanels]);

    // A panel says what it is before it is laid out, and says so again whenever what it says
    // changes, so the group never works from a reading a panel has moved on from
    const registerPanel = React.useCallback((record: PanelRegistration) => {
        records.current.set(record.id, record);
        setRegistered((count) => count + 1);

        return () => {
            records.current.delete(record.id);
            reported.current.delete(record.id);
            beforeCollapse.current.delete(record.id);
            setRegistered((count) => count + 1);
        };
    }, []);

    // Laid out once the panels have said what they are, and again whenever that changes. Panels
    // register as they are drawn, which is before the group's own effect runs, so by the time this
    // is reached every panel standing in the group has been heard from
    useIsomorphicLayoutEffect(() => {
        relayout();
    }, [registered, orientation, relayout]);

    // A size given in pixels is a different share at every width, so the panels are held to what
    // they will take again whenever the room around them changes
    React.useEffect(() => {
        const group = groupRef.current;

        if (!group || typeof ResizeObserver === "undefined") {
            return;
        }

        const observer = new ResizeObserver(() => relayout());

        observer.observe(group);

        return () => observer.disconnect();
    }, [relayout]);

    // Each panel is told its own size once it has one, and only when it has changed, so a handler
    // watching one panel is not woken by another moving
    React.useEffect(() => {
        const context = sizeContext();

        for (const [id, record] of records.current) {
            const share = layout[id];

            if (typeof share !== "number") {
                continue;
            }

            const sizes: ResizablePanelSizes = {
                asPercentage: share,
                inPixels: (share / 100) * context.availablePx,
            };
            const previous = reported.current.get(id);

            if (
                previous &&
                Math.abs(previous.asPercentage - sizes.asPercentage) <= EPSILON &&
                Math.abs(previous.inPixels - sizes.inPixels) <= EPSILON
            ) {
                continue;
            }

            reported.current.set(id, sizes);
            record.onResize?.(sizes, id, previous);
        }
    }, [layout, sizeContext]);

    // A panel folded away, and whatever it gives up handed to the panels beside it. Where it stood
    // is kept, so that bringing it back returns it to where the reader left it rather than to the
    // size it was first drawn at
    const collapseAt = React.useCallback(
        (
            index: number,
            drawn: PanelRegistration[],
            constraints: ResizableConstraints[],
            sizes: number[],
        ) => {
            const constraint = constraints[index];

            if (!constraint.collapsible || isCollapsed(sizes[index], constraint)) {
                return;
            }

            beforeCollapse.current.set(drawn[index].id, sizes[index]);
            commit(drawn, setSizeAt(sizes, constraints, index, constraint.collapsedTo), true);
        },
        [commit],
    );

    const expandAt = React.useCallback(
        (
            index: number,
            drawn: PanelRegistration[],
            constraints: ResizableConstraints[],
            sizes: number[],
        ) => {
            const constraint = constraints[index];

            if (!constraint.collapsible || !isCollapsed(sizes[index], constraint)) {
                return;
            }

            const back = beforeCollapse.current.get(drawn[index].id);
            const target = clamp(
                typeof back === "number" ? back : constraint.min,
                constraint.min,
                constraint.max,
            );

            commit(drawn, setSizeAt(sizes, constraints, index, target), true);
        },
        [commit],
    );

    // Where a trigger has been taken to. The panels are moved by however far the pointer has come
    // from where it was pressed rather than by however far it moved this time, so a drag that runs
    // past what a panel will take and comes back again lands where the pointer is
    const drag = React.useRef<{
        index: number;
        from: number;
        sizes: number[];
        constraints: ResizableConstraints[];
        drawn: PanelRegistration[];
        availablePx: number;
    } | null>(null);

    const isHeld = React.useCallback(
        (trigger: HTMLElement) => disabled || trigger.getAttribute("aria-disabled") === "true",
        [disabled],
    );

    const startDrag = React.useCallback(
        (trigger: HTMLElement, event: React.PointerEvent) => {
            if (isHeld(trigger)) {
                return;
            }

            const index = triggerIndexOf(groupRef.current, trigger);
            const { context, drawn, constraints, sizes } = readPanels();

            if (index < 0 || index + 1 >= drawn.length) {
                return;
            }

            drag.current = {
                index,
                from: event[AXIS[orientation].point],
                sizes,
                constraints,
                drawn,
                availablePx: context.availablePx,
            };

            trigger.setPointerCapture(event.pointerId);
            trigger.dataset.separator = "active";

            if (!disableCursor && typeof document !== "undefined") {
                document.body.style.cursor = AXIS[orientation].cursor;
                // A drag that wanders over words would otherwise select them on its way past
                document.body.style.userSelect = "none";
            }
        },
        [disableCursor, isHeld, orientation, readPanels],
    );

    const moveDrag = React.useCallback(
        (event: React.PointerEvent) => {
            const held = drag.current;

            if (!held) {
                return;
            }

            const travelled = event[AXIS[orientation].point] - held.from;
            const delta = held.availablePx > 0 ? (travelled / held.availablePx) * 100 : 0;

            commit(held.drawn, resizeAt(held.sizes, held.constraints, held.index, delta));
        },
        [commit, orientation],
    );

    const endDrag = React.useCallback((trigger: HTMLElement, event: React.PointerEvent) => {
        if (!drag.current) {
            return;
        }

        drag.current = null;

        if (trigger.hasPointerCapture(event.pointerId)) {
            trigger.releasePointerCapture(event.pointerId);
        }

        trigger.dataset.separator = "inactive";

        if (typeof document !== "undefined") {
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }

        onLayoutChangedRef.current?.({ ...layoutRef.current }, { isUserInteraction: true });
    }, []);

    // A trigger moved without the pointer. The arrow keys step it, Home and End take it as far as
    // it will go either way, Enter folds away a panel that may be folded and brings it back, and
    // F6 steps from one trigger to the next
    const handleTriggerKeyDown = React.useCallback(
        (trigger: HTMLElement, event: React.KeyboardEvent) => {
            if (event.key === "F6") {
                const reachable =
                    groupRef.current?.querySelectorAll<HTMLElement>(REACHABLE_TRIGGER_SELECTOR) ??
                    [];
                const triggers = Array.from(reachable);
                const at = triggers.indexOf(trigger);

                if (triggers.length > 1 && at >= 0) {
                    event.preventDefault();
                    triggers[(at + 1) % triggers.length].focus();
                }

                return;
            }

            if (isHeld(trigger)) {
                return;
            }

            const index = triggerIndexOf(groupRef.current, trigger);
            const { drawn, constraints, sizes } = readPanels();

            if (index < 0 || index + 1 >= drawn.length) {
                return;
            }

            if (event.key === "Enter") {
                if (!constraints[index].collapsible) {
                    return;
                }

                event.preventDefault();

                if (isCollapsed(sizes[index], constraints[index])) {
                    expandAt(index, drawn, constraints, sizes);
                } else {
                    collapseAt(index, drawn, constraints, sizes);
                }

                return;
            }

            const back = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
            const on = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
            const delta: Record<string, number> = {
                [back]: -KEYBOARD_STEP,
                [on]: KEYBOARD_STEP,
                Home: -100,
                End: 100,
            };
            const step = delta[event.key];

            if (step === undefined) {
                return;
            }

            event.preventDefault();
            commit(drawn, resizeAt(sizes, constraints, index, step), true);
        },
        [collapseAt, commit, expandAt, isHeld, orientation, readPanels],
    );

    // A panel put back to the size it started at, which is what double-clicking the trigger beside
    // it does
    const resetAt = React.useCallback(
        (trigger: HTMLElement) => {
            if (isHeld(trigger)) {
                return;
            }

            const index = triggerIndexOf(groupRef.current, trigger);
            const { context, drawn, constraints, sizes } = readPanels();

            if (index < 0 || index + 1 >= drawn.length) {
                return;
            }

            const started = toPercentage(drawn[index].defaultSize, context);

            if (started === undefined) {
                return;
            }

            commit(drawn, resizeAt(sizes, constraints, index, started - sizes[index]), true);
        },
        [commit, isHeld, readPanels],
    );

    // What a panel can be asked to do, worked out here rather than by the panel, since moving one
    // panel is a matter of what stands beside it
    const withPanel = React.useCallback(
        (
            id: string,
            act: (found: {
                index: number;
                drawn: PanelRegistration[];
                constraints: ResizableConstraints[];
                sizes: number[];
                context: ResizableSizeContext;
            }) => void,
        ) => {
            const found = readPanels();
            const index = found.drawn.findIndex((panel) => panel.id === id);

            if (index >= 0) {
                act({ ...found, index });
            }
        },
        [readPanels],
    );

    const collapsePanel = React.useCallback(
        (id: string) =>
            withPanel(id, ({ index, drawn, constraints, sizes }) =>
                collapseAt(index, drawn, constraints, sizes),
            ),
        [collapseAt, withPanel],
    );

    const expandPanel = React.useCallback(
        (id: string) =>
            withPanel(id, ({ index, drawn, constraints, sizes }) =>
                expandAt(index, drawn, constraints, sizes),
            ),
        [expandAt, withPanel],
    );

    const resizePanel = React.useCallback(
        (id: string, size: ResizablePanelSize) =>
            withPanel(id, ({ index, drawn, constraints, sizes, context }) => {
                const share = toPercentage(size, context);

                if (share === undefined) {
                    return;
                }

                commit(drawn, setSizeAt(sizes, constraints, index, share), true);
            }),
        [commit, withPanel],
    );

    const panelSizes = React.useCallback(
        (id: string): ResizablePanelSizes => {
            const share = layoutRef.current[id] ?? 0;

            return {
                asPercentage: share,
                inPixels: (share / 100) * sizeContext().availablePx,
            };
        },
        [sizeContext],
    );

    const isPanelCollapsed = React.useCallback(
        (id: string) => {
            const record = records.current.get(id);

            if (!record) {
                return false;
            }

            return isCollapsed(layoutRef.current[id] ?? 0, constraintsOf(record, sizeContext()));
        },
        [sizeContext],
    );

    // What the group can be asked to do from outside it. Setting a layout is not the reader's
    // doing, so it is reported as a change that came from somewhere else
    const getLayout = React.useCallback(() => ({ ...layoutRef.current }), []);

    const applyLayout = React.useCallback(
        (next: ResizableLayout) => {
            const { drawn, constraints } = readPanels();
            const applied = toLayout(
                drawn,
                settle(
                    drawn.map((panel) => next[panel.id] ?? layoutRef.current[panel.id] ?? 0),
                    constraints,
                ),
            );

            if (!sameLayout(layoutRef.current, applied)) {
                layoutRef.current = applied;
                setLayout(applied);
                onLayoutChangeRef.current?.(applied);
            }

            onLayoutChangedRef.current?.(applied, { isUserInteraction: false });

            return applied;
        },
        [readPanels],
    );

    return {
        groupRef,
        orientation,
        disabled,
        layout,
        registerPanel,
        sizeOf: React.useCallback((id: string) => layout[id], [layout]),
        startDrag,
        moveDrag,
        endDrag,
        handleTriggerKeyDown,
        resetAt,
        collapsePanel,
        expandPanel,
        resizePanel,
        panelSizes,
        isPanelCollapsed,
        getLayout,
        setLayout: applyLayout,
    };
};

export type UseResizableReturn = ReturnType<typeof useResizable>;
