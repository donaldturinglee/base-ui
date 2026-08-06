import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MeterIndicatorProps } from "./Meter.types";

const classes = {
    root: "meter-indicator",
};

// How much of the groove the reading fills. How far it runs is taken from the custom property the
// meter hands to the stylesheet rather than measured out here, so the length is settled in the
// same place as the colour and the height it is drawn with
function MeterIndicator<As extends React.ElementType = "span">(
    props: MeterIndicatorProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "span", className, ...rest } = props as MeterIndicatorProps<"span">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Meter.Indicator"
            {...rest}
        />
    );
}

MeterIndicator.displayName = "Meter.Indicator";

export default fixedForwardRef(MeterIndicator);
