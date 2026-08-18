import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ComboboxContext, ComboboxItemContext, ComboboxItemGroupContext } from "./ComboboxContext";
import type { ComboboxItemProps } from "./Combobox.types";

const classes = {
    hidden: "hidden",
};

const comboboxItemVariants = cva("combobox-item", {
    variants: {
        selected: {
            true: "combobox-item-selected",
            false: "",
        },
        highlighted: {
            true: "combobox-item-highlighted",
            false: "",
        },
        disabled: {
            true: "combobox-item-disabled",
            false: "",
        },
    },
});

// One of the things the combobox is offering. It says what it reads as by its own text unless
// it is given a name outright, and never takes focus of its own: the field keeps the caret and
// points at whichever item is in hand, so the list is read without the caret ever leaving it
function ComboboxItem(
    props: ComboboxItemProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        value,
        label: labelProp,
        disabled = false,
        onSelect,
        className,
        children,
        onClick,
        onPointerMove,
        ...rest
    } = props;

    const id = useId();
    const combobox = React.useContext(ComboboxContext);
    const group = React.useContext(ComboboxItemGroupContext);

    const elementRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, elementRef);

    // An item with no name of its own is known by the text it was written with, which is not
    // there to be read until it has been drawn
    const [label, setLabel] = React.useState(labelProp ?? "");

    useIsomorphicLayoutEffect(() => {
        if (labelProp !== undefined) {
            setLabel(labelProp);
            return;
        }

        // Where the item names itself outright the name is what it reads as; where it does
        // not, whatever it was written with stands in, marks and all
        const element = elementRef.current;
        const named = element?.querySelector('[data-component="Combobox.ItemText"]');

        setLabel(((named ?? element)?.textContent ?? "").trim());
    }, [labelProp, children]);

    // The list is held apart from the items, so an item says it is there as it arrives and
    // takes itself off again as it goes
    const register = combobox?.register;
    const unregister = combobox?.unregister;
    const groupId = group?.groupId;

    React.useEffect(() => {
        if (!register || !unregister || label === "") {
            return;
        }

        register({ value, label, id, groupId, disabled });

        return () => {
            unregister(value);
        };
    }, [disabled, groupId, id, label, register, unregister, value]);

    const selected = combobox?.isSelected(value) ?? false;
    const highlighted = combobox?.highlightedValue === value;

    // An item that has not said it is there yet is still drawn, so that the list is never empty
    // for the moment between arriving and being counted
    const isCounted = combobox?.entries.some((entry) => entry.value === value) ?? false;
    const isShown = !isCounted || (combobox?.isMatch(value) ?? true);

    // The item in hand is brought into view as the reader runs down the list past the end of
    // what can be seen
    React.useEffect(() => {
        if (highlighted) {
            // Not every environment offers it, and the list reads well enough without being
            // scrolled where it is not there to be asked
            elementRef.current?.scrollIntoView?.({ block: "nearest" });
        }
    }, [highlighted]);

    const context = React.useMemo(
        () => ({ value, selected, highlighted, disabled }),
        [disabled, highlighted, selected, value],
    );

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        onSelect?.(value);
        combobox?.select(value);
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        onPointerMove?.(event);

        // Followed on movement rather than on arrival, so that scrolling the list under a
        // still pointer does not take the item in hand away from the reader
        if (!event.defaultPrevented && !disabled && !highlighted) {
            combobox?.setHighlightedValue(value);
        }
    };

    return (
        <ComboboxItemContext.Provider value={context}>
            <div
                ref={mergedRef}
                id={id}
                role="option"
                aria-selected={selected}
                // A div has no disabled state of its own, so an item that cannot be picked
                // says so rather than being switched off
                aria-disabled={disabled || undefined}
                className={classNames(
                    comboboxItemVariants({ selected, highlighted, disabled }),
                    !isShown && classes.hidden,
                    className,
                )}
                onClick={handleClick}
                onPointerMove={handlePointerMove}
                data-component="Combobox.Item"
                data-value={value}
                data-selected={selected || undefined}
                data-highlighted={highlighted || undefined}
                data-disabled={disabled || undefined}
                {...rest}
            >
                {children}
            </div>
        </ComboboxItemContext.Provider>
    );
}

ComboboxItem.displayName = "Combobox.Item";

export default fixedForwardRef(ComboboxItem);
