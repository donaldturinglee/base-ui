import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SUBGRID_CLASSES } from "./tableLayout";
import type { TableHeadProps } from "./DataTable.types";

function TableHead(
    props: TableHeadProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <thead
            ref={ref}
            // A table laid out on a grid loses its own semantics in some browsers, so the
            // role is stated rather than left to the element
            role="rowgroup"
            className={classNames(SUBGRID_CLASSES, className)}
            data-component="Table.Head"
            {...rest}
        />
    );
}

TableHead.displayName = "Table.Head";

export default fixedForwardRef(TableHead);
