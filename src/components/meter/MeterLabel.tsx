import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { MeterContext } from "./MeterContext";
import type { MeterLabelProps } from "./Meter.types";

const classes = {
    root: "meter-label",
};

// Names what is being measured, in the words a reader would use for it. A reading with no name
// beside it is a bar with a number on it and nothing to say what the number counts
function MeterLabel<As extends React.ElementType = "span">(
    props: MeterLabelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "span", className, id, ...rest } = props as MeterLabelProps<"span">;
    const { labelId } = React.useContext(MeterContext);

    return (
        <Component
            ref={ref}
            // The meter is named after this line, so it takes the id the meter is already
            // pointing at unless the caller has named one of their own
            id={id ?? labelId}
            className={classNames(classes.root, className)}
            data-component="Meter.Label"
            {...rest}
        />
    );
}

MeterLabel.displayName = "Meter.Label";

export default fixedForwardRef(MeterLabel);
