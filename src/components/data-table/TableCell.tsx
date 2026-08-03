import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableCellProps } from "./DataTable.types";

const classes = {
    root: "flex items-center text-start p-[var(--table-cell-padding-block)_var(--table-cell-padding-inline)] border-b-[length:var(--border-width-thin)] border-b-border-default",
    end: "justify-end text-end",
    // A cell that names its row reads as a heading for it, so it is set apart the same way
    rowHeader: "[font-weight:var(--base-text-weight-semibold)] text-foreground-default",
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
