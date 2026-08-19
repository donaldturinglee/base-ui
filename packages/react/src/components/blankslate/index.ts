import BlankslateBase from "./Blankslate";
import BlankslateDescription from "./BlankslateDescription";
import BlankslateHeading from "./BlankslateHeading";
import BlankslatePrimaryAction from "./BlankslatePrimaryAction";
import BlankslateSecondaryAction from "./BlankslateSecondaryAction";
import BlankslateVisual from "./BlankslateVisual";

export const Blankslate = Object.assign(BlankslateBase, {
    Visual: BlankslateVisual,
    Heading: BlankslateHeading,
    Description: BlankslateDescription,
    PrimaryAction: BlankslatePrimaryAction,
    SecondaryAction: BlankslateSecondaryAction,
});

export {
    BlankslateVisual,
    BlankslateHeading,
    BlankslateDescription,
    BlankslatePrimaryAction,
    BlankslateSecondaryAction,
};
export * from "./Blankslate.types";
