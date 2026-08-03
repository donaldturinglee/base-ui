import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ScrollableRegion } from "../scrollable-region";
import type { TableCellPadding, TableProps } from "./DataTable.types";

const classes = {
    wrapper: "[grid-area:table]",
    // The bottom corners are only the table's own where nothing follows it. With a footer
    // below, that is what rounds them off
    bottomCorners:
        "last:[&_tbody_tr:last-of-type>*:first-child]:rounded-es-[var(--table-border-radius)] last:[&_tbody_tr:last-of-type>*:last-child]:rounded-ee-[var(--table-border-radius)]",
};

const tableVariants = cva(
    [
        // The columns are laid out on the table's own grid, which the head, the body and each
        // row take part in as a subgrid
        "grid w-full border-separate border-spacing-0 bg-background-default [grid-area:table] [grid-template-columns:var(--table-grid-template-columns)] [font-size:var(--text-body-size-small)] [line-height:calc(20/12)] [--table-border-radius:var(--border-radius-medium)]",
        // The borders belong to the table rather than to the cells, since which edge a cell
        // draws depends on where it stands in the row. They key on that position rather than on
        // what the cell calls itself, because a sortable header reports itself as
        // Table.SortHeader and would otherwise be missed
        "[&_tr>*:first-child]:border-s-[length:var(--border-width-thin)] [&_tr>*:first-child]:border-s-border-default [&_tr>*:last-child]:border-e-[length:var(--border-width-thin)] [&_tr>*:last-child]:border-e-border-default",
        // The top corners are rounded on the outermost cells of the head, so the border reads as
        // one box
        "[&_thead_tr:first-of-type>*:first-child]:rounded-ss-[var(--table-border-radius)] [&_thead_tr:first-of-type>*:last-child]:rounded-se-[var(--table-border-radius)]",
        // The type lines up with the title above the table whatever padding the cells are given
        "[&_tr>*:first-child:not([data-cell-skeleton])]:ps-[var(--base-size-16)] [&_tr>*:first-child_[data-cell-skeleton-item]]:ps-[var(--base-size-16)] [&_tr>*:last-child:not([data-cell-skeleton])]:pe-[var(--base-size-16)] [&_tr>*:last-child_[data-cell-skeleton-item]]:pe-[var(--base-size-16)]",
        "[&_tbody_tr:hover>*:not([data-cell-skeleton])]:bg-[var(--control-transparent-background-color-hover)]",
    ],
    {
        variants: {
            cellPadding: {
                condensed:
                    "[--table-cell-padding-block:var(--base-size-4)] [--table-cell-padding-inline:var(--base-size-8)]",
                normal: "[--table-cell-padding-block:var(--base-size-8)] [--table-cell-padding-inline:var(--base-size-12)]",
                spacious:
                    "[--table-cell-padding-block:var(--base-size-12)] [--table-cell-padding-inline:var(--base-size-16)]",
            } satisfies Record<TableCellPadding, string>,
        },
    },
);

function Table(
    props: TableProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        cellPadding = "normal",
        gridTemplateColumns,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    // A table wide enough to scroll becomes a landmark, which has to carry a name. It takes
    // the table's own where there is one, and otherwise says what it is
    const regionLabel = ariaLabelledBy
        ? ({ "aria-labelledby": ariaLabelledBy } as const)
        : ({ "aria-label": "Table" } as const);

    return (
        <ScrollableRegion
            {...regionLabel}
            className={classNames(classes.wrapper, classes.bottomCorners)}
        >
            <table
                ref={ref}
                // A table laid out on a grid loses its own semantics in some browsers, so
                // every part of it says what it is
                role="table"
                aria-labelledby={ariaLabelledBy}
                className={classNames(tableVariants({ cellPadding }), className)}
                style={
                    {
                        ...style,
                        "--table-grid-template-columns": gridTemplateColumns,
                    } as React.CSSProperties
                }
                data-component="Table"
                data-cell-padding={cellPadding}
                {...rest}
            />
        </ScrollableRegion>
    );
}

Table.displayName = "Table";

export default fixedForwardRef(Table);
