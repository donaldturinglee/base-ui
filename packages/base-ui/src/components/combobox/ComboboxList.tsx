import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxListProps } from "./Combobox.types";

const classes = {
    root: "combobox-list",
};

// Everything the combobox is offering. It is the listbox the field is read as controlling, so
// it carries the role and the field carries the caret
function ComboboxList(
    props: ComboboxListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const combobox = React.useContext(ComboboxContext);

    if (!combobox) {
        return null;
    }

    return (
        <div
            ref={ref}
            id={combobox.listId}
            role="listbox"
            aria-labelledby={combobox.labelId}
            aria-multiselectable={combobox.multiple || undefined}
            // Focus never comes here, but the list is still stepped over rather than added to
            // the page's own order
            tabIndex={-1}
            className={classNames(classes.root, className)}
            data-component="Combobox.List"
            {...rest}
        >
            {children}
        </div>
    );
}

ComboboxList.displayName = "Combobox.List";

export default fixedForwardRef(ComboboxList);
