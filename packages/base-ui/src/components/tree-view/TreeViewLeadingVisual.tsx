import * as React from "react";
import { TreeViewItemContext } from "./TreeViewContext";
import { classes, TreeViewVisualContainer } from "./TreeViewVisual";
import type { TreeViewVisualProps } from "./TreeView.types";

// An icon, or something like one, standing before the item's label
function TreeViewLeadingVisual(props: TreeViewVisualProps) {
    const { leadingVisualId } = React.useContext(TreeViewItemContext);

    return (
        <TreeViewVisualContainer
            label={props.label}
            labelId={leadingVisualId}
            className={classes.visual}
            data-component="TreeView.LeadingVisual"
        >
            {props.children}
        </TreeViewVisualContainer>
    );
}

TreeViewLeadingVisual.displayName = "TreeView.LeadingVisual";

export default TreeViewLeadingVisual;
