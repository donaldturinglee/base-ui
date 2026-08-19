import TourBase, { DEFAULT_SPOTLIGHT_OFFSET, DEFAULT_SPOTLIGHT_RADIUS } from "./Tour";
import TourActions from "./TourActions";
import TourActionTrigger from "./TourActionTrigger";
import TourArrow from "./TourArrow";
import TourBackdrop from "./TourBackdrop";
import TourCloseTrigger from "./TourCloseTrigger";
import TourContent from "./TourContent";
import TourControl from "./TourControl";
import TourDescription from "./TourDescription";
import TourPositioner from "./TourPositioner";
import TourProgressText from "./TourProgressText";
import TourSpotlight from "./TourSpotlight";
import TourTitle from "./TourTitle";

export const Tour = Object.assign(TourBase, {
    Backdrop: TourBackdrop,
    Spotlight: TourSpotlight,
    Positioner: TourPositioner,
    Content: TourContent,
    Arrow: TourArrow,
    CloseTrigger: TourCloseTrigger,
    ProgressText: TourProgressText,
    Title: TourTitle,
    Description: TourDescription,
    Control: TourControl,
    Actions: TourActions,
    ActionTrigger: TourActionTrigger,
});

export {
    TourBackdrop,
    TourSpotlight,
    TourPositioner,
    TourContent,
    TourArrow,
    TourCloseTrigger,
    TourProgressText,
    TourTitle,
    TourDescription,
    TourControl,
    TourActions,
    TourActionTrigger,
};
export { DEFAULT_SPOTLIGHT_OFFSET, DEFAULT_SPOTLIGHT_RADIUS };
export { TourContext, TourPositionerContext } from "./TourContext";
export { useTour } from "./useTour";
export { waitForElement, waitForElementValue, waitForEvent } from "./waitFor";
export type { TourWait, TourWaitOptions, TourWaitForEventOptions } from "./waitFor";
export * from "./Tour.types";
