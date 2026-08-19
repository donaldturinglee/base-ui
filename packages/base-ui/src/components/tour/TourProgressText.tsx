import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TourContext } from "./TourContext";
import type { TourProgressTextProps } from "./Tour.types";

const classes = {
    root: "tour-progress-text",
};

// How far along the tour the reader has come, which is what makes a tour worth starting: a
// reader who can see there are three steps left will read them, and one who cannot will not
function TourProgressText(
    props: TourProgressTextProps,
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
            className={classNames(classes.root, className)}
            data-component="Tour.ProgressText"
            {...rest}
        >
            {children ?? tour.progressText}
        </div>
    );
}

TourProgressText.displayName = "Tour.ProgressText";

export default fixedForwardRef(TourProgressText);
