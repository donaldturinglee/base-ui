import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TableOfContentsContext } from "./TableOfContentsContext";
import { useTableOfContents } from "./useTableOfContents";
import type {
    TableOfContentsElementProps,
    TableOfContentsIds,
    TableOfContentsProps,
} from "./TableOfContents.types";

const classes = {
    root: "table-of-contents",
};

// The document laid out beside the shape of it: the headings it is made of, which of them the
// reader is under, and a line to each one.
//
//     <TableOfContents items={items}>
//         <TableOfContents.Content>{article}</TableOfContents.Content>
//         <TableOfContents.Nav>
//             <TableOfContents.Title>On this page</TableOfContents.Title>
//             <TableOfContents.List>
//                 <TableOfContents.Indicator />
//                 {items.map((item) => (
//                     <TableOfContents.Item key={item.value} item={item}>
//                         <TableOfContents.Link href={`#${item.value}`}>
//                             {item.label}
//                         </TableOfContents.Link>
//                     </TableOfContents.Item>
//                 ))}
//             </TableOfContents.List>
//         </TableOfContents.Nav>
//     </TableOfContents>
//
// The headings are named here rather than on the list, since which headings the document is made
// of belongs to the document rather than to any one line drawn from it, and the lines would
// otherwise each be watching the page and disagreeing with one another about where the reader is.
//
// What the document is scrolled in is taken from the content where there is one, so a page whose
// window does the scrolling and a page scrolled inside a panel are written the same way
function TableOfContents<As extends React.ElementType = "div">(
    props: TableOfContentsProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        id: idProp,
        items,
        activeIds,
        defaultActiveIds,
        rootMargin,
        threshold,
        scrollElement,
        scrollBehavior = "smooth",
        autoScroll = true,
        onActiveChange,
        children,
        ...rest
    } = props as unknown as TableOfContentsElementProps;

    const id = useId(idProp);

    const ids = React.useMemo<TableOfContentsIds>(
        () => ({
            root: id,
            title: `${id}-title`,
            list: `${id}-list`,
            indicator: `${id}-indicator`,
            item: (value: string) => `${id}-item-${value}`,
            link: (value: string) => `${id}-link-${value}`,
        }),
        [id],
    );

    // The content hands back what it came out as, and it is held as state rather than in a ref
    // so that the document is watched again once there is something to watch it in
    const [contentElement, setContentElement] = React.useState<HTMLElement | null>(null);

    // A caller who says where the document is scrolled is taken at their word, even where that
    // is nowhere: a page whose window does the scrolling is told so by being handed null
    const resolvedScrollElement = scrollElement === undefined ? contentElement : scrollElement;

    // The nav is named by the title, and there is not always one to name it by
    const [hasTitle, setHasTitle] = React.useState(false);

    const tableOfContents = useTableOfContents({
        items,
        activeIds,
        defaultActiveIds,
        onActiveChange,
        rootMargin,
        threshold,
        scrollElement: resolvedScrollElement,
        scrollBehavior,
    });

    // The line the reader is under is kept in view, for a list long enough to be scrolled in its
    // own right. Only the first of them is followed: a run of headings that are all on screen at
    // once begins where the reader is, and the rest follow it up the list of their own accord
    const firstActiveId = tableOfContents.activeIds[0];

    React.useEffect(() => {
        if (!autoScroll || firstActiveId === undefined) {
            return;
        }

        const line = document.getElementById(ids.item(firstActiveId));

        line?.scrollIntoView?.({ behavior: scrollBehavior, block: "nearest" });
    }, [autoScroll, firstActiveId, ids, scrollBehavior]);

    const context = {
        ...tableOfContents,
        ids,
        scrollElement: resolvedScrollElement,
        setScrollElement: setContentElement,
        hasTitle,
        setHasTitle,
    };

    return (
        <TableOfContentsContext.Provider value={context}>
            <Component
                ref={ref}
                id={ids.root}
                className={classNames(classes.root, className)}
                data-component="TableOfContents"
                {...rest}
            >
                {children}
            </Component>
        </TableOfContentsContext.Provider>
    );
}

TableOfContents.displayName = "TableOfContents";

export default fixedForwardRef(TableOfContents);
