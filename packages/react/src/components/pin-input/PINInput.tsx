import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TextInput } from "../text-input";
import type { TextInputSize } from "../text-input/TextInput.types";
import type { PINInputProps, PINInputType } from "./PINInput.types";

const classes = {
    root: "pin-input",
};

const DEFAULT_LENGTH = 6;

const pinInputBoxVariants = cva("pin-input-box", {
    variants: {
        size: {
            small: "pin-input-box-small",
            medium: "pin-input-box-medium",
            large: "pin-input-box-large",
        } satisfies Record<TextInputSize, string>,
    },
});

// What each kind of code will take. Anything else is dropped rather than shown and then
// complained about, since a box holding one character has no room to say what was wrong with it
const patterns = {
    numeric: /[0-9]/,
    alphanumeric: /[0-9a-zA-Z]/,
} satisfies Record<PINInputType, RegExp>;

const sanitize = (text: string, type: PINInputType) =>
    Array.from(text)
        .filter((character) => patterns[type].test(character))
        .join("");

// A code typed into a row of boxes, one character to each, for the codes that arrive by message
// or come off an authenticator.
//
// The code is a string and the boxes are a view of it: box one shows its first character, box
// two its second. That is what keeps a code the caller is holding and the boxes on screen saying
// the same thing, and it is why emptying a box in the middle closes the gap rather than leaving
// one — the same as taking a character out of the middle of a field of running text.
//
// A reader who aims past the end of what has been typed is put where the next character would
// go, so a code can never be left with a hole in it in the first place
function PINInput(
    props: PINInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        length = DEFAULT_LENGTH,
        value: valueProp,
        defaultValue = "",
        type = "numeric",
        mask = false,
        size = "medium",
        disabled,
        readOnly,
        required,
        validationStatus,
        autoFocus,
        autoComplete,
        boxLabel = "Digit",
        onChange,
        onComplete,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const boxRefs = React.useRef<(HTMLInputElement | null)[]>([]);

    // A group the caller is holding follows them; one left to itself keeps its own code
    const isControlled = valueProp !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = React.useState(() =>
        sanitize(defaultValue, type).slice(0, length),
    );
    const value = isControlled ? valueProp : uncontrolledValue;

    const characters = Array.from({ length }, (_, index) => value[index] ?? "");
    // The first box with nothing in it, which is as far along as the reader can be
    const firstEmpty = characters.findIndex((character) => character === "");

    // Held while the group is moving focus itself, so that the redirect below only ever answers
    // a reader aiming at a box rather than the group putting them somewhere on purpose
    const isMovingFocus = React.useRef(false);

    const focusBox = (index: number) => {
        const box = boxRefs.current[index];

        isMovingFocus.current = true;
        box?.focus();
        // What is already in the box is taken, so the next character typed replaces it rather
        // than being turned away by a box that is already full
        box?.select();
        isMovingFocus.current = false;
    };

    const commit = (next: string) => {
        if (!isControlled) {
            setUncontrolledValue(next);
        }

        onChange?.(next);

        if (next.length === length) {
            onComplete?.(next);
        }
    };

    // Writes what arrived into this box and the ones after it, which is what a code pasted in or
    // filled in by the browser needs, and leaves the reader on the box after the last one written
    const fillFrom = (index: number, text: string) => {
        const typed = sanitize(text, type);

        if (typed.length === 0) {
            return;
        }

        // A character can only go where the next one belongs, so a reader who has moved past the
        // end of the code writes at the end of it rather than leaving a hole behind them
        const start = firstEmpty === -1 ? index : Math.min(index, firstEmpty);

        const next = [...characters];
        let cursor = start;

        Array.from(typed).forEach((character) => {
            if (cursor < length) {
                next[cursor] = character;
                cursor += 1;
            }
        });

        commit(next.join(""));
        focusBox(Math.min(cursor, length - 1));
    };

    const clearAt = (index: number) => {
        const next = [...characters];
        next[index] = "";

        commit(next.join(""));
    };

    const handleFocus = (index: number) => {
        if (isMovingFocus.current) {
            return;
        }

        const target = firstEmpty === -1 ? index : Math.min(index, firstEmpty);

        if (target !== index) {
            focusBox(target);
        }
    };

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === "") {
            clearAt(index);
            return;
        }

        fillFrom(index, event.target.value);
    };

    const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
        if (disabled || readOnly) {
            return;
        }

        // Taken over so that the whole code lands across the boxes rather than the first
        // character of it landing in one and the rest being turned away
        event.preventDefault();
        fillFrom(index, event.clipboardData.getData("text"));
    };

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (disabled || readOnly) {
            return;
        }

        if (event.key === "Backspace") {
            event.preventDefault();

            // A box with something in it is emptied where it stands; an empty one hands the
            // reader back to the box before it and empties that instead
            if (characters[index] !== "") {
                clearAt(index);
                return;
            }

            if (index > 0) {
                clearAt(index - 1);
                focusBox(index - 1);
            }

            return;
        }

        if (event.key === "Delete") {
            event.preventDefault();
            clearAt(index);
            return;
        }

        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            focusBox(index - 1);
            return;
        }

        if (event.key === "ArrowRight" && index < length - 1) {
            event.preventDefault();
            focusBox(index + 1);
            return;
        }

        if (event.key === "Home") {
            event.preventDefault();
            focusBox(0);
            return;
        }

        if (event.key === "End") {
            event.preventDefault();
            focusBox(length - 1);
        }
    };

    return (
        <div
            ref={ref}
            // The boxes are only worth grouping once there is a name to group them under: an
            // unnamed group says nothing but that it is one
            role={ariaLabel || ariaLabelledBy ? "group" : undefined}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            className={classNames(classes.root, className)}
            data-component="PINInput"
            data-size={size}
            data-disabled={disabled}
            data-validation={validationStatus}
            {...rest}
        >
            {characters.map((character, index) => (
                <TextInput
                    key={index}
                    ref={(element: HTMLInputElement | null) => {
                        boxRefs.current[index] = element;
                    }}
                    type={mask ? "password" : "text"}
                    inputMode={type === "numeric" ? "numeric" : "text"}
                    size={size}
                    value={character}
                    maxLength={1}
                    disabled={disabled}
                    readOnly={readOnly}
                    required={required}
                    validationStatus={validationStatus}
                    // Only the first box is worth arriving in, and only where the caller asked
                    autoFocus={autoFocus && index === 0}
                    // Only the first box is offered the code, since that is where a message
                    // fills it in before it is spread across the rest
                    autoComplete={index === 0 ? autoComplete : "off"}
                    aria-label={`${boxLabel} ${index + 1} of ${length}`}
                    onChange={(event) => handleChange(index, event)}
                    onKeyDown={(event) => handleKeyDown(index, event)}
                    onPaste={(event) => handlePaste(index, event)}
                    onFocus={() => handleFocus(index)}
                    className={classNames(pinInputBoxVariants({ size }))}
                    data-component="PINInput.Box"
                />
            ))}
        </div>
    );
}

PINInput.displayName = "PINInput";

export default fixedForwardRef(PINInput);
