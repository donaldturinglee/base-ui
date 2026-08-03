import * as React from "react";
import { useId } from "../../hooks/useId";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { isSlot } from "../../utilities/slot";
import Checkbox from "../checkbox/Checkbox";
import { CheckboxGroupContext } from "../checkbox-group/CheckboxGroupContext";
import Radio from "../radio/Radio";
import { RadioGroupContext } from "../radio-group/RadioGroupContext";
import Select from "../select/Select";
import Textarea from "../textarea/Textarea";
import TextInput from "../text-input/TextInput";
import FormControlCaption from "./FormControlCaption";
import { FormControlContext } from "./FormControlContext";
import FormControlLabel from "./FormControlLabel";
import FormControlLeadingVisual from "./FormControlLeadingVisual";
import FormControlValidation from "./FormControlValidation";
import type { SlotMarker } from "../../utilities/types/slots";
import type {
    FormControlInputProps,
    FormControlLabelProps,
    FormControlProps,
    FormControlValidationProps,
} from "./FormControl.types";

const classes = {
    vertical: "form-control-vertical",
    verticalWithLabel: "form-control-vertical-with-label",
    horizontal: "form-control-horizontal",
    horizontalWithLeadingVisual: "form-control-horizontal-with-leading-visual",
    choiceInput: "form-control-choice-input",
    labelContainer: "form-control-label-container",
};

// The inputs a field knows how to wire up. Anything else given to it is left to stand as it
// was written, and is wired up by the caller
const inputComponents: React.ElementType[] = [Checkbox, Radio, Select, Textarea, TextInput];

// An input is found by identity, or by the slot mark of one, so that a wrapper standing in
// for an input is still wired up as one
const isInput = (child: React.ReactNode, component: React.ElementType) =>
    React.isValidElement(child) &&
    (child.type === component || isSlot(child, component as SlotMarker));

function FormControl(
    props: FormControlProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        disabled: disabledProp,
        required,
        layout = "vertical",
        id: idProp,
        ...rest
    } = props;

    const [slots, childrenWithoutSlots] = useSlots(children, {
        label: FormControlLabel,
        caption: FormControlCaption,
        leadingVisual: FormControlLeadingVisual,
        validation: FormControlValidation,
    });

    const checkboxGroup = React.useContext(CheckboxGroupContext);
    const radioGroup = React.useContext(RadioGroupContext);
    // A group standing around the field speaks for every choice in it
    const disabled = checkboxGroup.disabled || radioGroup.disabled || disabledProp;

    const id = useId(idProp);
    const captionId = slots.caption ? `${id}-caption` : undefined;
    const validationMessageId = slots.validation ? `${id}-validation` : undefined;

    const label = React.isValidElement<FormControlLabelProps>(slots.label)
        ? slots.label
        : undefined;
    const labelId = label ? (label.props.id ?? `${id}-label`) : undefined;
    const isLabelVisible = label ? !label.props.visuallyHidden : false;

    const validationStatus = React.isValidElement<FormControlValidationProps>(slots.validation)
        ? slots.validation.props.variant
        : undefined;

    const input = childrenWithoutSlots.find((child) =>
        inputComponents.some((component) => isInput(child, component)),
    );
    // A checkbox or a radio is named by the label beside it rather than by one above it, so
    // it reads across whatever layout was asked for
    const isChoiceInput = isInput(input, Checkbox) || isInput(input, Radio);
    const isRadioInput = isInput(input, Radio);
    const isHorizontal = isChoiceInput || layout === "horizontal";

    // Whatever is left over stands where it was written, so a field can hold more than the
    // one control it wires up
    const remainingChildren = childrenWithoutSlots.filter((child) => child !== input);

    const context = {
        id,
        disabled,
        required,
        captionId,
        validationMessageId,
        labelId,
    };

    const wiredInput = React.isValidElement<FormControlInputProps>(input)
        ? React.cloneElement(
              input,
              isHorizontal
                  ? {
                        id,
                        disabled,
                        // A radio is never required on its own: a group of them is required
                        // together, since one of them is always the answer
                        required: required && !isRadioInput,
                        // A validation message belongs to the whole group, so the box beside
                        // it is described by its own caption alone
                        "aria-describedby": captionId,
                    }
                  : {
                        id,
                        disabled,
                        required,
                        validationStatus,
                        "aria-describedby":
                            [validationMessageId, captionId].filter(Boolean).join(" ") || undefined,
                        // Whatever the caller set on the input itself stands, so a field can
                        // still be wired up by hand where it has to be
                        ...input.props,
                    },
          )
        : null;

    return (
        <FormControlContext.Provider value={context}>
            {isHorizontal ? (
                <div
                    ref={ref}
                    className={classNames(
                        classes.horizontal,
                        slots.leadingVisual && classes.horizontalWithLeadingVisual,
                        className,
                    )}
                    data-component="FormControl"
                    data-layout="horizontal"
                    data-disabled={disabled}
                    data-required={required}
                    data-has-leading-visual={slots.leadingVisual ? true : undefined}
                    {...rest}
                >
                    <div className={classes.choiceInput}>
                        {wiredInput}
                        {remainingChildren}
                    </div>
                    {slots.leadingVisual}
                    {/* The name and the caption are read as one, so they stand together
                        beside the box rather than either side of it */}
                    <div className={classes.labelContainer}>
                        {slots.label}
                        {slots.caption}
                    </div>
                </div>
            ) : (
                <div
                    ref={ref}
                    className={classNames(
                        classes.vertical,
                        isLabelVisible && classes.verticalWithLabel,
                        className,
                    )}
                    data-component="FormControl"
                    data-layout="vertical"
                    data-disabled={disabled}
                    data-required={required}
                    data-has-label={isLabelVisible ? true : undefined}
                    {...rest}
                >
                    {slots.label}
                    {wiredInput}
                    {remainingChildren}
                    {slots.validation}
                    {slots.caption}
                </div>
            )}
        </FormControlContext.Provider>
    );
}

FormControl.displayName = "FormControl";

export default fixedForwardRef(FormControl);
