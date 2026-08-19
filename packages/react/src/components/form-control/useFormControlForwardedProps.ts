import * as React from "react";
import { FormControlContext } from "./FormControlContext";
import type { FormControlForwardedProps } from "./FormControl.types";

// Wires a control of the caller's own into the field around it, so that it is given the same
// id, state and description as one the field already knows how to wire up. Outside a
// FormControl it hands back what it was given
export const useFormControlForwardedProps = <Props>(
    externalProps: Props,
): Props & FormControlForwardedProps => {
    const { id, disabled, required, captionId, validationMessageId } =
        React.useContext(FormControlContext);

    return {
        id,
        disabled,
        required,
        "aria-describedby": [validationMessageId, captionId].filter(Boolean).join(" ") || undefined,
        // Whatever the caller set stands, so a control can still be wired up by hand where it
        // has to be
        ...externalProps,
    };
};
