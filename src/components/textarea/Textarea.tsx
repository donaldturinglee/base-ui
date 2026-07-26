import * as React from "react";
import { ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Text } from "../text";
import { getCharacterCount, SCREEN_READER_DELAY } from "./characterCount";
import type { TextareaProps, TextareaResize, TextareaValidationStatus } from "./Textarea.types";

export const DEFAULT_TEXTAREA_ROWS = 7;
export const DEFAULT_TEXTAREA_COLS = 30;
export const DEFAULT_TEXTAREA_RESIZE: TextareaResize = "both";

const classes = {
    // The wrapper carries the field styling so the native control can stay transparent and
    // keep its own resize handle
    field: "relative inline-flex items-stretch overflow-hidden align-middle rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--control-border-color-rest)] bg-[var(--background-color-default)] [color:var(--foreground-color-default)] [box-shadow:var(--shadow-inset)] [font-size:var(--text-body-size-medium)] leading-[var(--base-size-20)]",
    focus: "focus-within:border-[color:var(--border-color-accent-emphasis)] focus-within:outline-solid focus-within:outline-[length:var(--focus-outline-width)] focus-within:outline-[color:var(--focus-outline-color)] focus-within:-outline-offset-1",
    block: "flex w-full self-stretch",
    contrast: "bg-[var(--background-color-inset)]",
    disabled:
        "[color:var(--foreground-color-disabled)] bg-[var(--control-background-color-disabled)] border-[color:var(--control-border-color-disabled)] [box-shadow:none] [&_textarea]:cursor-not-allowed",
    validation: {
        error: "border-[color:var(--border-color-danger-emphasis)] focus-within:border-[color:var(--control-border-color-danger)] focus-within:outline-[color:var(--control-border-color-danger)]",
        success: "border-[color:var(--background-color-success-emphasis)]",
    } satisfies Record<TextareaValidationStatus, string>,
    // The field owns the focus ring, so the control inside it drops its own
    textarea:
        "w-full p-[var(--base-size-12)] bg-transparent border-0 outline-none appearance-none focus:outline-0 disabled:resize-none [font-family:inherit] [font-size:inherit] [color:inherit]",
    resize: {
        none: "resize-none",
        both: "resize",
        horizontal: "resize-x",
        vertical: "resize-y",
    } satisfies Record<TextareaResize, string>,
    counter:
        "flex items-center gap-[var(--control-xsmall-gap)] [color:var(--foreground-color-muted)]",
    counterOverLimit: "[color:var(--foreground-color-danger)]",
    counterIcon: "shrink-0 size-[var(--base-size-16)]",
    hidden: "sr-only",
};

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
                    classes.field,
                    classes.focus,
                    block && classes.block,
                    contrast && classes.contrast,
                    disabled && classes.disabled,
                    // Last, so a field that is both disabled and invalid still reads as
                    // invalid
                    status && classes.validation[status],
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
                    className={classNames(classes.textarea, classes.resize[resize])}
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
