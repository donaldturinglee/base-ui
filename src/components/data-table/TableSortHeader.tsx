import * as React from "react";
import { ArrowSortDownRegular, ArrowSortUpRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import TableHeader from "./TableHeader";
import type { TableSortHeaderProps } from "./DataTable.types";

const classes = {
    header: "data-table-sort-header",
    button: "data-table-sort-header-button",
    buttonEnd: "data-table-sort-header-button-end",
    icon: "data-table-sort-header-icon",
    iconResting: "data-table-sort-header-icon-resting",
    hidden: "sr-only",
};

function TableSortHeader(
    props: TableSortHeaderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, align, children, direction, onToggleSort, ...rest } = props;

    const ariaSort =
        direction === "ASC" ? "ascending" : direction === "DESC" ? "descending" : undefined;
    const Icon = direction === "DESC" ? ArrowSortDownRegular : ArrowSortUpRegular;

    return (
        <TableHeader
            ref={ref}
            align={align}
            aria-sort={ariaSort}
            className={classNames(classes.header, className)}
            data-component="Table.SortHeader"
            {...rest}
        >
            <button
                type="button"
                onClick={onToggleSort}
                className={classNames(classes.button, align === "end" && classes.buttonEnd)}
                data-component="Table.SortHeader.Button"
            >
                {children}
                <Icon
                    className={classNames(
                        classes.icon,
                        direction === "NONE" && classes.iconResting,
                    )}
                    aria-hidden="true"
                    data-sort-icon={direction === "DESC" ? "descending" : "ascending"}
                />
                {direction === "NONE" ? (
                    <span className={classes.hidden}>sort ascending</span>
                ) : null}
            </button>
        </TableHeader>
    );
}

TableSortHeader.displayName = "Table.SortHeader";

export default fixedForwardRef(TableSortHeader);
