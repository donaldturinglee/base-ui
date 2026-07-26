import CheckboxGroupBase from "./CheckboxGroup";
import CheckboxGroupCaption from "./CheckboxGroupCaption";
import CheckboxGroupLabel from "./CheckboxGroupLabel";
import CheckboxGroupValidation from "./CheckboxGroupValidation";

export const CheckboxGroup = Object.assign(CheckboxGroupBase, {
    Label: CheckboxGroupLabel,
    Caption: CheckboxGroupCaption,
    Validation: CheckboxGroupValidation,
});

export { CheckboxGroupLabel, CheckboxGroupCaption, CheckboxGroupValidation };
export { CheckboxGroupContext } from "./CheckboxGroupContext";
export * from "./CheckboxGroup.types";
