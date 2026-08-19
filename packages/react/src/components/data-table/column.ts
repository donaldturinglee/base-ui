import type { Column, UniqueRow } from "./DataTable.types";

// Ties a set of columns to the shape of the row they describe, so a field that is not a
// path into the data is a type error rather than an empty cell
export const createColumnHelper = <Data extends UniqueRow>() => ({
    column: (column: Column<Data>): Column<Data> => ({
        ...column,
        id: column.id ?? column.field,
    }),
});
