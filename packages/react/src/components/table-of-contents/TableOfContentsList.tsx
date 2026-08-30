import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useTableOfContentsContext } from "./TableOfContentsContext";
import type { TableOfContentsListProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-list",
};

// The lines themselves, read down. A list rather than a run of links, so that a reader is told
// how many headings the page has before they start down it, and the indicator is measured against
// this rather than against the nav, so scrolling the list carries it along with the lines
function TableOfContentsList<As extends React.ElementType = "ul">(
    props: TableOfContentsListProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "ul", className, ...rest } = props as TableOfContentsListProps<"ul">;

    const { ids } = useTableOfContentsContext();

    return (
        <Component
            ref={ref}
            id={ids?.list}
            className={classNames(classes.root, className)}
            data-component="TableOfContents.List"
            {...rest}
        />
    );
}

TableOfContentsList.displayName = "TableOfContents.List";

export default fixedForwardRef(TableOfContentsList);
