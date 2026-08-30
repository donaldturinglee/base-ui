import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useTableOfContentsContext } from "./TableOfContentsContext";
import type { TableOfContentsNavProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-nav",
};

// The shape of the document, standing beside it. A landmark rather than a plain box, since a
// reader working through the page by its regions is looking for the ways out of the section they
// are in, and this is the whole of them.
//
// It is named by the title where there is one, and left to be named by the caller where there is
// not, so a nav is never left pointing at a heading that was never drawn
function TableOfContentsNav<As extends React.ElementType = "nav">(
    props: TableOfContentsNavProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "nav",
        className,
        placement,
        ...rest
    } = props as TableOfContentsNavProps<"nav">;

    const { ids, hasTitle } = useTableOfContentsContext();

    return (
        <Component
            ref={ref}
            aria-labelledby={hasTitle ? ids?.title : undefined}
            className={classNames(classes.root, className)}
            data-component="TableOfContents.Nav"
            data-placement={placement}
            {...rest}
        />
    );
}

TableOfContentsNav.displayName = "TableOfContents.Nav";

export default fixedForwardRef(TableOfContentsNav);
