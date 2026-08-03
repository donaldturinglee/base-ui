import * as React from "react";
import { TreeViewItemContext } from "./TreeViewContext";
import type { TreeViewVisualChildren } from "./TreeView.types";

export const classes = {
    // As tall as one line of the label, so a visual sits on the label's first line however
    // many lines the item runs to
    visual: "flex items-center h-[var(--tree-view-item-line-height)] text-foreground-muted",
    hidden: "sr-only",
};

// A visual either draws the same thing throughout, or is handed whether the item is open so
// that it can draw something else while it is
export const renderVisualChildren = (children: TreeViewVisualChildren, isExpanded: boolean) =>
    typeof children === "function" ? children({ isExpanded }) : children;

export type TreeViewVisualContainerProps = {
    children?: TreeViewVisualChildren;
    // What the visual stands for, read in place of the visual itself
    label?: string;
    labelId?: string;
    className: string;
    "data-component": string;
};

// The box a visual or an action is drawn in. Whatever it holds is hidden from a screen
// reader, which is read the label instead, since an icon says nothing on its own
export const TreeViewVisualContainer = (props: TreeViewVisualContainerProps) => {
    const { children, label, labelId, className, "data-component": dataComponent } = props;
    const { isExpanded } = React.useContext(TreeViewItemContext);

    return (
        <>
            <span id={labelId} className={classes.hidden} aria-hidden="true">
                {label}
            </span>
            <span className={className} aria-hidden="true" data-component={dataComponent}>
                {renderVisualChildren(children, isExpanded)}
            </span>
        </>
    );
};
