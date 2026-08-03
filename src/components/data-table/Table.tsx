import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ScrollableRegion } from "../scrollable-region";
import type { TableCellPadding, TableProps } from "./DataTable.types";

// The class names carry the folder's own name rather than the component's, since `table`
// and `table-cell` are Tailwind display utilities and would be drawn over in the utilities
// layer
const classes = {
    wrapper: "data-table-wrapper",
};

const tableVariants = cva("data-table", {
    variants: {
        cellPadding: {
            condensed: "data-table-cell-padding-condensed",
            normal: "data-table-cell-padding-normal",
            spacious: "data-table-cell-padding-spacious",
        } satisfies Record<TableCellPadding, string>,
    },
});

function Table(
    props: TableProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        cellPadding = "normal",
        gridTemplateColumns,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    // A table wide enough to scroll becomes a landmark, which has to carry a name. It takes
    // the table's own where there is one, and otherwise says what it is
    const regionLabel = ariaLabelledBy
        ? ({ "aria-labelledby": ariaLabelledBy } as const)
        : ({ "aria-label": "Table" } as const);

    return (
        <ScrollableRegion {...regionLabel} className={classes.wrapper}>
            <table
                ref={ref}
                // A table laid out on a grid loses its own semantics in some browsers, so
                // every part of it says what it is
                role="table"
                aria-labelledby={ariaLabelledBy}
                className={classNames(tableVariants({ cellPadding }), className)}
                style={
                    {
                        ...style,
                        "--table-grid-template-columns": gridTemplateColumns,
                    } as React.CSSProperties
                }
                data-component="Table"
                data-cell-padding={cellPadding}
                {...rest}
            />
        </ScrollableRegion>
    );
}

Table.displayName = "Table";

export default fixedForwardRef(Table);
