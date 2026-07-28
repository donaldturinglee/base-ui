import * as React from "react";
import { ErrorCircleRegular } from "@gamecrafters/base-ui-icons";
import { isValidElementType } from "react-is";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Spinner } from "../spinner";
import { Text } from "../text";
import { getCharacterCount, SCREEN_READER_DELAY } from "../textarea/characterCount";
import type {
    TextInputProps,
    TextInputSize,
    TextInputValidationStatus,
    TextInputVisual,
} from "./TextInput.types";

const classes = {
    // The wrapper carries the field styling so the native control can stay transparent, and
    // so the visuals beside it can sit within the border. The action size lives here as well,
    // so an action inside the field is sized by the field it stands in
    field: "relative inline-flex items-stretch overflow-hidden align-middle cursor-text gap-[var(--base-size-8)] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--control-border-color-rest)] bg-[var(--background-color-default)] [color:var(--foreground-color-default)] [box-shadow:var(--shadow-inset)]",
    size: {
        small: "min-h-[var(--control-small-size)] py-[var(--control-small-padding-block)] leading-[var(--base-size-20)] [font-size:var(--text-body-size-small)] [--text-input-action-size:var(--base-size-20)]",
        medium: "min-h-[var(--control-medium-size)] leading-[var(--base-size-20)] [font-size:var(--text-body-size-medium)] [--text-input-action-size:var(--base-size-24)]",
        large: "min-h-[var(--control-large-size)] py-[var(--control-large-padding-block)] leading-[var(--base-size-20)] [font-size:var(--text-body-size-medium)] [--text-input-action-size:var(--base-size-28)]",
    } satisfies Record<TextInputSize, string>,
    focus: "focus-within:border-[color:var(--border-color-accent-emphasis)] focus-within:outline-solid focus-within:outline-[length:var(--focus-outline-width)] focus-within:outline-[color:var(--focus-outline-color)] focus-within:-outline-offset-1",
    // With an action inside the field, the ring follows the typing area alone, so reaching
    // for the action does not light the whole field up
    focusTracked:
        "border-[color:var(--border-color-accent-emphasis)] outline-solid outline-[length:var(--focus-outline-width)] outline-[color:var(--focus-outline-color)] -outline-offset-1",
    block: "flex w-full self-stretch",
    contrast: "bg-[var(--background-color-inset)]",
    monospace: "[font-family:var(--font-stack-monospace)]",
    disabled:
        "[color:var(--foreground-color-disabled)] bg-[var(--control-background-color-disabled)] border-[color:var(--control-border-color-disabled)] [box-shadow:none] [&_input]:cursor-not-allowed",
    validation: {
        error: "border-[color:var(--border-color-danger-emphasis)]",
        success: "border-[color:var(--background-color-success-emphasis)]",
    } satisfies Record<TextInputValidationStatus, string>,
    // An invalid field keeps its own colour in the ring, drawn the same two ways
    validationFocus:
        "focus-within:border-[color:var(--control-border-color-danger)] focus-within:outline-[color:var(--control-border-color-danger)]",
    validationFocusTracked:
        "border-[color:var(--control-border-color-danger)] outline-[color:var(--control-border-color-danger)]",
    // A visual stands within the field's own padding; the typing area takes over the padding
    // on whichever side has no visual to stand in it
    leadingVisual: "ps-[var(--base-size-8)]",
    leadingVisualLarge: "ps-[var(--base-size-12)]",
    trailingVisual: "pe-[var(--base-size-8)]",
    trailingVisualLarge: "pe-[var(--base-size-12)]",
    // The field owns the focus ring, so the control inside it drops its own. A flex item is
    // allowed to shrink past the width an input asks for
    input: "w-full min-w-0 p-0 bg-transparent border-0 outline-none appearance-none cursor-text focus:outline-0 disabled:cursor-not-allowed [font-family:inherit] [font-size:inherit] [color:inherit] placeholder:[color:var(--foreground-color-muted)]",
    inputPadStart: "ps-[var(--base-size-8)]",
    inputPadStartWide: "ps-[var(--base-size-12)]",
    inputPadEnd: "pe-[var(--base-size-8)]",
    inputPadEndWide: "pe-[var(--base-size-12)]",
    visual: "flex self-center shrink-0 [color:var(--foreground-color-muted)]",
    // The spinner is laid over the visual it stands in for, so the field keeps its width as
    // the wait starts and ends
    visualBox: "relative flex",
    spinner: "absolute top-0 right-0 max-w-full h-full",
    spinnerLeading: "left-0",
    spinnerHidden: "invisible",
    spinnerVisible: "visible",
    counter:
        "flex items-center gap-[var(--control-xsmall-gap)] [color:var(--foreground-color-muted)]",
    counterOverLimit: "[color:var(--foreground-color-danger)]",
    counterIcon: "shrink-0 size-[var(--base-size-16)]",
    hidden: "sr-only",
};

// Date and time inputs are focused segment by segment, so a click that landed on one of them
// is left to the browser
const segmentedTypes = ["date", "time", "datetime-local"];

// Anything that can stand as a component is called with no props of its own, which covers a
// plain function, a memo and a forwarded ref alike. A string is a label such as a unit or a
// currency sign rather than an intrinsic tag, and everything else is already built
const renderVisual = (visual: TextInputVisual): React.ReactNode => {
    if (typeof visual === "string" || !isValidElementType(visual)) {
        return visual as React.ReactNode;
    }

    const Visual = visual;

    return <Visual />;
};

const TextInputVisualSlot = ({
    id,
    position,
    hasLoader,
    showLoader,
    children,
}: React.PropsWithChildren<{
    id: string;
    position: "leading" | "trailing";
    // Whether a spinner could ever stand here, and so whether room is kept for one
    hasLoader: boolean;
    showLoader: boolean;
}>) => {
    const name = position === "leading" ? "TextInput.LeadingVisual" : "TextInput.TrailingVisual";

    if (!hasLoader) {
        return (
            <span id={id} className={classes.visual} aria-hidden="true" data-component={name}>
                {children}
            </span>
        );
    }

    return (
        <span className={classes.visual} data-component={name}>
            <span id={id} className={classes.visualBox}>
                {children ? (
                    <span className={showLoader ? classes.spinnerHidden : classes.spinnerVisible}>
                        {children}
                    </span>
                ) : null}
                <Spinner
                    srText={null}
                    size={children ? undefined : "small"}
                    className={classNames(
                        showLoader ? classes.spinnerVisible : classes.spinnerHidden,
                        children && classes.spinner,
                        children && position === "leading" && classes.spinnerLeading,
                    )}
                />
            </span>
        </span>
    );
};

function TextInput(
    props: TextInputProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        type = "text",
        size = "medium",
        block,
        contrast,
        monospace,
        disabled,
        required,
        validationStatus,
        leadingVisual,
        trailingVisual,
        trailingAction,
        loading,
        loaderPosition = "auto",
        loaderText = "Loading",
        characterLimit,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    const inputRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, inputRef);

    const leadingVisualId = useId();
    const trailingVisualId = useId();
    const loadingId = useId();
    const descriptionId = useId();

    const [isFocused, setIsFocused] = React.useState(false);

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

    // A spinner takes the place of a leading visual where there is one, and otherwise stands
    // after the typing area
    const showLeadingLoader = Boolean(
        loading &&
        (loaderPosition === "leading" || (leadingVisual && loaderPosition !== "trailing")),
    );
    const showTrailingLoader = Boolean(
        loading && (loaderPosition === "trailing" || (loaderPosition === "auto" && !leadingVisual)),
    );
    // Room is kept for the spinner as soon as the caller says the field can wait at all, so
    // the trailing end does not shift once it starts
    const hasLoader = typeof loading === "boolean";

    const hasLeadingVisual = Boolean(leadingVisual) || showLeadingLoader;
    const hasTrailingVisual = Boolean(trailingVisual) || showTrailingLoader;
    const hasTrailingAction = Boolean(trailingAction);
    const showTrailingSlot = Boolean(trailingVisual) || hasLoader;

    // An action inside the field is the only part of it that can be pressed, so the ring is
    // tied to the typing area rather than to anything the field holds
    const tracksFocus = hasTrailingAction;
    const isLarge = size === "large";

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(event);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        hasChanged.current = true;

        if (characterLimit && !isControlled) {
            setTypedLength(event.target.value.length);
        }

        onChange?.(event);
    };

    // The padding either side of the typing area is part of the field, so clicking it puts
    // the reader where they were aiming
    const handleFieldClick = (event: React.MouseEvent<HTMLSpanElement>) => {
        if (event.target !== inputRef.current || !segmentedTypes.includes(type)) {
            inputRef.current?.focus();
        }
    };

    const describedBy =
        [
            characterLimit ? descriptionId : undefined,
            ariaDescribedBy,
            leadingVisual ? leadingVisualId : undefined,
            trailingVisual ? trailingVisualId : undefined,
            loading ? loadingId : undefined,
        ]
            .filter(Boolean)
            .join(" ") || undefined;

    return (
        <>
            <span
                className={classNames(
                    classes.field,
                    classes.size[size],
                    tracksFocus ? isFocused && classes.focusTracked : classes.focus,
                    block && classes.block,
                    contrast && classes.contrast,
                    monospace && classes.monospace,
                    disabled && classes.disabled,
                    // The validation colours come last, so a field that is both disabled and
                    // invalid still reads as invalid
                    status && classes.validation[status],
                    status === "error" &&
                        (tracksFocus
                            ? isFocused && classes.validationFocusTracked
                            : classes.validationFocus),
                    hasLeadingVisual &&
                        (isLarge ? classes.leadingVisualLarge : classes.leadingVisual),
                    hasTrailingVisual &&
                        !hasTrailingAction &&
                        (isLarge ? classes.trailingVisualLarge : classes.trailingVisual),
                    className,
                )}
                onClick={handleFieldClick}
                aria-busy={loading ? true : undefined}
                data-component="TextInput"
                data-size={size}
                data-block={block}
                data-contrast={contrast}
                data-monospace={monospace}
                data-disabled={disabled}
                data-validation={status}
                data-focused={isFocused || undefined}
                data-leading-visual={hasLeadingVisual || undefined}
                data-trailing-visual={hasTrailingVisual || undefined}
                data-trailing-action={hasTrailingAction || undefined}
            >
                {hasLeadingVisual ? (
                    <TextInputVisualSlot
                        id={leadingVisualId}
                        position="leading"
                        hasLoader={hasLoader}
                        showLoader={showLeadingLoader}
                    >
                        {leadingVisual ? renderVisual(leadingVisual) : null}
                    </TextInputVisualSlot>
                ) : null}

                <input
                    ref={mergedRef}
                    type={type}
                    value={value}
                    defaultValue={defaultValue}
                    disabled={disabled}
                    required={required}
                    aria-required={required ? true : undefined}
                    aria-invalid={status === "error" ? true : undefined}
                    aria-describedby={describedBy}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={classNames(
                        classes.input,
                        !hasLeadingVisual &&
                            (hasTrailingVisual || hasTrailingAction
                                ? classes.inputPadStart
                                : classes.inputPadStartWide),
                        !hasTrailingVisual &&
                            !hasTrailingAction &&
                            (hasLeadingVisual ? classes.inputPadEnd : classes.inputPadEndWide),
                    )}
                    data-component="TextInput.Input"
                    {...rest}
                />

                {loading ? (
                    <span id={loadingId} className={classes.hidden}>
                        {loaderText}
                    </span>
                ) : null}

                {showTrailingSlot ? (
                    <TextInputVisualSlot
                        id={trailingVisualId}
                        position="trailing"
                        hasLoader={hasLoader}
                        showLoader={showTrailingLoader}
                    >
                        {trailingVisual ? renderVisual(trailingVisual) : null}
                    </TextInputVisualSlot>
                ) : null}

                {trailingAction}
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
                        data-component="TextInput.CharacterCount"
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

TextInput.displayName = "TextInput";

export default fixedForwardRef(TextInput);
