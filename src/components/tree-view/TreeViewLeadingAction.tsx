import { TreeViewVisualContainer } from "./TreeViewVisual";
import type { TreeViewVisualProps } from "./TreeView.types";

const classes = {
    // Stands in the row's second column, which is only given a width where there is a
    // leading action to put in it
    root: "flex [grid-column:2] [color:var(--foreground-color-muted)] [&>button]:shrink",
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
