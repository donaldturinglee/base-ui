import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TourContext } from "./TourContext";
import type { TourDescriptionProps } from "./Tour.types";

const classes = {
    root: "tour-description",
};

// What the step has to say. Like the title it is taken from the step, and what a caller writes
// inside it stands instead
function TourDescription(
    props: TourDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    const tour = React.useContext(TourContext);

    if (!tour) {
        return null;
    }

    return (
        <div
            ref={ref}
            id={tour.descriptionId}
            className={classNames(classes.root, className)}
            data-component="Tour.Description"
            {...rest}
        >
            {children ?? tour.step?.description}
        </div>
    );
}

TourDescription.displayName = "Tour.Description";

export default fixedForwardRef(TourDescription);
