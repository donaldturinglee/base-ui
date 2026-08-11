import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { HeaderItemProps } from "./Header.types";

const classes = {
    root: "header-item",
    full: "header-item-full",
};

// One thing standing in the row. It is only ever as wide as what it holds, unless it is the
// item asked to take the room the rest of the row leaves
function HeaderItem(
    props: HeaderItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, full, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, full && classes.full, className)}
            data-component="Header.Item"
            data-full={full ? "" : undefined}
            {...rest}
        />
    );
}

HeaderItem.displayName = "Header.Item";

export default fixedForwardRef(HeaderItem);
