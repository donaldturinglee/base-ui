import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableHeaderProps } from "./DataTable.types";

const classes = {
    root: "data-table-header",
    end: "data-table-header-end",
    sorted: "data-table-header-sorted",
};

function TableHeader(
    props: TableHeaderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, align, ...rest } = props;

    return (
        <th
            ref={ref}
            // A table laid out on a grid loses its own semantics in some browsers, so the
            // role is stated rather than left to the element
            role="columnheader"
            scope="col"
            className={classNames(
                classes.root,
                classes.sorted,
                align === "end" && classes.end,
                className,
            )}
            data-component="Table.Header"
            data-cell-align={align}
            {...rest}
        />
    );
}

TableHeader.displayName = "Table.Header";

export default fixedForwardRef(TableHeader);
