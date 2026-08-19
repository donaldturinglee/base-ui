import * as React from "react";
import { isValidElementType } from "react-is";
import { ActionList } from "../action-list";
import { Dialog } from "../dialog";
import { TreeViewItemContext } from "./TreeViewContext";
import type { TreeViewActionDialogProps, TreeViewSecondaryAction } from "./TreeView.types";

const classes = {
    hidden: "sr-only",
};

// The keys the tree moves by, which are held back while the dialog stands over it so that
// reading the list of actions does not walk the tree underneath
const TREE_KEYS = ["Backspace", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Enter"];

// An icon is given either as the component to draw or as one already built
const renderIcon = (icon: TreeViewSecondaryAction["icon"]) => {
    if (!isValidElementType(icon)) {
        return icon as React.ReactNode;
    }

    const Icon = icon;

    return <Icon />;
};

// Collects everything an item can do into a list to pick from, for a reader who cannot
// reach the buttons on the row itself
function TreeViewActionDialog(props: TreeViewActionDialogProps) {
    const { items, onClose } = props;
    const { itemId } = React.useContext(TreeViewItemContext);

    return (
        <div
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
                if (TREE_KEYS.includes(event.key)) {
                    event.stopPropagation();
                }
            }}
            data-component="TreeView.ActionDialog"
        >
            <Dialog
                title="Supplemental actions"
                onClose={() => {
                    onClose?.();

                    // Focus goes back to the row the actions belong to, which is where the
                    // reader was before the dialog opened
                    window.setTimeout(() => document.getElementById(itemId)?.focus());
                }}
            >
                <ActionList>
                    {items.map(({ label, onClick, icon, count }, index) => (
                        <ActionList.Item key={index} onSelect={onClick}>
                            <ActionList.LeadingVisual>{renderIcon(icon)}</ActionList.LeadingVisual>
                            {label}
                            {count ? (
                                <ActionList.TrailingVisual>
                                    {count}
                                    <span className={classes.hidden}> items</span>
                                </ActionList.TrailingVisual>
                            ) : null}
                        </ActionList.Item>
                    ))}
                </ActionList>
            </Dialog>
        </div>
    );
}

TreeViewActionDialog.displayName = "TreeView.ActionDialog";

export default TreeViewActionDialog;
