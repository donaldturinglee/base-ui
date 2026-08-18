import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxInputProps } from "./Combobox.types";

const classes = {
    root: "combobox-input",
};

// The keys that reach for the list from a field that is not showing one, and that run down it
// once it is standing
const listKeys = ["ArrowDown", "ArrowUp"];

// The keys that rub out what has been typed, which a completion is never put back in answer to
const deleteKeys = ["Backspace", "Delete"];

// What the combobox is typed into. It is read as controlling the list rather than holding it,
// and points at whichever item is in hand, so the arrow keys run down the list without the
// caret ever leaving the field
function ComboboxInput(
    props: ComboboxInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, onChange, onClick, onKeyDown, onKeyUp, ...rest } = props;

    const combobox = React.useContext(ComboboxContext);
    const inputRef = combobox?.inputRef;
    const mergedRef = useMergedRefs(ref, inputRef ?? null);

    // Rubbing a completion out is not answered with another one, or the reader would find it
    // put straight back
    const [completes, setCompletes] = React.useState(true);

    const inputValue = combobox?.inputValue ?? "";
    const completion = completes ? (combobox?.completion ?? "") : "";
    const shown = completion === "" ? inputValue : completion;

    // Only the part that was not typed is selected, so that carrying on typing replaces the
    // completion rather than following it. It is set after the field has been drawn with the
    // completion in it, since there is nothing to select until then
    React.useEffect(() => {
        const input = inputRef?.current;

        if (!input || completion === "" || input.value !== completion) {
            return;
        }

        // A field nobody is typing into is left as it stands: the completion belongs to what
        // is being typed, not to what was
        if (document.activeElement !== input) {
            return;
        }

        input.setSelectionRange(inputValue.length, completion.length);
    }, [completion, inputRef, inputValue]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        combobox?.onType(event.currentTarget.value);
    };

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || !combobox || combobox.disabled) {
            return;
        }

        // A field that opens when it is clicked opens again when the reader comes back to one
        // they have already picked from, since they are still reaching for the list
        if (combobox.openOnClick && !combobox.open) {
            combobox.setOpen(true);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        if (!combobox || event.defaultPrevented) {
            return;
        }

        if (deleteKeys.includes(event.key)) {
            setCompletes(false);
        }

        // A key pressed with a modifier belongs to the browser or the page rather than to the
        // field. Alt is the exception, since it is what opens and closes a list of its own
        if (event.ctrlKey || event.metaKey) {
            return;
        }

        if (event.key === "Escape") {
            // The list goes first, since a reader reaching for Escape while it is standing is
            // reaching for the list rather than for what they have typed
            if (combobox.open) {
                // Taking the event keeps a layer the field stands in from being dismissed by
                // the same press that took the list down
                event.preventDefault();
                combobox.setOpen(false);
            } else if (combobox.inputValue !== "") {
                combobox.setInputValue("");
            }

            return;
        }

        // Tabbing away takes the list down and leaves what is held as it was, since focus is
        // going somewhere the list cannot follow
        if (event.key === "Tab") {
            if (combobox.open) {
                combobox.setOpen(false);
            }

            return;
        }

        if (event.key === "Enter") {
            if (combobox.open && combobox.highlightedValue !== null) {
                // Taking the event keeps the form the field stands in from being submitted by
                // the press that was picking from the list
                event.preventDefault();
                combobox.select(combobox.highlightedValue);
            }

            return;
        }

        if (!listKeys.includes(event.key)) {
            return;
        }

        // Taking the event keeps the caret from running to either end of what was typed while
        // the reader is going down the list
        event.preventDefault();

        if (!combobox.open) {
            if (combobox.openOnKeyPress && !combobox.disabled) {
                // Opened from the keyboard, the list is entered at the end the key was
                // reaching for, so that one press both shows it and lands on something
                combobox.openAt(event.key === "ArrowDown" ? "first" : "last");
            }

            return;
        }

        // Held down, Alt is what takes a standing list back down rather than what moves along
        // it, which is the one way to close a list from the keyboard without losing what was
        // typed
        if (event.altKey) {
            if (event.key === "ArrowUp") {
                combobox.setOpen(false);
            }

            return;
        }

        combobox.moveHighlight(event.key === "ArrowDown" ? 1 : -1);
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyUp?.(event);

        if (deleteKeys.includes(event.key)) {
            setCompletes(true);
        }
    };

    if (!combobox) {
        return null;
    }

    const activeId =
        combobox.open && combobox.highlightedValue !== null
            ? combobox.getItemId(combobox.highlightedValue)
            : undefined;

    return (
        <TextInput
            ref={mergedRef}
            id={combobox.inputId}
            type="text"
            block
            role="combobox"
            autoComplete="off"
            // A field that writes the answer in behind the caret completes both ways: from the
            // list, and inline. One that only narrows the list completes from the list alone
            aria-autocomplete={combobox.inputBehavior === "autocomplete" ? "both" : "list"}
            aria-expanded={combobox.open}
            // Named only while the list is standing, since there is nothing to point at once
            // it has been taken down
            aria-controls={combobox.open ? combobox.listId : undefined}
            aria-activedescendant={activeId}
            disabled={combobox.disabled}
            readOnly={combobox.readOnly}
            required={combobox.required}
            validationStatus={combobox.invalid ? "error" : undefined}
            placeholder={combobox.placeholder}
            value={shown}
            onChange={handleChange}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            className={classNames(classes.root, className)}
            data-component="Combobox.Input"
            {...rest}
        />
    );
}

ComboboxInput.displayName = "Combobox.Input";

export default fixedForwardRef(ComboboxInput);
