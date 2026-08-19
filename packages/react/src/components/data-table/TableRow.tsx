import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SUBGRID_CLASSES } from "./tableLayout";
import type { TableRowProps } from "./DataTable.types";

function TableRow(
    props: TableRowProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <tr
            ref={ref}
            // A table laid out on a grid loses its own semantics in some browsers, so the
            // role is stated rather than left to the element
            role="row"
            className={classNames(SUBGRID_CLASSES, className)}
            data-component="Table.Row"
            {...rest}
        />
    );
}

TableRow.displayName = "Table.Row";

export default fixedForwardRef(TableRow);
