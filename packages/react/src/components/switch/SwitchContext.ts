import { createContext, useContext } from "react";
import type { SwitchContextValue } from "./Switch.types";

export const SwitchContext = createContext<SwitchContextValue>({});

// What the switch around a part is holding, for a control of the caller's own standing among the
// parts. A control standing on its own has no switch to read, and reaches for useSwitch
export const useSwitchContext = () => useContext(SwitchContext);

// What every part says about the switch it stands in. The input is the one that holds the state,
// but it stands out of sight and the track, the thumb and the words beside them are what the
// switch is seen as, so each of them carries the state as well and a stylesheet can draw any of
// them from it. A state that does not apply is left off rather than answered "false", so a
// selector can ask whether it is there
export const getStateAttributes = ({
    checked,
    disabled,
    readOnly,
    required,
    invalid,
}: SwitchContextValue) => ({
    "data-state": checked ? "checked" : "unchecked",
    "data-disabled": disabled || undefined,
    "data-readonly": readOnly || undefined,
    "data-required": required || undefined,
    "data-invalid": invalid || undefined,
});
