import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableCellProps } from "./DataTable.types";

const classes = {
    root: "data-table-cell",
    end: "data-table-cell-end",
    rowHeader: "data-table-cell-row-header",
};

function TableCell(
    props: TableCellProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, align, scope, ...rest } = props;

    const Component = scope ? "th" : "td";

    return (
        <Component
            ref={ref}
            scope={scope}
            // A table laid out on a grid loses its own semantics in some browsers, so the
            // role is stated rather than left to the element
            role={scope ? "rowheader" : "cell"}
            className={classNames(
                classes.root,
                align === "end" && classes.end,
                scope && classes.rowHeader,
                className,
            )}
            data-component="Table.Cell"
            data-cell-align={align}
            {...rest}
        />
    );
}

TableCell.displayName = "Table.Cell";

export default fixedForwardRef(TableCell);
