import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableContainerProps } from "./DataTable.types";

const classes = {
    root: "data-table-container",
    spacing: "data-table-container-spacing",
};

function TableContainer<As extends React.ElementType = "div">(
    props: TableContainerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as TableContainerProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.spacing, className)}
            data-component="Table.Container"
            {...rest}
        />
    );
}

TableContainer.displayName = "Table.Container";

export default fixedForwardRef(TableContainer);
