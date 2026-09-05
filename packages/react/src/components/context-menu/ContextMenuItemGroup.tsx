import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemGroupContext } from "./ContextMenuItemGroupContext";
import type { ContextMenuItemGroupProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item-group",
};

// Related items collected under a label of their own, which is what names the group
function ContextMenuItemGroup(
    props: ContextMenuItemGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    const id = useId();
    const labelId = `${id}--label`;

    const groupContextValue = React.useMemo(() => ({ labelId }), [labelId]);

    return (
        <ContextMenuItemGroupContext.Provider value={groupContextValue}>
            <div
                ref={ref}
                role="group"
                aria-labelledby={labelId}
                className={classNames(classes.root, className)}
                data-component="ContextMenu.ItemGroup"
                {...rest}
            >
                {children}
            </div>
        </ContextMenuItemGroupContext.Provider>
    );
}

ContextMenuItemGroup.displayName = "ContextMenu.ItemGroup";

export default fixedForwardRef(ContextMenuItemGroup);
