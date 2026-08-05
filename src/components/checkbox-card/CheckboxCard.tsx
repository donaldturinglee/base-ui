import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import Checkbox from "../checkbox/Checkbox";
import { CheckboxGroupContext } from "../checkbox-group/CheckboxGroupContext";
import { CheckboxCardContext } from "./CheckboxCardContext";
import CheckboxCardDescription from "./CheckboxCardDescription";
import CheckboxCardLabel from "./CheckboxCardLabel";
import CheckboxCardLeadingVisual from "./CheckboxCardLeadingVisual";
import type { CheckboxCardProps, CheckboxCardValidationStatus } from "./CheckboxCard.types";

const classes = {
    body: "checkbox-card-body",
    control: "checkbox-card-control",
};

const checkboxCardVariants = cva("checkbox-card", {
    variants: {
        disabled: {
            true: "checkbox-card-disabled",
            false: "checkbox-card-interactive",
        },
        validation: {
            error: "checkbox-card-error",
            success: "checkbox-card-success",
        } satisfies Record<CheckboxCardValidationStatus, string>,
    },
});

// An answer drawn as a card rather than as a box with a line of text beside it, for a set of
// answers that each need more said about them than their name and that are given by the reader
// in any number rather than one at a time.
//
// The card is a label, so anywhere on it ticks the checkbox it holds, and the checkbox stands at
// the end of the row: what a reader running down a stack of cards looks for is the ones that are
// ticked, and they find them in the same place on every card rather than at the front of lines
// of different lengths
function CheckboxCard(
    props: CheckboxCardProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        value,
        checked,
        defaultChecked,
        indeterminate,
        disabled: disabledProp,
        required,
        validationStatus,
        onChange,
        // The checkbox is what the card is for, so the id names the checkbox rather than the
        // label around it, and the parts of the card hang their own ids off it
        id: idProp,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    const group = React.useContext(CheckboxGroupContext);
    // A group standing around the card speaks for every answer in it
    const disabled = group.disabled || disabledProp;

    const inputId = useId(idProp);
    const labelId = `${inputId}-label`;
    const descriptionId = `${inputId}-description`;

    const [slots, extras] = useSlots(children, {
        leadingVisual: CheckboxCardLeadingVisual,
        label: CheckboxCardLabel,
        description: CheckboxCardDescription,
    });

    // The checkbox is named after the card's own line rather than after everything the card
    // holds, which the label around it would otherwise read out in full. A caller who has named
    // the checkbox themselves keeps that name
    const labelledBy = ariaLabelledBy ?? (slots.label && !ariaLabel ? labelId : undefined);

    const describedBy =
        [slots.description ? descriptionId : undefined, ariaDescribedBy]
            .filter(Boolean)
            .join(" ") || undefined;

    return (
        <CheckboxCardContext.Provider value={{ labelId, descriptionId }}>
            <label
                ref={ref}
                className={classNames(
                    checkboxCardVariants({
                        disabled: Boolean(disabled),
                        validation: validationStatus,
                    }),
                    className,
                )}
                data-component="CheckboxCard"
                data-disabled={disabled}
                data-required={required}
                data-validation={validationStatus}
                {...rest}
            >
                {slots.leadingVisual}

                {/* The name and whatever is said under it are read as one, so they stand
                    together and take whatever room the visual and the checkbox leave over */}
                <div className={classes.body}>
                    {slots.label}
                    {slots.description}
                    {extras}
                </div>

                <Checkbox
                    id={inputId}
                    value={value}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    indeterminate={indeterminate}
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
        </CheckboxCardContext.Provider>
    );
}

CheckboxCard.displayName = "CheckboxCard";

export default fixedForwardRef(CheckboxCard);
