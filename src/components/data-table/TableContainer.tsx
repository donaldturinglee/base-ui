import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableContainerProps } from "./DataTable.types";

const classes = {
    // Every part of the table has a place on this grid, so the title, the actions and the
    // footer stay put whichever of them a caller gives
    root: "grid grid-cols-2 gap-x-[var(--base-size-8)] [grid-template-areas:'title_actions''divider_divider''subtitle_subtitle''filter_filter''table_table''footer_footer']",
    // The table is given room below whatever heads it
    spacing:
        "[&_[data-component='Table.Title']+[data-component='ScrollableRegion']]:mt-[var(--base-size-8)] [&_[data-component='Table.Subtitle']+[data-component='ScrollableRegion']]:mt-[var(--base-size-8)] [&_[data-component='Table.Actions']+[data-component='ScrollableRegion']]:mt-[var(--base-size-8)]",
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
