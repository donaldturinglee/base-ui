import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TableOfContentsItemContext, useTableOfContentsContext } from "./TableOfContentsContext";
import type { TableOfContentsItemProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-item",
};

// One line of the contents, standing for one heading of the document. How deep the heading sits
// is written onto the line as well as being stepped in by it, so a page that would rather draw
// the levels some other way has the level to draw from.
//
// Whether the reader is under this heading is said here rather than only on the link, so that a
// line carrying more than a link — a number, a rule, a progress ring — is drawn as reached
// without every one of those having to be told separately
function TableOfContentsItem<As extends React.ElementType = "li">(
    props: TableOfContentsItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "li",
        className,
        item,
        style,
        ...rest
        // `item` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as TableOfContentsItemProps<"li">;

    const { ids, getItemState } = useTableOfContentsContext();

    const state = getItemState?.(item);

    return (
        <TableOfContentsItemContext.Provider value={item}>
            <Component
                ref={ref}
                id={ids?.item(item.value)}
                className={classNames(classes.root, className)}
                style={
                    {
                        ...style,
                        "--table-of-contents-item-depth": item.depth,
                    } as React.CSSProperties
                }
                data-component="TableOfContents.Item"
                data-value={item.value}
                data-depth={item.depth}
                data-active={state?.active ? "" : undefined}
                data-first={state?.first ? "" : undefined}
                data-last={state?.last ? "" : undefined}
                {...rest}
            />
        </TableOfContentsItemContext.Provider>
    );
}

TableOfContentsItem.displayName = "TableOfContents.Item";

export default fixedForwardRef(TableOfContentsItem);
