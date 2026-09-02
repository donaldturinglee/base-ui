import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getStateAttributes, SwitchContext } from "./SwitchContext";
import type { SwitchThumbProps } from "./Switch.types";

const classes = {
    root: "switch-thumb",
};

// The thumb, which slides from one end of the track to the other as the switch is turned. Where
// it stands is the whole of what the track has to say, so it is drawn from the state the track
// is, and kept out of the accessibility tree the same way
function SwitchThumb(
    props: SwitchThumbProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;
    const context = React.useContext(SwitchContext);

    return (
        <span
            ref={ref}
            id={context.ids?.thumb}
            className={classNames(classes.root, className)}
            aria-hidden="true"
            data-component="Switch.Thumb"
            {...getStateAttributes(context)}
            {...rest}
        />
    );
}

SwitchThumb.displayName = "Switch.Thumb";

export default fixedForwardRef(SwitchThumb);
