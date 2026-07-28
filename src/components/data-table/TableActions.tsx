import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableActionsProps } from "./DataTable.types";

const classes = {
    root: "flex items-center gap-x-[var(--base-size-8)] justify-self-end [grid-area:actions]",
};

function TableActions(
    props: TableActionsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Table.Actions"
            {...rest}
        />
    );
}

TableActions.displayName = "Table.Actions";

export default fixedForwardRef(TableActions);
