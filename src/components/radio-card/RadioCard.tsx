import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import Radio from "../radio/Radio";
import { RadioGroupContext } from "../radio-group/RadioGroupContext";
import { RadioCardContext } from "./RadioCardContext";
import RadioCardDescription from "./RadioCardDescription";
import RadioCardLabel from "./RadioCardLabel";
import RadioCardLeadingVisual from "./RadioCardLeadingVisual";
import type { RadioCardProps, RadioCardValidationStatus } from "./RadioCard.types";

const classes = {
    body: "radio-card-body",
    control: "radio-card-control",
};

const radioCardVariants = cva("radio-card", {
    variants: {
        disabled: {
            true: "radio-card-disabled",
            false: "radio-card-interactive",
        },
        validation: {
            error: "radio-card-error",
            success: "radio-card-success",
        } satisfies Record<RadioCardValidationStatus, string>,
    },
});

// A choice drawn as a card rather than as a circle with a line of text beside it, for a set of
// answers that each need more said about them than their name.
//
// The card is a label, so anywhere on it picks the radio it holds, and the radio stands at the
// end of the row: what a reader comparing a stack of cards looks for is the one that is filled,
// and they find it in the same place on every card rather than at the front of lines of
// different lengths
function RadioCard(
    props: RadioCardProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        value,
        name,
        checked,
        defaultChecked,
        disabled: disabledProp,
        required,
        validationStatus,
        onChange,
        // The radio is what the card is for, so the id names the radio rather than the label
        // around it, and the parts of the card hang their own ids off it
        id: idProp,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    const group = React.useContext(RadioGroupContext);
    // A group standing around the card speaks for every choice in it
    const disabled = group.disabled || disabledProp;

    const inputId = useId(idProp);
    const labelId = `${inputId}-label`;
    const descriptionId = `${inputId}-description`;

    const [slots, extras] = useSlots(children, {
        leadingVisual: RadioCardLeadingVisual,
        label: RadioCardLabel,
        description: RadioCardDescription,
    });

    // The radio is named after the card's own line rather than after everything the card holds,
    // which the label around it would otherwise read out in full. A caller who has named the
    // radio themselves keeps that name
    const labelledBy = ariaLabelledBy ?? (slots.label && !ariaLabel ? labelId : undefined);

    const describedBy =
        [slots.description ? descriptionId : undefined, ariaDescribedBy]
            .filter(Boolean)
            .join(" ") || undefined;

    return (
        <RadioCardContext.Provider value={{ labelId, descriptionId }}>
            <label
                ref={ref}
                className={classNames(
                    radioCardVariants({
                        disabled: Boolean(disabled),
                        validation: validationStatus,
                    }),
                    className,
                )}
                data-component="RadioCard"
                data-disabled={disabled}
                data-required={required}
                data-validation={validationStatus}
                {...rest}
            >
                {slots.leadingVisual}

                {/* The name and whatever is said under it are read as one, so they stand
                    together and take whatever room the visual and the radio leave over */}
                <div className={classes.body}>
                    {slots.label}
                    {slots.description}
                    {extras}
                </div>

                <Radio
                    id={inputId}
                    value={value}
                    name={name}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    disabled={disabled}
                    required={required}
                    validationStatus={validationStatus}
                    onChange={onChange}
                    aria-label={ariaLabel}
                    aria-labelledby={labelledBy}
                    aria-describedby={describedBy}
                    className={classes.control}
                />
            </label>
        </RadioCardContext.Provider>
    );
}

RadioCard.displayName = "RadioCard";

export default fixedForwardRef(RadioCard);
