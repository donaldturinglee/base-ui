import * as React from "react";
import { ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Text } from "../text";
import { getCharacterCount, SCREEN_READER_DELAY } from "./characterCount";
import type { TextareaProps, TextareaResize, TextareaValidationStatus } from "./Textarea.types";

export const DEFAULT_TEXTAREA_ROWS = 7;
export const DEFAULT_TEXTAREA_COLS = 30;
export const DEFAULT_TEXTAREA_RESIZE: TextareaResize = "both";

const classes = {
    counter: "flex items-center gap-[var(--control-xsmall-gap)] text-foreground-muted",
    counterOverLimit: "text-foreground-danger",
    counterIcon: "shrink-0 size-[var(--base-size-16)]",
    hidden: "sr-only",
};

const textareaFieldVariants = cva(
    [
        // The wrapper carries the field styling so the native control can stay transparent and
        // keep its own resize handle
        "relative inline-flex items-stretch overflow-hidden align-middle rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--control-border-color-rest)] bg-background-default text-foreground-default [box-shadow:var(--shadow-inset)] [font-size:var(--text-body-size-medium)] leading-[var(--base-size-20)]",
        "focus-within:border-border-accent-emphasis focus-within:outline-solid focus-within:outline-[length:var(--focus-outline-width)] focus-within:outline-[color:var(--focus-outline-color)] focus-within:-outline-offset-1",
    ],
    {
        variants: {
            block: {
                true: "flex w-full self-stretch",
                false: "",
            },
            contrast: {
                true: "bg-background-inset",
                false: "",
            },
            disabled: {
                true: "text-foreground-disabled bg-[var(--control-background-color-disabled)] border-[color:var(--control-border-color-disabled)] [box-shadow:none] [&_textarea]:cursor-not-allowed",
                false: "",
            },
            // Last, so a field that is both disabled and invalid still reads as invalid
            validation: {
                error: "border-border-danger-emphasis focus-within:border-[color:var(--control-border-color-danger)] focus-within:outline-[color:var(--control-border-color-danger)]",
                success: "border-background-success-emphasis",
            } satisfies Record<TextareaValidationStatus, string>,
        },
    },
);

const textareaControlVariants = cva(
    // The field owns the focus ring, so the control inside it drops its own
    "w-full p-[var(--base-size-12)] bg-transparent border-0 outline-none appearance-none focus:outline-0 disabled:resize-none [font-family:inherit] [font-size:inherit] [color:inherit]",
    {
        variants: {
            resize: {
                none: "resize-none",
                both: "resize",
                horizontal: "resize-x",
                vertical: "resize-y",
            } satisfies Record<TextareaResize, string>,
        },
    },
);

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
