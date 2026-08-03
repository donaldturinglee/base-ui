import * as React from "react";
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
    cell: "data-table-skeleton-cell",
    items: "data-table-skeleton-items",
    item: "data-table-skeleton-item",
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
                            <div className={classes.items}>
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
