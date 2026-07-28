import * as React from "react";
import { DEFAULT_SORT_DIRECTION, sortStrategies, transitionSortDirection } from "./sorting";
import { getGridTemplate } from "./tableLayout";
import type { Column, ObjectPathValue, SortDirection, UniqueRow } from "./DataTable.types";

export type TableHeaderModel<Data extends UniqueRow> = {
    id: string;
    column: Column<Data>;
    isSortable: () => boolean;
    getSortDirection: () => SortDirection;
};

export type TableCellModel<Data extends UniqueRow> = {
    id: string;
    column: Column<Data>;
    rowHeader: boolean;
    getValue: () => Data[keyof Data];
};

export type TableRowModel<Data extends UniqueRow> = {
    id: string;
    getValue: () => Data;
    getCells: () => TableCellModel<Data>[];
};

export type TableModel<Data extends UniqueRow> = {
    headers: TableHeaderModel<Data>[];
    rows: TableRowModel<Data>[];
    actions: {
        sortBy: (header: TableHeaderModel<Data>) => void;
    };
    gridTemplateColumns: string;
};

export type UseTableOptions<Data extends UniqueRow> = {
    columns: Column<Data>[];
    data: Data[];
    initialSortColumn?: string | number;
    initialSortDirection?: Exclude<SortDirection, "NONE">;
    externalSorting?: boolean;
    getRowId: (rowData: Data) => string | number;
};

type SortState = { id: string; direction: Exclude<SortDirection, "NONE"> } | null;

// Reads the value a field points at, walking into nested objects a step at a time
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const get = <ObjectType extends Record<string, any>, Path extends string>(
    object: ObjectType,
    path: Path,
): ObjectPathValue<ObjectType, Path> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any = object;

    for (const key of path.split(".")) {
        value = value[key];
    }

    return value as ObjectPathValue<ObjectType, Path>;
};

// A cell with nothing in it sorts last whichever way the column is pointing, since there is
// nothing there to order
const isBlank = (value: unknown) => value === null || value === undefined || value === "";

const getInitialSortState = <Data extends UniqueRow>(
    columns: Column<Data>[],
    initialSortColumn?: string | number,
    initialSortDirection?: Exclude<SortDirection, "NONE">,
): SortState => {
    const isSortable = (column: Column<Data>) =>
        column.sortBy !== undefined && column.sortBy !== false;

    if (initialSortColumn !== undefined) {
        const column = columns.find(
            (candidate) =>
                candidate.id === initialSortColumn || candidate.field === initialSortColumn,
        );

        // A column that is missing or cannot be sorted leaves the table in the order the
        // data arrived in
        if (!column || !isSortable(column)) {
            return null;
        }

        return {
            id: `${initialSortColumn}`,
            direction: initialSortDirection ?? DEFAULT_SORT_DIRECTION,
        };
    }

    if (initialSortDirection !== undefined) {
        const column = columns.find(isSortable);
        const id = column?.id ?? column?.field;

        if (id === undefined) {
            return null;
        }

        return { id, direction: initialSortDirection };
    }

    return null;
};

// Holds the order of the rows and which column they are sorted by, and hands back the
// headers, rows and cells the table renders
export const useTable = <Data extends UniqueRow>({
    columns,
    data,
    initialSortColumn,
    initialSortDirection,
    externalSorting,
    getRowId,
}: UseTableOptions<Data>): TableModel<Data> => {
    const [rowOrder, setRowOrder] = React.useState(data);
    const [previousData, setPreviousData] = React.useState(data);
    const [previousColumns, setPreviousColumns] = React.useState(columns);
    const [sortState, setSortState] = React.useState<SortState>(() =>
        getInitialSortState(columns, initialSortColumn, initialSortDirection),
    );

    const gridTemplateColumns = getGridTemplate(columns);

    // A column the table was sorted by can be taken away, and the sort goes with it
    if (columns !== previousColumns) {
        setPreviousColumns(columns);

        if (sortState) {
            const stillThere = columns.some(
                (column) => (column.id ?? column.field) === sortState.id,
            );

            if (!stillThere) {
                setSortState(null);
            }
        }
    }

    const headers = columns.map((column) => {
        const id = column.id ?? column.field;

        if (id === undefined) {
            throw new Error("Expected either an `id` or a `field` to be given for a Column");
        }

        const sortable = column.sortBy !== undefined && column.sortBy !== false;

        return {
            id,
            column,
            isSortable: () => sortable,
            getSortDirection: (): SortDirection =>
                sortState && sortState.id === id ? sortState.direction : "NONE",
        };
    });

    const sortRows = (state: Exclude<SortState, null>) => {
        const header = headers.find((candidate) => candidate.id === state.id);

        if (!header) {
            throw new Error(`Unable to find a header with the id: ${state.id}`);
        }

        const { sortBy, field } = header.column;

        if (sortBy === false || sortBy === undefined) {
            throw new Error("The column for this header cannot be sorted");
        }

        // The caller is expected to hand back sorted data of their own, so the order the
        // rows arrived in is left alone
        if (externalSorting) {
            return;
        }

        // Each strategy takes a value type of its own, and which of them applies is the
        // caller's choice of `sortBy` rather than anything known here
        const strategy = typeof sortBy === "string" ? sortStrategies[sortBy] : sortStrategies.basic;
        const compare = strategy as (a: unknown, b: unknown) => number;

        setRowOrder((rows) =>
            rows.slice().sort((a, b) => {
                // A strategy of the caller's own compares whole rows rather than fields
                if (typeof sortBy === "function") {
                    return state.direction === "ASC" ? sortBy(a, b) : sortBy(b, a);
                }

                if (field === undefined) {
                    return 0;
                }

                const valueA = get(a, field);
                const valueB = get(b, field);
                const blankA = isBlank(valueA);
                const blankB = isBlank(valueB);

                if (!blankA && !blankB) {
                    return state.direction === "ASC"
                        ? compare(valueA, valueB)
                        : compare(valueB, valueA);
                }

                if (!blankA) {
                    return -1;
                }

                if (!blankB) {
                    return 1;
                }

                return 0;
            }),
        );
    };

    // Fresh data arrives in whatever order the caller gave it, so the current sort is put
    // back over the top of it
    if (data !== previousData) {
        setPreviousData(data);
        setRowOrder(data);

        if (sortState) {
            sortRows(sortState);
        }
    }

    const sortBy = (header: TableHeaderModel<Data>) => {
        const next: Exclude<SortState, null> = {
            id: header.id,
            direction:
                sortState && sortState.id === header.id
                    ? transitionSortDirection(sortState.direction)
                    : DEFAULT_SORT_DIRECTION,
        };

        setSortState(next);
        sortRows(next);
    };

    return {
        headers,
        rows: rowOrder.map((row) => {
            const rowId = getRowId(row);

            return {
                id: `${rowId}`,
                getValue: () => row,
                getCells: () =>
                    headers.map((header) => ({
                        id: `${rowId}:${header.id}`,
                        column: header.column,
                        rowHeader: header.column.rowHeader ?? false,
                        getValue: () => {
                            if (header.column.field === undefined) {
                                throw new Error(
                                    `Unable to get a value for the column: ${header.id}`,
                                );
                            }

                            return get(row, header.column.field);
                        },
                    })),
            };
        }),
        actions: { sortBy },
        gridTemplateColumns,
    };
};
