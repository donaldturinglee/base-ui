import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Text } from "../text";
import type { TableCellPlaceholderProps } from "./DataTable.types";

const classes = {
    root: "[color:var(--foreground-color-muted)]",
};

// Stands in a cell that has nothing to show, so an empty column still reads as deliberate
function TableCellPlaceholder(
    props: TableCellPlaceholderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <Text
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Table.CellPlaceholder"
            {...rest}
        />
    );
}

TableCellPlaceholder.displayName = "Table.CellPlaceholder";

export default fixedForwardRef(TableCellPlaceholder);
