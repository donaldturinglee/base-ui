import { TreeViewVisualContainer } from "./TreeViewVisual";
import type { TreeViewVisualProps } from "./TreeView.types";

const classes = {
    root: "tree-view-leading-action",
};

// Something to do standing at the front of the row, before the chevron that opens it
function TreeViewLeadingAction(props: TreeViewVisualProps) {
    return (
        <TreeViewVisualContainer
            label={props.label}
            className={classes.root}
            data-component="TreeView.LeadingAction"
        >
            {props.children}
        </TreeViewVisualContainer>
    );
}

TreeViewLeadingAction.displayName = "TreeView.LeadingAction";

export default TreeViewLeadingAction;
