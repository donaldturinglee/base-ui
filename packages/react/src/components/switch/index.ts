import SwitchBase from "./Switch";
import SwitchControl from "./SwitchControl";
import SwitchHiddenInput from "./SwitchHiddenInput";
import SwitchLabel from "./SwitchLabel";
import SwitchRootProvider from "./SwitchRootProvider";
import SwitchThumb from "./SwitchThumb";

export const Switch = Object.assign(SwitchBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a switch written out in full is written the way it is read
    Root: SwitchBase,
    RootProvider: SwitchRootProvider,
    Control: SwitchControl,
    Thumb: SwitchThumb,
    Label: SwitchLabel,
    HiddenInput: SwitchHiddenInput,
});

export { SwitchRootProvider, SwitchControl, SwitchThumb, SwitchLabel, SwitchHiddenInput };
export { SwitchContext, useSwitchContext } from "./SwitchContext";
export { useSwitch } from "./useSwitch";
export * from "./Switch.types";
