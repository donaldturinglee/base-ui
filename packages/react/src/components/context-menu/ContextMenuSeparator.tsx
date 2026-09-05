import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ContextMenuSeparatorProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-separator",
};

// A line between one run of items and the next, so a menu built from parts can be broken up
function ContextMenuSeparator(
    props: ContextMenuSeparatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <hr
            ref={ref}
            role="separator"
            aria-orientation="horizontal"
            className={classNames(classes.root, className)}
            data-component="ContextMenu.Separator"
            {...rest}
        />
    );
}

ContextMenuSeparator.displayName = "ContextMenu.Separator";

export default fixedForwardRef(ContextMenuSeparator);
