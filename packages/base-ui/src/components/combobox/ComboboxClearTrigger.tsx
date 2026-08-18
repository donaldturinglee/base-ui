import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxClearTriggerProps } from "./Combobox.types";

const classes = {
    root: "combobox-clear-trigger",
};

// The button that empties the field and gives back whatever was picked. There is nothing to
// clear from a combobox holding neither, so it stands down rather than sitting there doing
// nothing when it is pressed
function ComboboxClearTrigger(
    props: ComboboxClearTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        icon = DismissRegular,
        onClick,
        onMouseDown,
        "aria-label": ariaLabel = "Clear",
        ...rest
    } = props;

    const combobox = React.useContext(ComboboxContext);

    if (!combobox || (combobox.inputValue === "" && combobox.value.length === 0)) {
        return null;
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        onMouseDown?.(event);

        // Taking the press keeps the caret in the field, so that clearing it leaves the reader
        // where they were rather than somewhere else on the page
        if (!event.defaultPrevented) {
            event.preventDefault();
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        combobox.clear();
    };

    return (
        <IconButton
            ref={ref}
            icon={icon}
            variant="invisible"
            size="small"
            // A button standing inside a field is never a stop of its own: the field is what
            // is tabbed to, and Escape is what empties it from the keyboard
            tabIndex={-1}
            aria-label={ariaLabel}
            disabled={combobox.disabled || combobox.readOnly}
            className={classNames(classes.root, className)}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            data-component="Combobox.ClearTrigger"
            {...rest}
        />
    );
}

ComboboxClearTrigger.displayName = "Combobox.ClearTrigger";

export default fixedForwardRef(ComboboxClearTrigger);
