import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getSamePageHash, isPlainClick, pushHash } from "./headingScroll";
import { useTableOfContentsContext, useTableOfContentsItemContext } from "./TableOfContentsContext";
import type { TableOfContentsLinkProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-link",
};

// The way to a heading. It is a link and goes on being one: it carries an href, it can be opened
// in a tab of its own, and it is followed by the browser wherever there is nothing better to do.
//
// Where the document is scrolled inside a panel there is something better to do, since the
// browser's own jump would carry the whole window along with it and drag the page about. The jump
// is made by hand instead and the heading written into the address bar afterwards, so that the
// page still ends up where following the link would have left it
function TableOfContentsLink<As extends React.ElementType = "a">(
    props: TableOfContentsLinkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "a",
        className,
        onClick,
        ...rest
    } = props as TableOfContentsLinkProps<"a">;

    const { ids, scrollElement, scrollTo, getItemState } = useTableOfContentsContext();
    const item = useTableOfContentsItemContext();

    const state = item && getItemState?.(item);

    const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event);

        // A press the caller has already answered is left answered
        if (event.defaultPrevented || !scrollElement || !isPlainClick(event)) {
            return;
        }

        const value = getSamePageHash(event.currentTarget);

        if (!value || !scrollTo?.(value)) {
            return;
        }

        event.preventDefault();
        pushHash(value);
    };

    return (
        <Component
            ref={ref}
            id={item ? ids?.link(item.value) : undefined}
            className={classNames(classes.root, className)}
            // The heading the reader is under is where they are on the page rather than the page
            // they are on, which is what tells a location apart from a page in a set of them
            aria-current={state?.active ? "location" : undefined}
            data-component="TableOfContents.Link"
            data-value={item?.value}
            data-active={state?.active ? "" : undefined}
            onClick={handleClick}
            {...rest}
        />
    );
}

TableOfContentsLink.displayName = "TableOfContents.Link";

export default fixedForwardRef(TableOfContentsLink);
