import * as React from "react";
import { TreeView } from "../tree-view";
import { useJSONTreeViewContext } from "./JSONTreeViewContext";
import JSONTreeViewKey from "./JSONTreeViewKey";
import JSONTreeViewValue from "./JSONTreeViewValue";
import { describeNode } from "./jsonTokens";
import type { JSONTreeViewNodeProps } from "./JSONTreeView.types";

const classes = {
    root: "json-tree-view-node",
};

// One row of the tree: what a value is called, what it is, and whatever stands under it.
//
// A row that holds nothing is drawn as a row and no more, so an empty object is a pair of brackets
// with no arrow beside them rather than something that opens onto nothing.
//
// The row says in words what its punctuation says by sight, since none of that punctuation reads
// aloud as anything: the quotes that tell a string from a number, and the brackets that tell a
// list from a set of names, would otherwise be lost on a reader who cannot see them
function JSONTreeViewNode(props: JSONTreeViewNodeProps) {
    const { node, depth } = props;

    const options = useJSONTreeViewContext();
    const { defaultExpandedDepth = 0 } = options;

    return (
        <TreeView.Item
            id={node.id}
            className={classes.root}
            aria-label={describeNode(node, options)}
            defaultExpanded={depth <= defaultExpandedDepth}
            data-node-type={node.type}
        >
            <JSONTreeViewKey node={node} />
            <JSONTreeViewValue node={node} />
            {node.children === undefined ? null : (
                <TreeView.SubTree>
                    {node.children.map((child) => (
                        <JSONTreeViewNode key={child.id} node={child} depth={depth + 1} />
                    ))}
                </TreeView.SubTree>
            )}
        </TreeView.Item>
    );
}

JSONTreeViewNode.displayName = "JSONTreeView.Node";

export default JSONTreeViewNode;
