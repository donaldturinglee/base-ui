import RadioGroupBase from "./RadioGroup";
import RadioGroupCaption from "./RadioGroupCaption";
import RadioGroupLabel from "./RadioGroupLabel";
import RadioGroupValidation from "./RadioGroupValidation";

export const RadioGroup = Object.assign(RadioGroupBase, {
    Label: RadioGroupLabel,
    Caption: RadioGroupCaption,
    Validation: RadioGroupValidation,
});

export { RadioGroupLabel, RadioGroupCaption, RadioGroupValidation };
export { RadioGroupContext } from "./RadioGroupContext";
export * from "./RadioGroup.types";
