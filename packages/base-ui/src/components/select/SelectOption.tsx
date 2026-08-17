import * as React from "react";
import { CheckmarkRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { SelectContext } from "./SelectContext";
import { SelectOptGroupContext } from "./SelectOptGroupContext";
import type { SelectOptionProps, SelectSize } from "./Select.types";

const classes = {
    // The mark keeps its place whether or not the option is picked, so the labels down the
    // list stay lined up with one another
    unmarked: "invisible",
    checkmark: "select-option-checkmark",
    label: "select-option-label",
};

const selectOptionVariants = cva("select-option", {
    variants: {
        size: {
            small: "select-option-small",
            medium: "select-option-medium",
            large: "select-option-large",
        } satisfies Record<SelectSize, string>,
        selected: {
            true: "select-option-selected",
            false: "",
        },
        active: {
            true: "select-option-active",
            false: "",
        },
        disabled: {
            true: "select-option-disabled",
            false: "",
        },
    },
});

// One of the choices a field offers. It never takes focus of its own: the field keeps it
// throughout and points at whichever option the arrow keys are resting on, so the list is read
// without the caret ever leaving the control
function SelectOption(
    props: SelectOptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        value,
        disabled: disabledProp,
        onClick,
        onMouseMove,
        ...rest
    } = props;

    const {
        size = "medium",
        value: selectedValue,
        activeValue,
        onSelect,
        setActiveValue,
        getOptionId,
    } = React.useContext(SelectContext);
    const group = React.useContext(SelectOptGroupContext);

    // A group standing around the option speaks for every choice in it
    const disabled = group.disabled || disabledProp;
    const selected = selectedValue === value;
    const active = activeValue === value;

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(event);

        if (event.defaultPrevented || disabled) {
            return;
        }

        onSelect?.(value);
    };

    // The pointer makes whatever it is over the option the field is pointing at, so that the
    // list draws a single highlight and what is under the pointer is what Enter would take.
    // Left to itself, the hover tint would stand as a second, weaker highlight beside the real
    // one
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        onMouseMove?.(event);

        if (event.defaultPrevented || disabled || active) {
            return;
        }

        setActiveValue?.(value);
    };

    return (
        <div
            ref={ref}
            id={getOptionId?.(value)}
            role="option"
            aria-selected={selected}
            // A div has no disabled state of its own, so an option that cannot be picked says
            // so rather than being switched off
            aria-disabled={disabled || undefined}
            className={classNames(
                selectOptionVariants({ size, selected, active, disabled }),
                className,
            )}
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            data-component="Select.Option"
            data-value={value}
            data-selected={selected || undefined}
            data-active={active || undefined}
            data-disabled={disabled || undefined}
            {...rest}
        >
            <CheckmarkRegular
                className={classNames(classes.checkmark, !selected && classes.unmarked)}
                aria-hidden="true"
            />
            <span className={classes.label}>{children}</span>
        </div>
    );
}

SelectOption.displayName = "Select.Option";

export default fixedForwardRef(SelectOption);
