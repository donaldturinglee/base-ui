import * as React from "react";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { useFilter } from "../../providers/locale";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxContext } from "./ComboboxContext";
import type { ComboboxItemEntry, ComboboxProps } from "./Combobox.types";

const classes = {
    root: "combobox",
};

// A field that is answered from a list standing under it. What is typed narrows the list, the
// arrow keys run down what is left, and Enter takes whatever is in hand:
//
//     <Combobox>
//         <Combobox.Label>Fruit</Combobox.Label>
//         <Combobox.Control>
//             <Combobox.Input />
//             <Combobox.ClearTrigger />
//             <Combobox.Trigger />
//         </Combobox.Control>
//         <Combobox.Positioner>
//             <Combobox.Content>
//                 <Combobox.List>
//                     <Combobox.Item value="apple">
//                         <Combobox.ItemText>Apple</Combobox.ItemText>
//                         <Combobox.ItemIndicator />
//                     </Combobox.Item>
//                 </Combobox.List>
//                 <Combobox.Empty />
//             </Combobox.Content>
//         </Combobox.Positioner>
//     </Combobox>
//
// The items are not known until they have drawn themselves, since an item can be written
// anywhere inside the list, so each says it is there as it arrives and takes itself off again
// as it goes. The field keeps the caret throughout and points at whichever item is in hand, so
// the list is read without focus ever leaving what is being typed into
function Combobox(
    props: ComboboxProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        value: valueProp,
        defaultValue = [],
        onValueChange,
        onSelect,
        inputValue: inputValueProp,
        defaultInputValue = "",
        onInputValueChange,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        highlightedValue: highlightedValueProp,
        defaultHighlightedValue = null,
        onHighlightChange,
        multiple = false,
        closeOnSelect = !multiple,
        selectionBehavior = multiple ? "clear" : "replace",
        inputBehavior = "none",
        allowCustomValue = false,
        loopFocus = false,
        openOnClick = false,
        openOnChange = true,
        openOnKeyPress = true,
        filter: filterProp,
        shouldFilter = true,
        disabled = false,
        readOnly = false,
        invalid = false,
        required = false,
        placeholder,
        name,
        form,
        id: idProp,
        className,
        children,
        onBlur,
        ...rest
    } = props;

    const id = useId(idProp);
    const inputId = `${id}-input`;
    const labelId = `${id}-label`;
    const listId = `${id}-list`;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const controlRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    /* What the combobox is holding */

    // A combobox the caller is holding takes what is picked from the prop; one that is not
    // keeps its own. The same goes for what stands in the field, whether the list is showing,
    // and which item is in hand
    const isValueControlled = valueProp !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue);
    const value = isValueControlled ? valueProp : selfValue;

    const isInputValueControlled = inputValueProp !== undefined;
    const [selfInputValue, setSelfInputValue] = React.useState(defaultInputValue);
    const inputValue = isInputValueControlled ? inputValueProp : selfInputValue;

    const isOpenControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
    const open = isOpenControlled ? openProp : selfOpen;

    const isHighlightControlled = highlightedValueProp !== undefined;
    const [selfHighlighted, setSelfHighlighted] = React.useState(defaultHighlightedValue);
    const heldHighlight = isHighlightControlled ? highlightedValueProp : selfHighlighted;

    const setValue = React.useCallback(
        (next: string[]) => {
            if (!isValueControlled) {
                setSelfValue(next);
            }

            onValueChange?.(next);
        },
        [isValueControlled, onValueChange],
    );

    const setInputValue = React.useCallback(
        (next: string) => {
            if (!isInputValueControlled) {
                setSelfInputValue(next);
            }

            onInputValueChange?.(next);
        },
        [isInputValueControlled, onInputValueChange],
    );

    // The caller is told what the item in hand became rather than what it was set to, since the
    // two part company as the list narrows around whatever was being rested on
    const setHighlightedValue = React.useCallback(
        (next: string | null) => {
            if (!isHighlightControlled) {
                setSelfHighlighted(next);
            }
        },
        [isHighlightControlled],
    );

    // Which end an arrow key asked the list to open at. The items are not there to be pointed
    // at until the list has been drawn, so the end is kept and the highlight follows once they
    // have said they are there
    const pending = React.useRef<"first" | "last" | null>(null);

    const changeOpen = React.useCallback(
        (next: boolean) => {
            if (!isOpenControlled) {
                setSelfOpen(next);
            }

            onOpenChange?.(next);

            // Nothing is in hand in a list that is not showing, and the item the field was
            // pointing at goes down with it, along with any end it was on its way to
            if (!next) {
                pending.current = null;
                setHighlightedValue(null);
            }
        },
        [isOpenControlled, onOpenChange, setHighlightedValue],
    );

    /* What the list is showing */

    // The list is only narrowed by what was typed once something has been typed into it.
    // Reaching for the button, or coming back to a field that already holds a choice, is
    // reaching past what stands there, so everything is offered again
    const [narrowed, setNarrowed] = React.useState(false);

    // The items are held apart from the list, so an item says it is there as it arrives and
    // takes itself off again as it goes. One that says it again keeps the place it was written
    // in, so the arrow keys run down the list in the order it was laid out
    const [entries, setEntries] = React.useState<ComboboxItemEntry[]>([]);

    // What each item was last known as, kept after the list has been taken down and its items
    // with it, so the field can still be put back to the name of what is held
    const labels = React.useRef(new Map<string, string>());

    const register = React.useCallback((entry: ComboboxItemEntry) => {
        labels.current.set(entry.value, entry.label);

        setEntries((current) => {
            const at = current.findIndex((item) => item.value === entry.value);

            if (at === -1) {
                return [...current, entry];
            }

            const next = [...current];
            next[at] = entry;

            return next;
        });
    }, []);

    const unregister = React.useCallback((itemValue: string) => {
        setEntries((current) => current.filter((item) => item.value !== itemValue));
    }, []);

    // Matched the way the locale reads both sides rather than by code points, so that an accent
    // the reader cannot easily type still finds the item that carries one
    const { contains, startsWith } = useFilter({ sensitivity: "base" });
    const filter = filterProp ?? contains;

    const matches = React.useMemo(() => {
        if (!shouldFilter || !narrowed || inputValue === "") {
            return entries.map((entry) => entry.value);
        }

        return entries
            .filter((entry) => filter(entry.label, inputValue))
            .map((entry) => entry.value);
    }, [entries, filter, inputValue, narrowed, shouldFilter]);

    // An item that cannot be picked is still shown, but the arrows step over it rather than
    // stopping on something there is nothing to do with
    const navigable = React.useMemo(
        () => matches.filter((item) => !entries.find((entry) => entry.value === item)?.disabled),
        [entries, matches],
    );

    /* The item in hand */

    // It only stands while it is still one of the answers: a list narrowed out from under the
    // highlight leaves nothing in hand rather than pointing at a row that has gone
    const held = heldHighlight !== null && navigable.includes(heldHighlight) ? heldHighlight : null;

    // Where the combobox answers what is typed of its own accord, the first answer is taken in
    // hand as soon as there is something to answer
    const autoHighlights = inputBehavior !== "none";
    const highlightedValue =
        held ??
        (autoHighlights && open && narrowed && inputValue !== "" ? (navigable[0] ?? null) : null);

    const highlightedEntry = entries.find((entry) => entry.value === highlightedValue);

    // What the field would hold were the item in hand taken. Only a name that carries on from
    // what was typed is written in, since anything else would replace what the reader is part
    // way through rather than finish it
    const completion =
        inputBehavior === "autocomplete" &&
        open &&
        highlightedEntry !== undefined &&
        inputValue !== "" &&
        startsWith(highlightedEntry.label, inputValue)
            ? highlightedEntry.label
            : "";

    const announced = React.useRef(highlightedValue);

    React.useEffect(() => {
        if (announced.current !== highlightedValue) {
            announced.current = highlightedValue;
            onHighlightChange?.(highlightedValue);
        }
    }, [highlightedValue, onHighlightChange]);

    const moveHighlight = React.useCallback(
        (step: number) => {
            if (navigable.length === 0) {
                return;
            }

            const at = highlightedValue === null ? -1 : navigable.indexOf(highlightedValue);

            // Arriving with nothing in hand, the first item down and the last item up are where
            // the list is entered
            if (at === -1) {
                setHighlightedValue(step > 0 ? navigable[0] : navigable[navigable.length - 1]);
                return;
            }

            const next = at + step;
            const landing = loopFocus
                ? (next + navigable.length) % navigable.length
                : Math.min(Math.max(next, 0), navigable.length - 1);

            setHighlightedValue(navigable[landing]);
        },
        [highlightedValue, loopFocus, navigable, setHighlightedValue],
    );

    React.useEffect(() => {
        if (pending.current === null || navigable.length === 0) {
            return;
        }

        const end = pending.current;
        pending.current = null;

        // The list opens on whatever is already held, so that the arrow keys carry on from the
        // choice rather than from the end of the list
        const picked = value.find((item) => navigable.includes(item));

        setHighlightedValue(
            picked ?? (end === "first" ? navigable[0] : navigable[navigable.length - 1]),
        );
    }, [navigable, setHighlightedValue, value]);

    /* What the parts do */

    // Opening the list from anywhere but what is typed shows everything again, and closing it
    // leaves nothing narrowed for the next time it is reached for
    const setOpen = React.useCallback(
        (next: boolean) => {
            setNarrowed(false);
            changeOpen(next);
        },
        [changeOpen],
    );

    const openAt = React.useCallback(
        (end: "first" | "last") => {
            pending.current = end;
            setOpen(true);
        },
        [setOpen],
    );

    const onType = React.useCallback(
        (next: string) => {
            setInputValue(next);
            setNarrowed(true);
            // Typing puts the reader back at the top of what is left, rather than leaving them
            // resting on a row that has moved underneath them
            setHighlightedValue(null);

            if (openOnChange && !open) {
                changeOpen(true);
            }
        },
        [changeOpen, open, openOnChange, setHighlightedValue, setInputValue],
    );

    const isSelected = React.useCallback((itemValue: string) => value.includes(itemValue), [value]);

    const select = React.useCallback(
        (itemValue: string) => {
            const entry = entries.find((item) => item.value === itemValue);

            if (!entry || entry.disabled || disabled || readOnly) {
                return;
            }

            // A combobox holding one item at a time is answered outright; one holding several
            // takes an item it is already holding back off again
            const next = multiple
                ? value.includes(itemValue)
                    ? value.filter((item) => item !== itemValue)
                    : [...value, itemValue]
                : [itemValue];

            setValue(next);
            onSelect?.(itemValue);

            if (selectionBehavior === "replace") {
                setInputValue(entry.label);
            } else if (selectionBehavior === "clear") {
                setInputValue("");
            }

            setNarrowed(false);

            if (closeOnSelect) {
                changeOpen(false);
            }

            // Pressing an item never takes the caret off the field, and neither does taking one
            // with the keyboard, so the field is handed it back either way
            inputRef.current?.focus();
        },
        [
            changeOpen,
            closeOnSelect,
            disabled,
            entries,
            multiple,
            onSelect,
            readOnly,
            selectionBehavior,
            setInputValue,
            setValue,
            value,
        ],
    );

    const clear = React.useCallback(() => {
        if (disabled || readOnly) {
            return;
        }

        setValue([]);
        setInputValue("");
        setNarrowed(false);
        inputRef.current?.focus();
    }, [disabled, readOnly, setInputValue, setValue]);

    const getItemId = React.useCallback(
        (itemValue: string) => entries.find((entry) => entry.value === itemValue)?.id,
        [entries],
    );

    const isMatch = React.useCallback(
        (itemValue: string) => matches.includes(itemValue),
        [matches],
    );

    // Focus leaving the combobox altogether takes the list down. What was typed goes back to
    // what is held with it, since a field left holding the name of nothing would read as a
    // choice that had been made
    const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
        onBlur?.(event);

        const next = event.relatedTarget;

        if (
            next instanceof Node &&
            (rootRef.current?.contains(next) || contentRef.current?.contains(next))
        ) {
            return;
        }

        changeOpen(false);
        setNarrowed(false);

        if (allowCustomValue) {
            return;
        }

        // A field holding several is only ever a way of searching them, so it goes back to
        // empty. One holding a single choice goes back to the name of that choice, and is
        // left as it stands where the list has never been opened and that name is not known
        const known = value.length === 0 ? "" : labels.current.get(value[0]);
        const restored = multiple ? "" : known;

        if (restored !== undefined && inputValue !== restored) {
            setInputValue(restored);
        }
    };

    const context = React.useMemo(
        () => ({
            inputId,
            labelId,
            listId,
            getItemId,
            inputValue,
            completion,
            onType,
            setInputValue,
            value,
            isSelected,
            select,
            clear,
            open,
            setOpen,
            openAt,
            highlightedValue,
            setHighlightedValue,
            moveHighlight,
            entries,
            register,
            unregister,
            matches,
            isMatch,
            multiple,
            disabled,
            readOnly,
            invalid,
            required,
            placeholder,
            inputBehavior,
            openOnClick,
            openOnKeyPress,
            inputRef,
            controlRef,
            contentRef,
        }),
        [
            clear,
            completion,
            disabled,
            entries,
            getItemId,
            highlightedValue,
            inputBehavior,
            inputId,
            inputValue,
            invalid,
            isMatch,
            isSelected,
            labelId,
            listId,
            matches,
            moveHighlight,
            multiple,
            onType,
            open,
            openAt,
            openOnClick,
            openOnKeyPress,
            placeholder,
            readOnly,
            register,
            required,
            select,
            setHighlightedValue,
            setInputValue,
            setOpen,
            unregister,
            value,
        ],
    );

    return (
        <ComboboxContext.Provider value={context}>
            <div
                ref={mergedRef}
                className={classNames(classes.root, className)}
                onBlur={handleBlur}
                data-component="Combobox"
                data-open={open || undefined}
                data-multiple={multiple || undefined}
                data-disabled={disabled || undefined}
                data-readonly={readOnly || undefined}
                data-invalid={invalid || undefined}
                {...rest}
            >
                {children}

                {/* The field carries what was typed rather than what was picked, so what is
                    held is submitted through fields of its own, one for each of them */}
                {name
                    ? value.map((picked) => (
                          <input
                              key={picked}
                              type="hidden"
                              name={name}
                              value={picked}
                              form={form}
                          />
                      ))
                    : null}
            </div>
        </ComboboxContext.Provider>
    );
}

Combobox.displayName = "Combobox";

export default fixedForwardRef(Combobox);
