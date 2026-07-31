import FormControlBase from "./FormControl";
import FormControlCaption from "./FormControlCaption";
import FormControlLabel from "./FormControlLabel";
import FormControlLeadingVisual from "./FormControlLeadingVisual";
import FormControlValidation from "./FormControlValidation";

export const FormControl = Object.assign(FormControlBase, {
    Label: FormControlLabel,
    Caption: FormControlCaption,
    LeadingVisual: FormControlLeadingVisual,
    Validation: FormControlValidation,
});

export { FormControlLabel, FormControlCaption, FormControlLeadingVisual, FormControlValidation };
export { FormControlContext } from "./FormControlContext";
export { useFormControlForwardedProps } from "./useFormControlForwardedProps";
export * from "./FormControl.types";
