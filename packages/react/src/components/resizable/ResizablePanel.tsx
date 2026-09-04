import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useResizableContext } from "./ResizableContext";
import type { ResizablePanelInstance, ResizablePanelProps } from "./Resizable.types";

const classes = {
    root: "resizable-panel",
};

// One of the panels the group is divided into. How much room it starts with, and how little or
// how much it will take, are said here rather than by the group, so a panel carries its own
// bounds wherever it is put.
//
// A size given as a number is read as pixels and one given as a string without units as a share of
// the group; anything else is read as the unit it ends with, so "20rem" and "50%" both say what
// they look like they say.
//
// The class lands on the box the panel's content is drawn in rather than on the panel itself,
// which is laid out by the group and cannot be given a size of its own without unsettling it
function ResizablePanel(
    props: ResizablePanelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        id: idProp,
        defaultSize,
        minSize,
        maxSize,
        collapsible,
        collapsedSize,
        disabled,
        onResize,
        panelRef,
        style,
        children,
        ...rest
    } = props;

    const id = useId(idProp === undefined ? undefined : String(idProp));
    const {
        registerPanel,
        sizeOf,
        collapsePanel,
        expandPanel,
        resizePanel,
        panelSizes,
        isPanelCollapsed,
    } = useResizableContext();

    // What the panel is is said to the group before it is laid out, and said again whenever it
    // changes, so the group never works from a reading the panel has moved on from
    useIsomorphicLayoutEffect(
        () =>
            registerPanel?.({
                id,
                defaultSize,
                minSize,
                maxSize,
                collapsedSize,
                collapsible,
                disabled,
                onResize,
            }),
        [
            collapsedSize,
            collapsible,
            defaultSize,
            disabled,
            id,
            maxSize,
            minSize,
            onResize,
            registerPanel,
        ],
    );

    // What the panel can be asked to do from outside it. Every one of them is the group's to work
    // out, since moving one panel is a matter of what stands beside it
    React.useImperativeHandle(
        panelRef,
        (): ResizablePanelInstance => ({
            collapse: () => collapsePanel?.(id),
            expand: () => expandPanel?.(id),
            resize: (size) => resizePanel?.(id, size),
            getSize: () => panelSizes?.(id) ?? { asPercentage: 0, inPixels: 0 },
            isCollapsed: () => isPanelCollapsed?.(id) ?? false,
        }),
        [collapsePanel, expandPanel, id, isPanelCollapsed, panelSizes, resizePanel],
    );

    // The share the panel stands at is carried as how much of the room left over it takes, so the
    // triggers keep the thickness they were drawn at and the panels share only what is left. A
    // panel the group has not laid out yet stands at an even share of it
    const share = sizeOf?.(id);
    const collapsed = isPanelCollapsed?.(id) ?? false;

    return (
        <div
            ref={ref}
            data-component="Resizable.Panel"
            data-panel={id}
            data-collapsed={collapsed || undefined}
            style={{ flexGrow: share ?? 1, ...style }}
            {...rest}
        >
            <div className={classNames(classes.root, className)}>{children}</div>
        </div>
    );
}

ResizablePanel.displayName = "Resizable.Panel";

export default fixedForwardRef(ResizablePanel);
