import * as React from "react";
import { ConfirmationDialog } from "../confirmation-dialog";
import { TreeViewItemContext } from "./TreeViewContext";
import type { TreeViewErrorDialogProps } from "./TreeView.types";

// The keys the tree moves by, which are held back while the dialog stands over it so that
// reading the message does not walk the tree underneath
const TREE_KEYS = ["Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"];

// Says that a sub-tree could not be fetched, and offers to try again. Dismissing it closes
// the item, since there is nothing under it to show
function TreeViewErrorDialog(props: TreeViewErrorDialogProps) {
    const { title = "Error", children, onRetry, onDismiss } = props;
    const { itemId, setIsExpanded } = React.useContext(TreeViewItemContext);

    return (
        <div
            onKeyDown={(event) => {
                if (TREE_KEYS.includes(event.key)) {
                    event.stopPropagation();
                }
            }}
            data-component="TreeView.ErrorDialog"
        >
            <ConfirmationDialog
                title={title}
                confirmButtonContent="Retry"
                cancelButtonContent="Dismiss"
                onClose={(gesture) => {
                    // Focus goes back to the row the sub-tree belongs to, which is where
                    // the reader was before the dialog opened
                    window.setTimeout(() => document.getElementById(itemId)?.focus());

                    if (gesture === "confirm") {
                        onRetry?.();
                        return;
                    }

                    setIsExpanded(false);
                    onDismiss?.();
                }}
            >
                {children}
            </ConfirmationDialog>
        </div>
    );
}

TreeViewErrorDialog.displayName = "TreeView.ErrorDialog";

export default TreeViewErrorDialog;
