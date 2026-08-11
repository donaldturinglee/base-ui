import * as React from "react";
import { ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Text } from "../text";
import { getCharacterCount, SCREEN_READER_DELAY } from "./characterCount";
import type { TextareaProps, TextareaResize, TextareaValidationStatus } from "./Textarea.types";

export const DEFAULT_TEXTAREA_ROWS = 7;
export const DEFAULT_TEXTAREA_COLS = 30;
export const DEFAULT_TEXTAREA_RESIZE: TextareaResize = "both";

const classes = {
    counter: "textarea-counter",
    counterOverLimit: "textarea-counter-over-limit",
    counterIcon: "textarea-counter-icon",
    hidden: "sr-only",
};

const textareaFieldVariants = cva("textarea-field", {
    variants: {
        block: {
            true: "textarea-field-block",
            false: "",
        },
        contrast: {
            true: "textarea-field-contrast",
            false: "",
        },
        disabled: {
            true: "textarea-field-disabled",
            false: "",
        },
        validation: {
            error: "textarea-field-error",
            success: "textarea-field-success",
        } satisfies Record<TextareaValidationStatus, string>,
    },
});

const textareaControlVariants = cva("textarea", {
    variants: {
        resize: {
            none: "textarea-resize-none",
            both: "textarea-resize-both",
            horizontal: "textarea-resize-horizontal",
            vertical: "textarea-resize-vertical",
        } satisfies Record<TextareaResize, string>,
    },
});

function Textarea(
    props: TextareaProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        value,
        defaultValue,
        onChange,
        rows = DEFAULT_TEXTAREA_ROWS,
        cols = DEFAULT_TEXTAREA_COLS,
        resize = DEFAULT_TEXTAREA_RESIZE,
        block,
        contrast,
        disabled,
        required,
        validationStatus,
        minHeight,
        maxHeight,
        characterLimit,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    const descriptionId = useId();

    // A controlled field is its own source of truth; an uncontrolled one only needs its
    // length, tracked here so the counter can be worked out while rendering
    const isControlled = value !== undefined;
    const [typedLength, setTypedLength] = React.useState(() =>
        defaultValue === undefined ? 0 : String(defaultValue).length,
    );
    const length = isControlled ? String(value).length : typedLength;

    const counter = characterLimit ? getCharacterCount(length, characterLimit) : undefined;
    const isOverLimit = counter?.isOverLimit ?? false;
    const status = isOverLimit ? "error" : validationStatus;

    const hasChanged = React.useRef(false);
    const [announcement, setAnnouncement] = React.useState("");
    const message = counter?.message;

    // The live region starts empty and is only filled once the reader has typed, so the
    // count is never read out on arrival
    React.useEffect(() => {
        if (!hasChanged.current) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setAnnouncement(message ?? "");
        }, SCREEN_READER_DELAY);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [message]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        hasChanged.current = true;

        if (characterLimit && !isControlled) {
            setTypedLength(event.target.value.length);
        }

        onChange?.(event);
    };

    return (
        <>
            <span
                className={classNames(
                    textareaFieldVariants({ block, contrast, disabled, validation: status }),
                    className,
                )}
                data-component="Textarea"
                data-block={block}
                data-contrast={contrast}
                data-disabled={disabled}
                data-validation={status}
            >
                <textarea
                    ref={ref}
                    value={value}
                    defaultValue={defaultValue}
                    rows={rows}
                    cols={cols}
                    disabled={disabled}
                    required={required}
                    aria-required={required ? true : undefined}
                    aria-invalid={status === "error" ? true : undefined}
                    aria-describedby={
                        characterLimit
                            ? [descriptionId, ariaDescribedBy].filter(Boolean).join(" ")
                            : ariaDescribedBy
                    }
                    onChange={handleChange}
                    className={classNames(textareaControlVariants({ resize }))}
                    style={{ minHeight, maxHeight, ...style }}
                    data-resize={resize}
                    {...rest}
                />
            </span>

            {counter ? (
                <>
                    <span role="status" aria-live="polite" className={classes.hidden}>
                        {announcement}
                    </span>
                    <span id={descriptionId} className={classes.hidden}>
                        You can enter up to {characterLimit}{" "}
                        {characterLimit === 1 ? "character" : "characters"}
                    </span>
                    {/* The count is announced through the live region above, so the visible
                        copy stays out of the accessibility tree */}
                    <Text
                        aria-hidden="true"
                        size="small"
                        className={classNames(
                            classes.counter,
                            isOverLimit && classes.counterOverLimit,
                        )}
                        data-component="Textarea.CharacterCount"
                    >
                        {isOverLimit ? (
                            <ErrorCircleRegular className={classes.counterIcon} />
                        ) : null}
                        {counter.message}
                    </Text>
                </>
            ) : null}
        </>
    );
}

Textarea.displayName = "Textarea";

export default fixedForwardRef(Textarea);
