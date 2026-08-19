import * as React from "react";
import { ChevronDownRegular, ChevronUpRegular } from "@gamecrafters/base-ui-icons";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { TextInput } from "../text-input";
import { readValue, stepValue } from "./numberValue";
import type { NumberInputProps } from "./NumberInput.types";

const classes = {
    root: "number-input",
    stepper: "number-input-stepper",
    step: "number-input-step",
};

const DEFAULT_STEP = 1;

type NumberInputStepperProps = {
    incrementLabel: string;
    decrementLabel: string;
    canIncrement: boolean;
    canDecrement: boolean;
    onIncrement: () => void;
    onDecrement: () => void;
};

// The two halves are stacked, so the pair takes no more room across the field than one of them
// would. Neither is a tab stop: the field steps by the same amount on the arrow keys, so a
// reader on the keyboard is already able to do this without them, and two more stops in every
// number field on a form is a poor trade for nothing gained
const NumberInputStepper = ({
    incrementLabel,
    decrementLabel,
    canIncrement,
    canDecrement,
    onIncrement,
    onDecrement,
}: NumberInputStepperProps) => (
    <span className={classes.stepper} data-component="NumberInput.Stepper">
        <IconButton
            type="button"
            variant="invisible"
            size="small"
            icon={ChevronUpRegular}
            aria-label={incrementLabel}
            disabled={!canIncrement}
            tabIndex={-1}
            onClick={onIncrement}
            className={classes.step}
            data-component="NumberInput.Increment"
        />
        <IconButton
            type="button"
            variant="invisible"
            size="small"
            icon={ChevronDownRegular}
            aria-label={decrementLabel}
            disabled={!canDecrement}
            tabIndex={-1}
            onClick={onDecrement}
            className={classes.step}
            data-component="NumberInput.Decrement"
        />
    </span>
);

// A field for one number, with a stepper beside it for moving that number a step at a time.
//
// It is a text input underneath, so it is sized and coloured and validated the way every other
// field on the page is. What it adds is the arithmetic: the ends the value is held between, the
// step it moves by, and a stepper that stops at either end rather than running past it
function NumberInput(
    props: NumberInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        value,
        defaultValue,
        min,
        max,
        step = DEFAULT_STEP,
        disabled,
        readOnly,
        hideStepper = false,
        incrementLabel = "Increase",
        decrementLabel = "Decrease",
        onChange,
        ...rest
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);

    // A field the caller is holding follows them; one left to itself keeps its own value, which
    // is tracked here as well because the stepper has to know what it is stepping from
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<number | null>(
        defaultValue ?? null,
    );
    const current = isControlled ? value : uncontrolledValue;

    const setValue = (next: number | null, event?: React.ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setUncontrolledValue(next);
        }

        onChange?.(next, event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(readValue(event.target), event);
    };

    const handleStep = (direction: 1 | -1) => {
        const next = stepValue(current, direction, { step, min, max });

        // An uncontrolled field is written to directly as well: nothing else is holding the
        // value the browser is showing, and the stepper reports rather than fires a change
        if (!isControlled && inputRef.current) {
            inputRef.current.value = String(next);
        }

        setValue(next);
        // The reader was aiming at the field, not at the arrow, so that is where they are left
        inputRef.current?.focus();
    };

    // A field with nothing in it has not reached either end yet, since the first press lands on
    // the floor rather than a step past it
    const atMax = current !== null && current !== undefined && max !== undefined && current >= max;
    const atMin = current !== null && current !== undefined && min !== undefined && current <= min;
    const isFixed = Boolean(disabled) || Boolean(readOnly);

    return (
        <TextInput
            ref={mergedRef}
            type="number"
            value={isControlled ? (current ?? "") : undefined}
            defaultValue={isControlled ? undefined : defaultValue}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            readOnly={readOnly}
            onChange={handleChange}
            className={classNames(classes.root, className)}
            trailingAction={
                hideStepper ? undefined : (
                    <NumberInputStepper
                        incrementLabel={incrementLabel}
                        decrementLabel={decrementLabel}
                        canIncrement={!isFixed && !atMax}
                        canDecrement={!isFixed && !atMin}
                        onIncrement={() => handleStep(1)}
                        onDecrement={() => handleStep(-1)}
                    />
                )
            }
            // The field around it stays a TextInput, which is what it is; this names the part
            // the number field itself contributes
            data-component="NumberInput"
            {...rest}
        />
    );
}

NumberInput.displayName = "NumberInput";

export default fixedForwardRef(NumberInput);
