import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableDividerProps } from "./DataTable.types";

const classes = {
    root: "data-table-divider",
};

function TableDivider(
    props: TableDividerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            // The line only draws the eye down the page, so it says nothing of its own
            role="presentation"
            className={classNames(classes.root, className)}
            data-component="Table.Divider"
            {...rest}
        />
    );
}

TableDivider.displayName = "Table.Divider";

export default fixedForwardRef(TableDivider);
