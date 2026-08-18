import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxItemGroupContext } from "./ComboboxContext";
import type { ComboboxItemGroupLabelProps } from "./Combobox.types";

const classes = {
    root: "combobox-item-group-label",
};

// What the run of items below it is called. It names the group without standing over it: it is
// set small and muted rather than heavy, so the items are what the eye lands on going down
function ComboboxItemGroupLabel(
    props: ComboboxItemGroupLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const group = React.useContext(ComboboxItemGroupContext);

    return (
        <div
            ref={ref}
            id={group?.labelId}
            className={classNames(classes.root, className)}
            data-component="Combobox.ItemGroupLabel"
            {...rest}
        >
            {children}
        </div>
    );
}

ComboboxItemGroupLabel.displayName = "Combobox.ItemGroupLabel";

export default fixedForwardRef(ComboboxItemGroupLabel);
