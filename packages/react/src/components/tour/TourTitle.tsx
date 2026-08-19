import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TourContext } from "./TourContext";
import type { TourTitleProps } from "./Tour.types";

const classes = {
    root: "tour-title",
};

// What the step is called. It is taken from the step rather than written out here, since the
// steps are given as data and the surface is drawn once for all of them. What a caller writes
// inside it stands instead, for a title that has to be built rather than said
function TourTitle(
    props: TourTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, ...rest } = props;

    const tour = React.useContext(TourContext);

    if (!tour) {
        return null;
    }

    return (
        <h2
            ref={ref}
            id={tour.titleId}
            className={classNames(classes.root, className)}
            data-component="Tour.Title"
            {...rest}
        >
            {children ?? tour.step?.title}
        </h2>
    );
}

TourTitle.displayName = "Tour.Title";

export default fixedForwardRef(TourTitle);
