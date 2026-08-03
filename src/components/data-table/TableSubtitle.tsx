import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TableSubtitleProps } from "./DataTable.types";

const classes = {
    root: "m-0 [grid-area:subtitle] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-normal)] [line-height:var(--text-title-line-height-small)] text-foreground-default",
};

function TableSubtitle<As extends React.ElementType = "div">(
    props: TableSubtitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        ...rest
        // `id` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as TableSubtitleProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Table.Subtitle"
            {...rest}
        />
    );
}

TableSubtitle.displayName = "Table.Subtitle";

export default fixedForwardRef(TableSubtitle);
