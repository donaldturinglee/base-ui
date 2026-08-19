import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxEmptyProps } from "./Combobox.types";

const classes = {
    root: "combobox-empty",
};

// What stands in place of the list once what was typed has left nothing to show. It says so of
// its own accord rather than waiting to be told
function ComboboxEmpty(
    props: ComboboxEmptyProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children = "No results found", ...rest } = props;
    const combobox = React.useContext(ComboboxContext);

    // Nothing is said until the items have had their say, so the message never shows for the
    // moment between the list arriving and its items being counted
    if (!combobox || combobox.entries.length === 0 || combobox.matches.length > 0) {
        return null;
    }

    return (
        <div
            ref={ref}
            role="presentation"
            className={classNames(classes.root, className)}
            data-component="Combobox.Empty"
            {...rest}
        >
            {children}
        </div>
    );
}

ComboboxEmpty.displayName = "Combobox.Empty";

export default fixedForwardRef(ComboboxEmpty);
