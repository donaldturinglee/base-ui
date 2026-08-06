import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MeterTrackProps } from "./Meter.types";

const classes = {
    root: "meter-track",
};

// The groove the reading is drawn in. It stands for the whole distance between the two ends, so
// it is drawn at its full length whatever the reading is, and the indicator inside it is what
// says how far along that distance the reading stands
function MeterTrack<As extends React.ElementType = "span">(
    props: MeterTrackProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "span", className, ...rest } = props as MeterTrackProps<"span">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Meter.Track"
            {...rest}
        />
    );
}

MeterTrack.displayName = "Meter.Track";

export default fixedForwardRef(MeterTrack);
