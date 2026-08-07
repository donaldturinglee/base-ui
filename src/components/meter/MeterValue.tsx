import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MeterContext } from "./MeterContext";
import type { MeterValueProps } from "./Meter.types";

const classes = {
    root: "meter-value",
};

// The reading in words, standing beside the name of what it measures. It is written for the
// caller from the shape they gave the meter, and handed to them where they would rather write it
// themselves.
//
// The meter already carries the reading on itself, as aria-valuetext, so the copy the eye reads
// is kept out of the accessibility tree rather than said a second time
function MeterValue(
    props: MeterValueProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;
    const { formattedValue = "", value = 0 } = React.useContext(MeterContext);

    return (
        <span
            ref={ref}
            aria-hidden="true"
            className={classNames(classes.root, className)}
            data-component="Meter.Value"
            {...rest}
        >
            {typeof children === "function"
                ? children({ formattedValue, value })
                : (children ?? formattedValue)}
        </span>
    );
}

MeterValue.displayName = "Meter.Value";

export default fixedForwardRef(MeterValue);
