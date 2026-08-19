import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { TourContext } from "./TourContext";
import type { TourContentProps } from "./Tour.types";

const classes = {
    root: "tour-content",
};

// The surface a step is read from. It is a dialog to a screen reader, named and described by the
// step's own title and description, and takes focus as each step is reached so that a reader who
// cannot see where the spotlight has moved to is still told what it has moved to.
//
// Focus is not held inside it: a tour speaks about the page, and a step that asks the reader to
// press the very thing it is pointing at needs the page left reachable. That is what sets it
// apart from a dialog, which is closed over whatever it was opened from
function TourContent(
    props: TourContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    const tour = React.useContext(TourContext);
    const mergedRef = useMergedRefs(ref, tour?.contentRef ?? null);

    const stepId = tour?.step?.id ?? null;
    const ready = tour?.ready ?? false;
    const contentRef = tour?.contentRef;

    React.useEffect(() => {
        if (!ready || !stepId) {
            return;
        }

        contentRef?.current?.focus();
    }, [contentRef, ready, stepId]);

    if (!tour || !tour.open || !tour.ready || !tour.step) {
        return null;
    }

    return (
        <div
            ref={mergedRef}
            role="dialog"
            aria-labelledby={tour.step.title ? tour.titleId : undefined}
            aria-describedby={tour.step.description ? tour.descriptionId : undefined}
            // Focus has somewhere to land even where the step holds nothing that can take it,
            // without adding a stop of its own to the page
            tabIndex={-1}
            className={classNames(classes.root, className)}
            data-component="Tour.Content"
            data-type={tour.stepType}
            data-step={tour.step.id}
            {...rest}
        />
    );
}

TourContent.displayName = "Tour.Content";

export default fixedForwardRef(TourContent);
