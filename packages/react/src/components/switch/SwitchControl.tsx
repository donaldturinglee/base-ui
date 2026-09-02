import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, SwitchContext } from "./SwitchContext";
import type { SwitchControlProps } from "./Switch.types";

const classes = {
    root: "switch-control",
};

// The track the thumb slides along, which is what the switch is seen as. It is drawn rather than
// read: the input beside it is what carries the name and the state, so this is kept out of the
// accessibility tree rather than read as a second thing
function SwitchControl(
    props: SwitchControlProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const context = React.useContext(SwitchContext);

    return (
        <span
            ref={ref}
            id={context.ids?.control}
            className={classNames(classes.root, className)}
            aria-hidden="true"
            data-component="Switch.Control"
            {...getStateAttributes(context)}
            {...rest}
        />
    );
}

SwitchControl.displayName = "Switch.Control";

export default fixedForwardRef(SwitchControl);
