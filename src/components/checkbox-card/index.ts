import CheckboxCardBase from "./CheckboxCard";
import CheckboxCardDescription from "./CheckboxCardDescription";
import CheckboxCardLabel from "./CheckboxCardLabel";
import CheckboxCardLeadingVisual from "./CheckboxCardLeadingVisual";

export const CheckboxCard = Object.assign(CheckboxCardBase, {
    LeadingVisual: CheckboxCardLeadingVisual,
    Label: CheckboxCardLabel,
    Description: CheckboxCardDescription,
});

export { CheckboxCardLeadingVisual, CheckboxCardLabel, CheckboxCardDescription };
export { CheckboxCardContext } from "./CheckboxCardContext";
export * from "./CheckboxCard.types";
