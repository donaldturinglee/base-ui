import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ComboboxItemTextProps } from "./Combobox.types";

const classes = {
    root: "combobox-item-text",
};

// What the item is called. Naming it here rather than leaving it to the item's own text is what
// lets an item carry a mark, a picture or a note beside its name without any of them being
// taken for part of what is typed against
function ComboboxItemText(
    props: ComboboxItemTextProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    return (
        <span
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Combobox.ItemText"
            {...rest}
        >
            {children}
        </span>
    );
}

ComboboxItemText.displayName = "Combobox.ItemText";

export default fixedForwardRef(ComboboxItemText);
