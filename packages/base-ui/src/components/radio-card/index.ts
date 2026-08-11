import RadioCardBase from "./RadioCard";
import RadioCardDescription from "./RadioCardDescription";
import RadioCardLabel from "./RadioCardLabel";
import RadioCardLeadingVisual from "./RadioCardLeadingVisual";

export const RadioCard = Object.assign(RadioCardBase, {
    LeadingVisual: RadioCardLeadingVisual,
    Label: RadioCardLabel,
    Description: RadioCardDescription,
});

export { RadioCardLeadingVisual, RadioCardLabel, RadioCardDescription };
export { RadioCardContext } from "./RadioCardContext";
export * from "./RadioCard.types";
