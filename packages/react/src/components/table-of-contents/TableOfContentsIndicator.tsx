import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { isEmptyRect, isSameRect } from "./headingScroll";
import { useTableOfContentsContext } from "./TableOfContentsContext";
import type { TableOfContentsIndicatorProps, TableOfContentsRect } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-indicator",
};

const toPixels = (value: number | undefined) => (value === undefined ? undefined : `${value}px`);

// What is drawn against the part of the list the reader is in. It is measured against the lines
// rather than told where to stand, so a run of headings that are all on screen at once is covered
// by one bar running the length of them rather than by a bar apiece.
//
// The lines are read off the page rather than out of the list of headings, since a line is only
// as tall as whatever it was drawn holding, and a caller who wraps a heading onto two lines has
// changed how far the bar reaches without changing anything the contents were told. They are
// watched for the same reason: a list laid out again under a narrower window moves the lines
// without the reader having moved at all
function TableOfContentsIndicator<As extends React.ElementType = "div">(
    props: TableOfContentsIndicatorProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        style,
        ...rest
    } = props as TableOfContentsIndicatorProps<"div">;

    const { ids, activeIds } = useTableOfContentsContext();

    const [rect, setRect] = React.useState<TableOfContentsRect | null>(null);

    // The run of headings on screen, read as what it says: the bar is measured again when the
    // reader moves from one heading to another, not on every render of the list
    const activeKey = activeIds?.join() ?? "";

    useIsomorphicLayoutEffect(() => {
        const active = activeIds ?? [];

        if (!ids || active.length === 0) {
            setRect(null);
            return;
        }

        // The lines are looked for on the page rather than kept in a register, since they are all
        // in place by the time anything is laid out and the bar is drawn before them in the list
        const list = document.getElementById(ids.list);
        const first = document.getElementById(ids.item(active[0]));
        const last = document.getElementById(ids.item(active[active.length - 1]));

        if (!first) {
            setRect(null);
            return;
        }

        const measure = () => {
            const firstRect = first.getBoundingClientRect();
            const listRect = list?.getBoundingClientRect();

            // Where the line stands within the list rather than within the window, so that a
            // list scrolled in its own right carries the bar along with the lines
            const x = list && listRect ? firstRect.left - listRect.left + list.scrollLeft : 0;
            const y = list && listRect ? firstRect.top - listRect.top + list.scrollTop : 0;

            // A run of headings is covered from the top of the first to the foot of the last
            const height =
                last && last !== first
                    ? last.getBoundingClientRect().bottom - firstRect.top
                    : firstRect.height;

            const next = { x, y, width: firstRect.width, height };

            setRect((current) => (isSameRect(current, next) ? current : next));
        };

        measure();

        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const observer = new ResizeObserver(measure);

        observer.observe(first);

        if (last && last !== first) {
            observer.observe(last);
        }

        if (list) {
            observer.observe(list);
        }

        return () => {
            observer.disconnect();
        };
    }, [activeKey, ids]);

    return (
        <Component
            ref={ref}
            id={ids?.indicator}
            aria-hidden="true"
            // A bar drawn where nothing has been laid out yet would sit in the corner at no size,
            // and nothing at all is nearer to what it is about to look like
            hidden={isEmptyRect(rect)}
            className={classNames(classes.root, className)}
            style={
                {
                    ...style,
                    "--table-of-contents-indicator-x": toPixels(rect?.x),
                    "--table-of-contents-indicator-y": toPixels(rect?.y),
                    "--table-of-contents-indicator-width": toPixels(rect?.width),
                    "--table-of-contents-indicator-height": toPixels(rect?.height),
                } as React.CSSProperties
            }
            data-component="TableOfContents.Indicator"
            {...rest}
        />
    );
}

TableOfContentsIndicator.displayName = "TableOfContents.Indicator";

export default fixedForwardRef(TableOfContentsIndicator);
