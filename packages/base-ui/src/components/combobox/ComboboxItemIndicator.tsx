import * as React from "react";
import { CheckmarkRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxItemContext } from "./ComboboxContext";
import type { ComboboxItemIndicatorProps } from "./Combobox.types";

const classes = {
    root: "combobox-item-indicator",
    // The mark keeps its place whether or not the item is held, so the ends of the rows stay
    // lined up with one another down the list
    unmarked: "invisible",
};

// The mark that says the item is one of the ones being held. What it is drawn as is the
// caller's, and left to itself it is the tick that stands for a choice already made
function ComboboxItemIndicator(
    props: ComboboxItemIndicatorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const item = React.useContext(ComboboxItemContext);
    const selected = item?.selected ?? false;

    return (
        <span
            ref={ref}
            // The row already says whether it is held, so the mark is a picture of that rather
            // than a second telling of it
            aria-hidden="true"
            className={classNames(classes.root, !selected && classes.unmarked, className)}
            data-component="Combobox.ItemIndicator"
            data-selected={selected || undefined}
            {...rest}
        >
            {children ?? <CheckmarkRegular />}
        </span>
    );
}

ComboboxItemIndicator.displayName = "Combobox.ItemIndicator";

export default fixedForwardRef(ComboboxItemIndicator);
