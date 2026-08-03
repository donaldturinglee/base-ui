import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableTitleProps } from "./DataTable.types";

const classes = {
    root: "m-0 self-center [grid-area:title] [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)] [line-height:var(--base-size-20)] text-foreground-default",
};

function TableTitle<As extends React.ElementType = "h2">(
    props: TableTitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "h2",
        className,
        ...rest
        // `id` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as TableTitleProps<"h2">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Table.Title"
            {...rest}
        />
    );
}

TableTitle.displayName = "Table.Title";

export default fixedForwardRef(TableTitle);
