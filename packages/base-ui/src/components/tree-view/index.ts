import TreeViewBase from "./TreeView";
import TreeViewDirectoryIcon from "./TreeViewDirectoryIcon";
import TreeViewErrorDialog from "./TreeViewErrorDialog";
import TreeViewItem from "./TreeViewItem";
import TreeViewLeadingAction from "./TreeViewLeadingAction";
import TreeViewLeadingVisual from "./TreeViewLeadingVisual";
import TreeViewSubTree from "./TreeViewSubTree";
import TreeViewTrailingVisual from "./TreeViewTrailingVisual";

export const TreeView = Object.assign(TreeViewBase, {
    Item: TreeViewItem,
    SubTree: TreeViewSubTree,
    LeadingAction: TreeViewLeadingAction,
    LeadingVisual: TreeViewLeadingVisual,
    TrailingVisual: TreeViewTrailingVisual,
    DirectoryIcon: TreeViewDirectoryIcon,
    ErrorDialog: TreeViewErrorDialog,
});

export {
    TreeViewItem,
    TreeViewSubTree,
    TreeViewLeadingAction,
    TreeViewLeadingVisual,
    TreeViewTrailingVisual,
    TreeViewDirectoryIcon,
    TreeViewErrorDialog,
};
export { TreeViewRootContext, TreeViewItemContext } from "./TreeViewContext";
export * from "./TreeView.types";
