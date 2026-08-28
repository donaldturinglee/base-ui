import * as React from "react";
import { TreeViewItemContext } from "../tree-view";
import { useJSONTreeViewContext } from "./JSONTreeViewContext";
import { toValueTokens } from "./jsonTokens";
import type { JSONTreeViewValueProps } from "./JSONTreeView.types";

const classes = {
    root: "json-tree-view-value",
};

// The value itself, written out as the pieces it is drawn from. Each piece says what it is, so a
// stylesheet colours a string differently from the number beside it and the punctuation
// differently from both, which is what lets a wall of data be read at a glance.
//
// Whether the row stands open is read from the tree rather than worked out here. It changes only
// how much of itself the row gives away: either way the row closes every bracket it opens, since
// nothing standing under it in a tree ever closes one for it
function JSONTreeViewValue(props: JSONTreeViewValueProps) {
    const { node } = props;

    const options = useJSONTreeViewContext();
    const { isExpanded } = React.useContext(TreeViewItemContext);

    const tokens = toValueTokens(node, options, isExpanded);

    return (
        <span className={classes.root} data-component="JSONTreeView.Value">
            {tokens.map((token, index) => (
                <span
                    key={index}
                    data-component="JSONTreeView.Token"
                    data-type={token.type}
                    data-kind={token.kind}
                >
                    {options.renderValue?.(token, node) ?? token.text}
                </span>
            ))}
        </span>
    );
}

JSONTreeViewValue.displayName = "JSONTreeView.Value";

export default JSONTreeViewValue;
