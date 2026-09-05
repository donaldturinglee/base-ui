import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ContextMenuItemGroupContext } from "./ContextMenuItemGroupContext";
import type { ContextMenuRadioItemGroupProps } from "./ContextMenu.types";

const classes = {
    root: "context-menu-item-group",
};

// A run of items of which one at a time is picked. The group holds which one, so the items
// inside it have only to say what they stand for
function ContextMenuRadioItemGroup(
    props: ContextMenuRadioItemGroupProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, value, onValueChange, ...rest } = props;

    const id = useId();
    const labelId = `${id}--label`;

    const groupContextValue = React.useMemo(
        () => ({ labelId, value, onValueChange }),
        [labelId, value, onValueChange],
    );

    return (
        <ContextMenuItemGroupContext.Provider value={groupContextValue}>
            <div
                ref={ref}
                role="group"
                aria-labelledby={labelId}
                className={classNames(classes.root, className)}
                data-component="ContextMenu.RadioItemGroup"
                {...rest}
            >
                {children}
            </div>
        </ContextMenuItemGroupContext.Provider>
    );
}

ContextMenuRadioItemGroup.displayName = "ContextMenu.RadioItemGroup";

export default fixedForwardRef(ContextMenuRadioItemGroup);
