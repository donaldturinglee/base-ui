import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import BlankslateAction from "./BlankslateAction";
import type { BlankslatePrimaryActionProps } from "./Blankslate.types";

// Lays out the main call to action. Supply the control itself as the children, so the
// blankslate does not have to take a view on what a primary button looks like.
function BlankslatePrimaryAction(
    props: BlankslatePrimaryActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    return <BlankslateAction ref={ref} data-component="Blankslate.PrimaryAction" {...props} />;
}

BlankslatePrimaryAction.displayName = "Blankslate.PrimaryAction";

export default fixedForwardRef(BlankslatePrimaryAction);
