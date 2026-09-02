import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, SwitchContext } from "./SwitchContext";
import type { SwitchLabelProps } from "./Switch.types";

const classes = {
    root: "switch-label",
};

// What is being turned, said in words beside the track. It is what names the input, so a switch
// given one is read by it. The root around both is a label already, so this is a span within it
// rather than a second label pointing at the same input
function SwitchLabel(
    props: SwitchLabelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const context = React.useContext(SwitchContext);

    return (
        <span
            ref={ref}
            id={context.ids?.label}
            className={classNames(classes.root, className)}
            data-component="Switch.Label"
            {...getStateAttributes(context)}
            {...rest}
        />
    );
}

SwitchLabel.displayName = "Switch.Label";

export default fixedForwardRef(SwitchLabel);
