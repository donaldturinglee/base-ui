import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxTriggerProps } from "./Combobox.types";

const classes = {
    root: "combobox-trigger",
};

// The button that reaches for the list. It shows everything rather than what was last typed
// for, since a reader pressing it is reaching past whatever stands in the field
function ComboboxTrigger(
    props: ComboboxTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        icon = ChevronDownRegular,
        onClick,
        onMouseDown,
        "aria-label": ariaLabel = "Show suggestions",
        ...rest
    } = props;

    const combobox = React.useContext(ComboboxContext);

    if (!combobox) {
        return null;
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLButtonElement>) => {
        onMouseDown?.(event);

        // Taking the press keeps the caret in the field, so that pressing the button never
        // reads as the reader having gone elsewhere and taken the list down with them
        if (!event.defaultPrevented) {
            event.preventDefault();
        }
    };

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        // A combobox that is only being read from still opens its list, since there is nothing
        // wrong with looking at what is there
        if (event.defaultPrevented || combobox.disabled) {
            return;
        }

        combobox.setOpen(!combobox.open);
        combobox.inputRef.current?.focus();
    };

    return (
        <IconButton
            ref={ref}
            icon={icon}
            variant="invisible"
            size="small"
            // A button standing inside a field is never a stop of its own: the field is what
            // is tabbed to, and the list it opens is reached by the arrow keys from there
            tabIndex={-1}
            aria-label={ariaLabel}
            aria-expanded={combobox.open}
            aria-controls={combobox.open ? combobox.listId : undefined}
            disabled={combobox.disabled}
            className={classNames(classes.root, className)}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            data-component="Combobox.Trigger"
            {...rest}
        />
    );
}

ComboboxTrigger.displayName = "Combobox.Trigger";

export default fixedForwardRef(ComboboxTrigger);
