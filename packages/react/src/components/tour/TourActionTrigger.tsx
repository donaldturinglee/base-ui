import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Button } from "../button";
import { TourContext } from "./TourContext";
import type { TourActionTriggerProps } from "./Tour.types";

const classes = {
    root: "tour-action-trigger",
};

// One of the ways on from a step. What it says is the action's own, so a caller writes the same
// trigger for every step and each step names its buttons for itself.
//
// An action naming one of the ways through the tour is taken here; one carrying something of the
// caller's own is handed the tour and left to take it wherever it likes, which is what a step
// that has to do something on the page before moving on needs
function TourActionTrigger(
    props: TourActionTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { action, className, children, onClick, variant = "default", ...rest } = props;

    const tour = React.useContext(TourContext);

    if (!tour) {
        return null;
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        if (typeof action.action === "function") {
            action.action(tour);
            return;
        }

        if (action.action === "next") {
            tour.next();
        } else if (action.action === "prev") {
            tour.prev();
        } else {
            tour.dismiss();
        }
    };

    return (
        <Button
            ref={ref}
            variant={variant}
            className={classNames(classes.root, className)}
            onClick={handleClick}
            data-component="Tour.ActionTrigger"
            data-action={typeof action.action === "string" ? action.action : "custom"}
            {...rest}
        >
            {children ?? action.label}
        </Button>
    );
}

TourActionTrigger.displayName = "Tour.ActionTrigger";

export default fixedForwardRef(TourActionTrigger);
