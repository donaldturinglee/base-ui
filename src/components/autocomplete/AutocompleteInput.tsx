import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import { AutocompleteContext, AutocompleteInputContext } from "./AutocompleteContext";
import type { AutocompleteInputProps } from "./Autocomplete.types";

// The keys that reach for the list from a field that is not showing one
const openKeys = ["ArrowDown", "ArrowUp"];

// The keys that rub out what has been typed, which a completion is never put back in answer
// to
const deleteKeys = ["Backspace", "Delete"];

// The field a combobox is typed into. It is read as controlling the list rather than holding
// it, and points at whichever option the arrow keys have reached so that focus never has to
// leave the field
function AutocompleteInput<As extends React.ElementType = never>(
    props: AutocompleteInputProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = TextInput,
        className,
        openOnFocus = false,
        value,
        onFocus,
        onBlur,
        onClick,
        onChange,
        onKeyDown,
        onKeyUp,
        ...rest
    } = props as AutocompleteInputProps<React.ElementType>;

    const { id, inputRef, activeDescendantId, showMenu, setShowMenu, setInputValue } =
        React.useContext(AutocompleteContext);
    const { inputValue = "", autocompleteSuggestion = "" } =
        React.useContext(AutocompleteInputContext);

    const mergedRef = useMergedRefs(ref, inputRef);

    // Rubbing a completion out is not answered with another one, or the reader would find it
    // put straight back
    const [completes, setCompletes] = React.useState(true);

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(event);

        if (openOnFocus) {
            setShowMenu?.(true);
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        onBlur?.(event);

        // Pressing an option never takes focus off the field, so focus leaving it means the
        // reader has gone elsewhere and the list has nothing left to stand under
        setShowMenu?.(false);
    };

    const handleClick = (event: React.MouseEvent<HTMLInputElement>) => {
        onClick?.(event);

        // A field that opens on focus opens again when it is clicked, since a reader coming
        // back to a field they have already picked from is still reaching for the list
        if (openOnFocus) {
            setShowMenu?.(true);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(event);
        setInputValue?.(event.currentTarget.value);
        setShowMenu?.(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(event);

        // A caller that has answered the key itself is left to it
        if (event.defaultPrevented) {
            return;
        }

        if (deleteKeys.includes(event.key)) {
            setCompletes(false);
        }

        if (event.key === "Escape") {
            // The list goes first, since a reader reaching for Escape while it is showing is
            // reaching for the list rather than for what they have typed
            if (showMenu) {
                setShowMenu?.(false);
            } else if (event.currentTarget.value) {
                setInputValue?.("");
                event.currentTarget.value = "";
            }

            return;
        }

        if (!showMenu && !event.altKey && openKeys.includes(event.key)) {
            setShowMenu?.(true);
        }
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyUp?.(event);

        if (deleteKeys.includes(event.key)) {
            setCompletes(true);
        }
    };

    // The completion is written onto the element rather than rendered, so that the field can
    // hold text the reader never typed without the caller having to hold it as well
    React.useEffect(() => {
        const input = inputRef?.current;

        if (!input) {
            return;
        }

        if (!autocompleteSuggestion) {
            input.value = inputValue;
            return;
        }

        // A field nobody is typing into is left as it stands: the completion belongs to what
        // is being typed, not to what was
        if (!completes || document.activeElement !== input) {
            return;
        }

        input.value = autocompleteSuggestion;

        // Only the part that was not typed is selected, so that carrying on typing replaces
        // the completion rather than following it
        if (autocompleteSuggestion.toLowerCase().startsWith(inputValue.toLowerCase())) {
            input.setSelectionRange(inputValue.length, autocompleteSuggestion.length);
        }
    }, [autocompleteSuggestion, inputValue, inputRef, completes]);

    // A caller holding the text passes it in, and the field follows. It is never passed down
    // to the element itself: the field holds its own text, so that a completion can be
    // written over it and taken back off again
    React.useEffect(() => {
        if (value === undefined) {
            return;
        }

        setInputValue?.(String(value));
    }, [value, setInputValue]);

    return (
        <Component
            ref={mergedRef}
            id={id}
            role="combobox"
            autoComplete="off"
            aria-autocomplete="both"
            aria-haspopup="listbox"
            aria-expanded={Boolean(showMenu)}
            aria-controls={`${id}-listbox`}
            aria-activedescendant={activeDescendantId}
            className={className}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onClick={handleClick}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            data-component="Autocomplete.Input"
            {...rest}
        />
    );
}

AutocompleteInput.displayName = "Autocomplete.Input";

export default fixedForwardRef(AutocompleteInput);
