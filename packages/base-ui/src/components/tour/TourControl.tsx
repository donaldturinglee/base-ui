import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TourControlProps } from "./Tour.types";

const classes = {
    root: "tour-control",
};

// The row the ways on from a step are laid out in, standing at the foot of the surface where a
// reader looks for them. It is a box of its own rather than a class on the buttons, so a caller
// can put something beside them — a bar saying how far along the tour is, a checkbox for not
// being shown it again — and have it laid out on the same line
function TourControl(
    props: TourControlProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Tour.Control"
            {...rest}
        />
    );
}

TourControl.displayName = "Tour.Control";

export default fixedForwardRef(TourControl);
