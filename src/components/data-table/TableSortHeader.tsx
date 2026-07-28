import * as React from "react";
import { ArrowSortDownRegular, ArrowSortUpRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import TableHeader from "./TableHeader";
import type { TableSortHeaderProps } from "./DataTable.types";

const classes = {
    header: "group/sort-header",
    button: "flex items-center gap-x-[var(--base-size-8)] p-0 m-0 bg-transparent border-0 appearance-none cursor-pointer text-start [font:inherit] [color:inherit]",
    buttonFocus:
        "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)]",
    // An end aligned column keeps its label against the edge, so the icon moves inside it
    buttonEnd: "flex-row-reverse",
    icon: "shrink-0 size-[var(--base-size-16)]",
    // An unsorted column only shows what pressing it would do once the reader is on it
    iconResting: "invisible group-hover/sort-header:visible group-focus-within/sort-header:visible",
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
                className={classNames(
                    classes.button,
                    classes.buttonFocus,
                    align === "end" && classes.buttonEnd,
                )}
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
