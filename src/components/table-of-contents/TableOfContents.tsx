import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableOfContentsProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents",
};

// What the list is called where the caller has named it neither one way nor the other. A page
// can hold more than one landmark, so the one leading through the page itself says which it is
const DEFAULT_LABEL = "Table of contents";

// The way through the page the reader is already on: the sections it is made of, in the order
// they stand, with the one being read marked against the rail beside them.
//
// Nothing here follows the scroll. Which section is being read is the caller's to say, since a
// list of sections and the page they belong to are rarely the same piece of markup — pair it
// with `useTableOfContentsActiveId` where the page is scrolled rather than paged through
function TableOfContents(
    props: TableOfContentsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    // A list the caller has named keeps that name, whichever way they named it. Only one left
    // unnamed falls back, so the landmark is never the unnamed one among several
    const named = Boolean(ariaLabel) || Boolean(ariaLabelledBy);

    return (
        <nav
            ref={ref}
            aria-label={named ? ariaLabel : DEFAULT_LABEL}
            aria-labelledby={ariaLabelledBy}
            className={classNames(classes.root, className)}
            data-component="TableOfContents"
            {...rest}
        />
    );
}

TableOfContents.displayName = "TableOfContents";

export { DEFAULT_LABEL };
export default fixedForwardRef(TableOfContents);
