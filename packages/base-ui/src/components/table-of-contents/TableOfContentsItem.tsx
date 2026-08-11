import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableOfContentsItemProps } from "./TableOfContents.types";

const classes = {
    item: "table-of-contents-item",
    link: "table-of-contents-link",
    active: "table-of-contents-link-active",
};

// A section of the page, and the way to it. The row it stands in is the list item; the ref and
// everything the caller passes go to the link inside it, since that is the part being written
// about and the part a router hands its own element to through `as`
function TableOfContentsItem<As extends React.ElementType = "a">(
    props: TableOfContentsItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "a",
        active = false,
        className,
        ...rest
    } = props as TableOfContentsItemProps<"a">;

    return (
        <li className={classes.item}>
            <Component
                ref={ref}
                // The section being read is where the reader is rather than somewhere else to
                // go, and that is what `aria-current` says
                aria-current={active ? "true" : undefined}
                className={classNames(classes.link, active && classes.active, className)}
                data-component="TableOfContents.Item"
                {...rest}
            />
        </li>
    );
}

TableOfContentsItem.displayName = "TableOfContents.Item";

export default fixedForwardRef(TableOfContentsItem);
