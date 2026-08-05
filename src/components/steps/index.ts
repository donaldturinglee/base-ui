import StepsBase, { DEFAULT_CURRENT_STEP } from "./Steps";
import StepsBody from "./StepsBody";
import StepsDescription from "./StepsDescription";
import StepsIndicator from "./StepsIndicator";
import StepsItem from "./StepsItem";
import StepsTitle from "./StepsTitle";

export const Steps = Object.assign(StepsBase, {
    Item: StepsItem,
    Indicator: StepsIndicator,
    Body: StepsBody,
    Title: StepsTitle,
    Description: StepsDescription,
});

export { StepsItem, StepsIndicator, StepsBody, StepsTitle, StepsDescription };
export { DEFAULT_CURRENT_STEP };
export { StepsItemContext } from "./StepsItemContext";
export { useStepsItem } from "./useStepsItem";
export * from "./Steps.types";
