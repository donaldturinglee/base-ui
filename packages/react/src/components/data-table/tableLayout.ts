import type { Column, UniqueRow } from "./DataTable.types";

// The head, the body and each row take part in the table's own grid, so cells line up in
// columns the whole way down
export const SUBGRID_CLASSES = "data-table-subgrid";

// Works out the grid track for each column from the width it asks for
export const getGridTemplateFromColumns = <Data extends UniqueRow>(columns: Column<Data>[]) =>
    columns.map((column) => {
        const width = column.width ?? "grow";
        let minWidth = "auto";
        let maxWidth = "1fr";

        if (width === "auto") {
            maxWidth = "auto";
        }

        // A growing column is never narrower than its widest cell, unless it has been given
        // a maximum for that cell to overflow against
        if (width === "grow" && !column.maxWidth) {
            minWidth = "max-content";
        }

        // A column that may collapse has no minimum of its own
        if (width === "growCollapse") {
            minWidth = "0";
        }

        if (column.minWidth) {
            minWidth =
                typeof column.minWidth === "number" ? `${column.minWidth}px` : column.minWidth;
        }

        if (column.maxWidth) {
            maxWidth =
                typeof column.maxWidth === "number" ? `${column.maxWidth}px` : column.maxWidth;
        }

        if (typeof width !== "number" && ["grow", "growCollapse", "auto"].includes(width)) {
            return minWidth === maxWidth ? minWidth : `minmax(${minWidth}, ${maxWidth})`;
        }

        // Anything else is a width of the caller's own
        return typeof width === "number" ? `${width}px` : width;
    });

export const getGridTemplate = <Data extends UniqueRow>(columns: Column<Data>[]) =>
    getGridTemplateFromColumns(columns).join(" ");
