import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import Table from "./Table";
import TableBody from "./TableBody";
import TableCell from "./TableCell";
import TableHead from "./TableHead";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import TableSortHeader from "./TableSortHeader";
import { useTable } from "./useTable";
import type { Column, DataTableProps, SortDirection, UniqueRow } from "./DataTable.types";

const renderHeader = <Data extends UniqueRow>(column: Column<Data>) =>
    typeof column.header === "string" ? column.header : column.header();

const defaultGetRowId = <Data extends UniqueRow>(row: Data) => row.id;

// Builds a table from the data and the columns describing it, in place of laying the rows
// and cells out by hand
function DataTable<Data extends UniqueRow>(
    props: DataTableProps<Data>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        data,
        columns,
        cellPadding,
        initialSortColumn,
        initialSortDirection,
        externalSorting,
        getRowId = defaultGetRowId,
        onToggleSort,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
    } = props;

    const { headers, rows, actions, gridTemplateColumns } = useTable({
        data,
        columns,
        initialSortColumn,
        initialSortDirection,
        externalSorting,
        getRowId,
    });

    return (
        <Table
            ref={ref}
            aria-labelledby={ariaLabelledBy}
            aria-describedby={ariaDescribedBy}
            cellPadding={cellPadding}
            gridTemplateColumns={gridTemplateColumns}
        >
            <TableHead>
                <TableRow>
                    {headers.map((header) =>
                        header.isSortable() ? (
                            <TableSortHeader
                                key={header.id}
                                align={header.column.align}
                                direction={header.getSortDirection()}
                                onToggleSort={() => {
                                    // A column that is already sorted turns around; any
                                    // other column starts where it always starts
                                    const direction: Exclude<SortDirection, "NONE"> =
                                        header.getSortDirection() === "ASC" ? "DESC" : "ASC";

                                    actions.sortBy(header);
                                    onToggleSort?.(header.id, direction);
                                }}
                            >
                                {renderHeader(header.column)}
                            </TableSortHeader>
                        ) : (
                            <TableHeader key={header.id} align={header.column.align}>
                                {renderHeader(header.column)}
                            </TableHeader>
                        ),
                    )}
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getCells().map((cell) => (
                            <TableCell
                                key={cell.id}
                                scope={cell.rowHeader ? "row" : undefined}
                                align={cell.column.align}
                            >
                                {cell.column.renderCell
                                    ? cell.column.renderCell(row.getValue())
                                    : (cell.getValue() as React.ReactNode)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

DataTable.displayName = "DataTable";

export default fixedForwardRef(DataTable);
