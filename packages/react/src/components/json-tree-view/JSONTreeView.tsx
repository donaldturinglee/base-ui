import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TreeView } from "../tree-view";
import { JSONTreeViewContext } from "./JSONTreeViewContext";
import JSONTreeViewNode from "./JSONTreeViewNode";
import { toJSONNodes } from "./jsonNodes";
import type { JSONTreeViewContextValue, JSONTreeViewProps } from "./JSONTreeView.types";

const classes = {
    root: "json-tree-view",
};

// What the tree is called where the caller has not said. A tree with no name of its own is one a
// reader arrives at with no idea what they have arrived at
const DEFAULT_LABEL = "JSON data";

// A value drawn as the tree it already is: objects and lists that open onto what they hold, and
// everything else drawn as what it is.
//
//     <JSONTreeView data={response} defaultExpandedDepth={1} />
//
// The data is read into rows here rather than in the rows themselves, since what a closed row gives
// away of what it holds is read off the rows underneath it and it has no way of knowing them
// otherwise. Only the open rows are drawn, so a value that has been read through is still only as
// large on the page as it has been opened.
//
// Everything about how a row is written belongs to the tree rather than to any one row — how much
// of a closed row is given away, whether names are quoted, whether a caller draws the values
// themselves — so the rows read them from the tree instead of being handed them down the whole
// depth of it.
//
// The tree itself is the TreeView component: moving through it, opening and closing it, and what a
// screen reader makes of it are all a tree's business rather than a JSON viewer's, and there is
// nothing about JSON that makes them any different here
function JSONTreeView(
    props: JSONTreeViewProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        data,
        defaultExpandedDepth = 1,
        maxPreviewItems,
        collapseStringsAfterLength,
        quotesOnKeys,
        groupArraysAfterLength,
        showNonEnumerable,
        renderValue,
        "aria-label": ariaLabel = DEFAULT_LABEL,
        ...rest
    } = props;

    const nodes = React.useMemo(
        () => toJSONNodes(data, { groupArraysAfterLength, showNonEnumerable }),
        [data, groupArraysAfterLength, showNonEnumerable],
    );

    // Only the two that change what the rows are read into are worked out again above; the rest
    // change how a row is written rather than what it holds, and are read where it is written
    const context = React.useMemo<JSONTreeViewContextValue>(
        () => ({
            defaultExpandedDepth,
            maxPreviewItems,
            collapseStringsAfterLength,
            quotesOnKeys,
            groupArraysAfterLength,
            showNonEnumerable,
            renderValue,
        }),
        [
            defaultExpandedDepth,
            maxPreviewItems,
            collapseStringsAfterLength,
            quotesOnKeys,
            groupArraysAfterLength,
            showNonEnumerable,
            renderValue,
        ],
    );

    return (
        <JSONTreeViewContext.Provider value={context}>
            <TreeView
                ref={ref}
                aria-label={ariaLabel}
                className={classNames(classes.root, className)}
                data-component="JSONTreeView"
                {...rest}
            >
                {nodes.map((node) => (
                    <JSONTreeViewNode key={node.id} node={node} depth={1} />
                ))}
            </TreeView>
        </JSONTreeViewContext.Provider>
    );
}

JSONTreeView.displayName = "JSONTreeView";

export default fixedForwardRef(JSONTreeView);
