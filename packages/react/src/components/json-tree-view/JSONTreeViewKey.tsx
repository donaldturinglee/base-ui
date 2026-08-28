import * as React from "react";
import { useJSONTreeViewContext } from "./JSONTreeViewContext";
import type { JSONTreeViewKeyProps } from "./JSONTreeView.types";

const classes = {
    root: "json-tree-view-key",
    colon: "json-tree-view-colon",
};

// What a value is called, and the colon setting it off from the value itself. The colon is drawn
// rather than read out: a reader who cannot see the row is told what it is called by the row's own
// name, and a colon read aloud between every pair says nothing they need
function JSONTreeViewKey(props: JSONTreeViewKeyProps) {
    const { node } = props;
    const { quotesOnKeys } = useJSONTreeViewContext();

    if (node.key === undefined) {
        return null;
    }

    return (
        <>
            <span
                className={classes.root}
                data-component="JSONTreeView.Key"
                data-non-enumerable={node.nonEnumerable ? "true" : undefined}
            >
                {quotesOnKeys ? `"${node.key}"` : node.key}
            </span>
            <span aria-hidden="true" className={classes.colon} data-component="JSONTreeView.Colon">
                :
            </span>
        </>
    );
}

JSONTreeViewKey.displayName = "JSONTreeView.Key";

export default JSONTreeViewKey;
