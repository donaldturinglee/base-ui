import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SkeletonText } from "../skeleton-text";
import Table from "./Table";
import TableBody from "./TableBody";
import TableCell from "./TableCell";
import TableHead from "./TableHead";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import { getGridTemplate } from "./tableLayout";
import type { TableSkeletonProps, UniqueRow } from "./DataTable.types";

const classes = {
    // The whole column is one cell, so the placeholder rows can be drawn down it without
    // the table having to know how many rows the data will bring
    cell: "p-0",
    items: "flex flex-col w-full",
    item: "p-[var(--table-cell-padding-block)_var(--table-cell-padding-inline)] not-last:border-b-[length:var(--border-width-thin)] not-last:border-b-border-default [&_[data-component='SkeletonText']]:w-[var(--table-skeleton-item-width)]",
    // The lines run to different widths, so a column of them reads as text rather than as a
    // block of bars
    itemWidths:
        "[&>*:nth-of-type(5n+1)]:[--table-skeleton-item-width:85%] [&>*:nth-of-type(5n+2)]:[--table-skeleton-item-width:67.5%] [&>*:nth-of-type(5n+3)]:[--table-skeleton-item-width:80%] [&>*:nth-of-type(5n+4)]:[--table-skeleton-item-width:60%] [&>*:nth-of-type(5n+5)]:[--table-skeleton-item-width:75%]",
    hidden: "sr-only",
};

export const DEFAULT_TABLE_SKELETON_ROWS = 10;

function TableSkeleton<Data extends UniqueRow>(
    props: TableSkeletonProps<Data>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { columns, cellPadding, rows = DEFAULT_TABLE_SKELETON_ROWS, ...rest } = props;

    return (
        <Table
            ref={ref}
            cellPadding={cellPadding}
            gridTemplateColumns={getGridTemplate(columns)}
            data-component="Table.Skeleton"
            {...rest}
        >
            <TableHead>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableHeader key={column.id ?? column.field ?? index}>
                            {typeof column.header === "string" ? column.header : column.header()}
                        </TableHeader>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableCell
                            key={column.id ?? column.field ?? index}
                            className={classes.cell}
                            data-cell-skeleton=""
                        >
                            <span className={classes.hidden}>Loading</span>
                            <div className={classNames(classes.items, classes.itemWidths)}>
                                {Array.from({ length: rows }, (_, row) => (
                                    <div
                                        key={row}
                                        className={classes.item}
                                        data-cell-skeleton-item=""
                                    >
                                        <SkeletonText />
                                    </div>
                                ))}
                            </div>
                        </TableCell>
                    ))}
                </TableRow>
            </TableBody>
        </Table>
    );
}

TableSkeleton.displayName = "Table.Skeleton";

export default fixedForwardRef(TableSkeleton);
