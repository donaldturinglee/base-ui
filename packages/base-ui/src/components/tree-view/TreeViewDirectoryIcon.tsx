import * as React from "react";
import { FolderOpenRegular, FolderRegular } from "@gamecrafters/base-ui-icons";
import { TreeViewItemContext } from "./TreeViewContext";

const classes = {
    root: "tree-view-directory-icon",
};

// A folder that stands open while the item it names is open, which is how a tree of files
// says what is a folder and what is not
function TreeViewDirectoryIcon() {
    const { isExpanded } = React.useContext(TreeViewItemContext);
    const Icon = isExpanded ? FolderOpenRegular : FolderRegular;

    return (
        <span className={classes.root} data-component="TreeView.DirectoryIcon">
            <Icon />
        </span>
    );
}

TreeViewDirectoryIcon.displayName = "TreeView.DirectoryIcon";

export default TreeViewDirectoryIcon;
