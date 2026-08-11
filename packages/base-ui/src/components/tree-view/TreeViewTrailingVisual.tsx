import * as React from "react";
import { TreeViewItemContext } from "./TreeViewContext";
import { classes, TreeViewVisualContainer } from "./TreeViewVisual";
import type { TreeViewVisualProps } from "./TreeView.types";

// An icon, a count, or something like one, standing after the item's label
function TreeViewTrailingVisual(props: TreeViewVisualProps) {
    const { trailingVisualId } = React.useContext(TreeViewItemContext);

    return (
        <TreeViewVisualContainer
            label={props.label}
            labelId={trailingVisualId}
            className={classes.visual}
            data-component="TreeView.TrailingVisual"
        >
            {props.children}
        </TreeViewVisualContainer>
    );
}

TreeViewTrailingVisual.displayName = "TreeView.TrailingVisual";

export default TreeViewTrailingVisual;
