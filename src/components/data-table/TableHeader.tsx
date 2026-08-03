import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableHeaderProps } from "./DataTable.types";

const classes = {
    root: "flex items-center text-start p-[var(--table-cell-padding-block)_var(--table-cell-padding-inline)] [font-weight:var(--base-text-weight-semibold)] text-foreground-muted bg-background-muted border-b-[length:var(--border-width-thin)] border-b-border-default border-t-[length:var(--border-width-thin)] border-t-border-default",
    end: "justify-end text-end",
    // A sorted column is the one the reader is looking at, so it is set in the plain colour
    sorted: "aria-[sort=ascending]:text-foreground-default aria-[sort=descending]:text-foreground-default",
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
