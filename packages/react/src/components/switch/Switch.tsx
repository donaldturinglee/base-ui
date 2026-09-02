import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import SwitchRootProvider from "./SwitchRootProvider";
import { useSwitch } from "./useSwitch";
import type { SwitchProps } from "./Switch.types";

// Something that is either on or off, and is turned rather than picked: a track with a thumb that
// slides along it, and the words beside it that say what is being turned.
//
//     <Switch defaultChecked>
//         <Switch.Control>
//             <Switch.Thumb />
//         </Switch.Control>
//         <Switch.Label>Notifications</Switch.Label>
//         <Switch.HiddenInput />
//     </Switch>
//
// It is a checkbox underneath, drawn over rather than redrawn: the input is kept on the page out
// of sight, so the browser does the turning, the tab stop, the submitting and the resetting, and
// the track and the thumb are what that is drawn as. Every part carries the state of the whole,
// so any of them can be drawn from it rather than only the input that holds it.
//
// It says it is a switch rather than a checkbox. A reader told a box is checked is left to work
// out that the setting behind it is on; one told a switch is on is not
function Switch(
    props: SwitchProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        checked,
        defaultChecked,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        value,
        form,
        id,
        ids,
        onCheckedChange,
        ...rest
    } = props;

    const api = useSwitch({
        checked,
        defaultChecked,
        disabled,
        readOnly,
        required,
        invalid,
        name,
        value,
        form,
        id,
        ids,
        onCheckedChange,
    });

    return <SwitchRootProvider ref={ref} value={api} {...rest} />;
}

Switch.displayName = "Switch";

export default fixedForwardRef(Switch);
