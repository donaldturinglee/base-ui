import * as React from "react";
import { ChevronDownRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOnEscapePress } from "../../hooks/useOnEscapePress";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import { SelectContext } from "./SelectContext";
import SelectOptGroup from "./SelectOptGroup";
import SelectOption from "./SelectOption";
import type { AnchoredPosition } from "../tooltip/anchoredPosition";
import type {
    SelectOptGroupProps,
    SelectOptionEntry,
    SelectOptionProps,
    SelectProps,
    SelectSize,
    SelectValidationStatus,
} from "./Select.types";

const classes = {
    control: "select-control",
    value: "select-value",
    placeholder: "select-placeholder",
    indicator: "select-indicator",
};

const selectFieldVariants = cva("select", {
    variants: {
        size: {
            small: "select-small",
            medium: "select-medium",
            large: "select-large",
        } satisfies Record<SelectSize, string>,
        block: {
            true: "select-block",
            false: "",
        },
        disabled: {
            true: "select-disabled",
            false: "",
        },
        validation: {
            error: "select-error",
            success: "select-success",
        } satisfies Record<SelectValidationStatus, string>,
    },
});

const selectListVariants = cva(
    [
        "select-list",
        // It arrives from the edge of the field it stands off, which says where it came from
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[side=outside-bottom]:slide-in-from-top-2 motion-safe:data-[side=outside-top]:slide-in-from-bottom-2",
    ],
    {
        variants: {
            // The list is drawn to the size of the field it was opened from, so the two read as
            // the one control rather than as a surface of its own standing under a field
            size: {
                small: "select-list-small",
                medium: "select-list-medium",
                large: "select-list-large",
            } satisfies Record<SelectSize, string>,
            // Held back until it has been placed, so it is never seen where it does not belong
            unplaced: {
                true: "invisible",
                false: "",
            },
        },
    },
);

// The keys that open the list from the field, which are the ones that would open a menu
const openKeys = ["ArrowDown", "ArrowUp", " ", "Enter"];

// How long a run of keystrokes is read as one word before the next one starts a search of its
// own
const TYPE_AHEAD_TIMEOUT = 500;

const isOption = (child: React.ReactNode): child is React.ReactElement<SelectOptionProps> =>
    React.isValidElement(child) && child.type === SelectOption;

const isOptGroup = (child: React.ReactNode): child is React.ReactElement<SelectOptGroupProps> =>
    React.isValidElement(child) && child.type === SelectOptGroup;

// A fragment is not a row of the list but a way of writing several of them at once, and
// `React.Children` hands it back whole rather than opening it up
const isFragment = (
    child: React.ReactNode,
): child is React.ReactElement<{ children?: React.ReactNode }> =>
    React.isValidElement(child) && child.type === React.Fragment;

// What an option reads as, so that typing at the field can be matched against it. Whatever the
// label is drawn out of is read through, since what the reader sees is what they type for
const readText = (node: React.ReactNode): string =>
    React.Children.toArray(node)
        .map((child) => {
            if (typeof child === "string" || typeof child === "number") {
                return String(child);
            }

            return React.isValidElement<{ children?: React.ReactNode }>(child)
                ? readText(child.props.children)
                : "";
        })
        .join("");

// What the field is offering, gathered from the options the caller wrote. A group is read
// through rather than counted, so the options under it stand in the one order the arrow keys
// move along
const collectOptions = (children: React.ReactNode, groupDisabled = false): SelectOptionEntry[] =>
    React.Children.toArray(children).flatMap((child) => {
        if (isFragment(child)) {
            return collectOptions(child.props.children, groupDisabled);
        }

        if (isOptGroup(child)) {
            const { children: options, disabled } = child.props;

            return collectOptions(options, groupDisabled || Boolean(disabled));
        }

        if (isOption(child)) {
            const { value, children: label, disabled } = child.props;

            return [
                {
                    value,
                    label,
                    text: readText(label),
                    disabled: groupDisabled || Boolean(disabled),
                },
            ];
        }

        return [];
    });

// Whether the list ended up where it already was, which is the only thing worth not rendering
// it again for
const isSamePosition = (one: AnchoredPosition, other: AnchoredPosition) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign;

// A field that is answered from a list of its own rather than from the one the browser draws,
// so that the choices can be styled and marked up like everything else on the page. It is read
// as a combo box: focus stays on the control throughout and the control points at whichever
// option the keys are resting on. Where the browser's own list will do, NativeSelect is the
// lighter thing to reach for
function Select(
    props: SelectProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        placeholder,
        size = "medium",
        block,
        disabled,
        required,
        validationStatus,
        value: valueProp,
        defaultValue,
        onChange,
        name,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
        side = "outside-bottom",
        align = "start",
        id: idProp,
        onClick,
        onKeyDown,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const id = useId(idProp);
    const listId = `${id}-list`;

    const fieldRef = React.useRef<HTMLSpanElement>(null);
    const controlRef = React.useRef<HTMLButtonElement>(null);
    const mergedControlRef = useMergedRefs(ref, controlRef);
    const listRef = React.useRef<HTMLDivElement>(null);

    /* The choice */

    const options = React.useMemo(() => collectOptions(children), [children]);
    // An option that cannot be picked is passed over rather than rested on, since where the
    // field is pointing says what Enter will take
    const pickableOptions = React.useMemo(
        () => options.filter((option) => !option.disabled),
        [options],
    );

    // A field the caller is holding the value of takes what is picked from the prop; one that
    // is not keeps its own
    const isControlled = valueProp !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue);
    const value = isControlled ? valueProp : selfValue;

    const selectedOption = options.find((option) => option.value === value);

    const select = React.useCallback(
        (nextValue: string) => {
            if (!isControlled) {
                setSelfValue(nextValue);
            }

            onChange?.(nextValue);
        },
        [isControlled, onChange],
    );

    /* Whether the list is showing */

    const isOpenControlled = openProp !== undefined;
    const [selfOpen, setSelfOpen] = React.useState(defaultOpen);
    const open = isOpenControlled ? openProp : selfOpen;

    const setOpen = React.useCallback(
        (next: boolean) => {
            if (!isOpenControlled) {
                setSelfOpen(next);
            }

            onOpenChange?.(next);
        },
        [isOpenControlled, onOpenChange],
    );

    /* Where the keys are resting */

    const [activeValue, setActiveValue] = React.useState<string>();
    const activeIndex = pickableOptions.findIndex((option) => option.value === activeValue);

    const getOptionId = React.useCallback(
        (optionValue: string) => {
            const index = options.findIndex((option) => option.value === optionValue);

            // An option the field is not offering has no id of the list's to be pointed at by
            return index === -1 ? undefined : `${listId}-option-${index}`;
        },
        [options, listId],
    );

    // The list opens on whatever is already picked, so that the arrow keys carry on from the
    // choice rather than from the top of the list
    const openAt = (end: "first" | "last") => {
        if (selectedOption && !selectedOption.disabled) {
            return selectedOption.value;
        }

        return (end === "first" ? pickableOptions[0] : pickableOptions.at(-1))?.value;
    };

    const moveActiveTo = (index: number) => {
        if (pickableOptions.length === 0) {
            return;
        }

        // The ends are held rather than come round, which is how a select is stepped through
        const held = Math.min(Math.max(index, 0), pickableOptions.length - 1);
        setActiveValue(pickableOptions[held].value);
    };

    const close = React.useCallback(() => {
        setOpen(false);
        // The field keeps the caret, so it is given it back wherever the list was left from
        controlRef.current?.focus();
    }, [setOpen]);

    const handleSelect = React.useCallback(
        (nextValue: string) => {
            select(nextValue);
            setActiveValue(nextValue);
            close();
        },
        [select, close],
    );

    /* Typing at the field */

    const typeAhead = React.useRef({ query: "", at: 0 });

    const findByTypeAhead = (key: string) => {
        const now = Date.now();
        const continuing = now - typeAhead.current.at <= TYPE_AHEAD_TIMEOUT;
        const query = (continuing ? typeAhead.current.query : "") + key;

        typeAhead.current = { query, at: now };

        // A word still being typed is matched from where the field is resting; a fresh one
        // starts at the option after it, so the same letter pressed again steps through the
        // options that begin with it rather than resting on the first
        const from = continuing ? Math.max(activeIndex, 0) : activeIndex + 1;
        const lowered = query.toLowerCase();

        return [...pickableOptions.slice(from), ...pickableOptions.slice(0, from)].find((option) =>
            option.text.toLowerCase().startsWith(lowered),
        );
    };

    /* The field */

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (open) {
            setOpen(false);
            return;
        }

        setActiveValue(openAt("first"));
        setOpen(true);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(event);

        // A key pressed with a modifier belongs to the browser or the page, not to the field
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
            return;
        }

        if (!open) {
            if (openKeys.includes(event.key)) {
                // Taking the key keeps the page from scrolling away underneath the list, and
                // the button from being pressed a second time by the press that opened it
                event.preventDefault();
                setActiveValue(openAt(event.key === "ArrowUp" ? "last" : "first"));
                setOpen(true);
                return;
            }
        } else {
            // Tabbing away closes the list and leaves the choice as it was, since focus is
            // going somewhere the list cannot follow
            if (event.key === "Tab") {
                setOpen(false);
                return;
            }

            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();

                if (activeValue !== undefined) {
                    handleSelect(activeValue);
                }

                return;
            }

            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
                const step = event.key === "ArrowDown" ? 1 : -1;
                // Arriving with the field resting nowhere, the first option down and the last
                // option up are where the list is entered
                moveActiveTo(
                    activeIndex === -1
                        ? step === 1
                            ? 0
                            : pickableOptions.length - 1
                        : activeIndex + step,
                );
                return;
            }

            if (event.key === "Home" || event.key === "End") {
                event.preventDefault();
                moveActiveTo(event.key === "Home" ? 0 : pickableOptions.length - 1);
                return;
            }
        }

        // A key that stands for a single character is read as part of the option being typed
        // for; anything longer is a key in its own right rather than a letter
        if (event.key.length !== 1) {
            return;
        }

        const match = findByTypeAhead(event.key);

        if (!match) {
            return;
        }

        event.preventDefault();

        if (open) {
            setActiveValue(match.value);
            return;
        }

        // With the list closed there is no highlight to move, so typing picks outright, which
        // is what the browser's own field does
        select(match.value);
    };

    useOnEscapePress((event) => {
        if (!open) {
            return;
        }

        // Taking the event keeps a layer the field stands in from being dismissed by the same
        // press that closed the list
        event.preventDefault();
        close();
    });

    // A press anywhere else dismisses the list, which is what a surface standing over the page
    // rather than in it needs
    React.useEffect(() => {
        if (!open) {
            return;
        }

        const handlePress = (event: MouseEvent | TouchEvent) => {
            const { target } = event;

            if (!(target instanceof Node)) {
                return;
            }

            // A press on the field is left to the field, which closes the list itself
            if (listRef.current?.contains(target) || fieldRef.current?.contains(target)) {
                return;
            }

            setOpen(false);
        };

        document.addEventListener("mousedown", handlePress);
        document.addEventListener("touchstart", handlePress);

        return () => {
            document.removeEventListener("mousedown", handlePress);
            document.removeEventListener("touchstart", handlePress);
        };
    }, [open, setOpen]);

    /* Placement */

    const placedRef = React.useRef<AnchoredPosition | null>(null);
    const [position, setPosition] = React.useState<AnchoredPosition | null>(null);
    // The list is drawn at least as wide as the field it belongs to, the way the browser's own
    // list is, so it reads as the field opened up rather than as a menu beside it
    const [fieldWidth, setFieldWidth] = React.useState(0);

    const updatePosition = React.useCallback(() => {
        const field = fieldRef.current;
        const list = listRef.current;

        if (!field || !list) {
            return;
        }

        setFieldWidth(field.getBoundingClientRect().width);

        const placed = getAnchoredPosition(list, field, { side, align });

        if (placedRef.current && isSamePosition(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPosition(placed);
    }, [side, align]);

    // Placed before the browser paints, so the list is never seen standing anywhere but against
    // its field
    useIsomorphicLayoutEffect(() => {
        if (!open) {
            // Forgotten, so that a list opened again is placed from scratch rather than from
            // wherever it was last time
            placedRef.current = null;
            setPosition(null);
            return;
        }

        updatePosition();

        // The field moves whenever the page is laid out again, and the list moves with whatever
        // it grows to hold
        const observer = new ResizeObserver(updatePosition);

        if (listRef.current) {
            observer.observe(listRef.current);
        }

        window.addEventListener("resize", updatePosition);
        // Caught on the way down, so that a list standing over a scrolling region follows its
        // field as the region is scrolled rather than only the page
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, updatePosition]);

    // The option the field is pointing at is brought into view, since focus is not on it to
    // bring it there
    React.useEffect(() => {
        if (!open || activeValue === undefined) {
            return;
        }

        const list = listRef.current;
        const activeId = getOptionId(activeValue);
        const option = activeId ? document.getElementById(activeId) : null;

        if (!list || !option) {
            return;
        }

        const listBox = list.getBoundingClientRect();
        const optionBox = option.getBoundingClientRect();

        if (optionBox.top < listBox.top) {
            list.scrollTop -= listBox.top - optionBox.top;
        } else if (optionBox.bottom > listBox.bottom) {
            list.scrollTop += optionBox.bottom - listBox.bottom;
        }
    }, [open, activeValue, getOptionId]);

    const contextValue = React.useMemo(
        () => ({
            size,
            value,
            activeValue,
            onSelect: handleSelect,
            setActiveValue,
            getOptionId,
        }),
        [size, value, activeValue, handleSelect, getOptionId],
    );

    return (
        <span
            ref={fieldRef}
            className={classNames(
                selectFieldVariants({
                    size,
                    block,
                    disabled,
                    validation: validationStatus,
                }),
                className,
            )}
            data-component="Select"
            data-size={size}
            data-block={block}
            data-disabled={disabled}
            data-validation={validationStatus}
            data-open={open || undefined}
        >
            <button
                ref={mergedControlRef}
                id={id}
                type="button"
                role="combobox"
                disabled={disabled}
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                aria-haspopup="listbox"
                aria-expanded={open}
                // Named only while the list is standing, since there is nothing to point at
                // once it has been taken down
                aria-controls={open ? listId : undefined}
                aria-activedescendant={
                    open && activeValue !== undefined ? getOptionId(activeValue) : undefined
                }
                aria-required={required || undefined}
                aria-invalid={validationStatus === "error" ? true : undefined}
                className={classes.control}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                data-has-placeholder={Boolean(placeholder) || undefined}
                {...rest}
            >
                <span className={classNames(classes.value, !selectedOption && classes.placeholder)}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDownRegular className={classes.indicator} aria-hidden="true" />
            </button>

            {/* The button carries nothing a form would read, so what is picked is submitted
                through a field of its own */}
            {name ? <input type="hidden" name={name} value={value ?? ""} /> : null}

            {open ? (
                <Portal>
                    <div
                        ref={listRef}
                        id={listId}
                        role="listbox"
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledBy}
                        // Focus never comes here, but the list is still stepped over rather
                        // than added to the page's own order
                        tabIndex={-1}
                        className={classNames(selectListVariants({ size, unplaced: !position }))}
                        style={
                            {
                                "--select-list-top": `${position?.top ?? 0}px`,
                                "--select-list-left": `${position?.left ?? 0}px`,
                                "--select-list-field-width": `${fieldWidth}px`,
                            } as React.CSSProperties
                        }
                        // Pressing an option must not take focus off the field, or the list
                        // would be dismissed by the very press that was picking from it
                        onMouseDown={(event) => event.preventDefault()}
                        data-component="Select.List"
                        data-size={size}
                        data-side={position?.anchorSide ?? side}
                        data-align={position?.anchorAlign ?? align}
                    >
                        <SelectContext.Provider value={contextValue}>
                            {children}
                        </SelectContext.Provider>
                    </div>
                </Portal>
            ) : null}
        </span>
    );
}

Select.displayName = "Select";

export default fixedForwardRef(Select);
