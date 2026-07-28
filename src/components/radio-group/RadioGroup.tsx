import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import RadioGroupCaption from "./RadioGroupCaption";
import { RadioGroupContext } from "./RadioGroupContext";
import RadioGroupLabel from "./RadioGroupLabel";
import RadioGroupValidation from "./RadioGroupValidation";
import type { RadioGroupProps } from "./RadioGroup.types";

const classes = {
    root: "p-0 m-0 border-none",
    legend: "p-0",
    legendVisible: "mb-[var(--base-size-8)]",
    // The circles stack, each one spaced from the last
    body: "flex flex-col list-none p-0 m-0 [&>*+*]:mt-[var(--base-size-8)]",
    validation: "mt-[var(--base-size-8)]",
    hidden: "sr-only",
};

function RadioGroup<As extends React.ElementType = "fieldset">(
    props: RadioGroupProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "fieldset",
        className,
        children,
        name,
        disabled,
        required,
        onChange,
        id: idProp,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props as RadioGroupProps<"fieldset">;

    const [slots, radios] = useSlots(children, {
        label: RadioGroupLabel,
        caption: RadioGroupCaption,
        validation: RadioGroupValidation,
    });

    const id = useId(idProp);
    const captionId = slots.caption ? `${id}-caption` : undefined;
    const validationMessageId = slots.validation ? `${id}-validation` : undefined;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.currentTarget;

        // Only the radio that has just been checked reports, since the browser clears the one
        // before it without a change event of its own. The selection is never more than the
        // value this event carries, so the group keeps no state of its own
        if (!checked) {
            return;
        }

        onChange?.(value, event);
    };

    const isLabelVisible = React.isValidElement<{ visuallyHidden?: boolean }>(slots.label)
        ? !slots.label.props.visuallyHidden
        : false;

    const context = {
        name,
        disabled,
        required,
        captionId,
        validationMessageId,
        onChange: handleChange,
    };

    return (
        <RadioGroupContext.Provider value={context}>
            <Component
                ref={ref}
                id={id}
                disabled={disabled}
                aria-labelledby={slots.label ? undefined : ariaLabelledBy}
                aria-describedby={
                    [validationMessageId, captionId].filter(Boolean).join(" ") || undefined
                }
                className={classNames(classes.root, className)}
                data-component="RadioGroup"
                data-disabled={disabled}
                data-required={required}
                {...rest}
            >
                {slots.label ? (
                    // The caption and the validation message sit in the legend as well, so
                    // a screen reader reads them as part of the group's name
                    <legend
                        className={classNames(
                            classes.legend,
                            isLabelVisible && classes.legendVisible,
                        )}
                    >
                        {slots.label}
                        {required ? <span className={classes.hidden}>, required</span> : null}
                        {slots.caption}
                    </legend>
                ) : (
                    slots.caption
                )}

                <div className={classes.body}>{radios}</div>

                {slots.validation ? (
                    <div className={classes.validation}>{slots.validation}</div>
                ) : null}
            </Component>
        </RadioGroupContext.Provider>
    );
}

RadioGroup.displayName = "RadioGroup";

export default fixedForwardRef(RadioGroup);
