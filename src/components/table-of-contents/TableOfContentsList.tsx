import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableOfContentsListProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-list",
};

// Holds the sections, and draws the rail they are all set against. The rail belongs to the list
// rather than to the items, so it runs the whole height of it however many sections stand there
function TableOfContentsList(
    props: TableOfContentsListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <ul
            ref={ref}
            // Safari takes the list semantics away from a list with no markers, so the role
            // is stated rather than left to the element
            role="list"
            className={classNames(classes.root, className)}
            data-component="TableOfContents.List"
            {...rest}
        />
    );
}

TableOfContentsList.displayName = "TableOfContents.List";

export default fixedForwardRef(TableOfContentsList);
