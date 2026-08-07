import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableOfContentsTitleProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-title",
};

// Names the list, as a line of words rather than as a heading: the sections below it are the
// page's headings already, and a heading over them would stand among those and be read as one
// more of them. Where the list is wanted in the outline of the page all the same, `as` puts it
// there and `aria-labelledby` on the list points at it
function TableOfContentsTitle<As extends React.ElementType = "p">(
    props: TableOfContentsTitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "p", className, ...rest } = props as TableOfContentsTitleProps<"p">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="TableOfContents.Title"
            {...rest}
        />
    );
}

TableOfContentsTitle.displayName = "TableOfContents.Title";

export default fixedForwardRef(TableOfContentsTitle);
