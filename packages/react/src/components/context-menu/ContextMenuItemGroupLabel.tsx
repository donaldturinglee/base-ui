import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemGroupContext } from "./ContextMenuItemGroupContext";
import type { ContextMenuItemGroupLabelProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item-group-label",
};

// What a group of items is called. It is drawn with the id the group names itself by, so a
// screen reader hears it before the items it stands over
function ContextMenuItemGroupLabel(
    props: ContextMenuItemGroupLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const group = React.useContext(ContextMenuItemGroupContext);

    return (
        <div
            ref={ref}
            id={group?.labelId}
            className={classNames(classes.root, className)}
            data-component="ContextMenu.ItemGroupLabel"
            {...rest}
        />
    );
}

ContextMenuItemGroupLabel.displayName = "ContextMenu.ItemGroupLabel";

export default fixedForwardRef(ContextMenuItemGroupLabel);
