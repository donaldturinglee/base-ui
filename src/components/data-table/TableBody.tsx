import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SUBGRID_CLASSES } from "./tableLayout";
import type { TableBodyProps } from "./DataTable.types";

function TableBody(
    props: TableBodyProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <tbody
            ref={ref}
            // A table laid out on a grid loses its own semantics in some browsers, so the
            // role is stated rather than left to the element
            role="rowgroup"
            className={classNames(SUBGRID_CLASSES, className)}
            data-component="Table.Body"
            {...rest}
        />
    );
}

TableBody.displayName = "Table.Body";

export default fixedForwardRef(TableBody);
