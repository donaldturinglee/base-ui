import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { TourContext } from "./TourContext";
import type { TourCloseTriggerProps } from "./Tour.types";

const classes = {
    root: "tour-close-trigger",
};

// The way out of a tour part way through, which every step carries: a reader who has seen enough
// should not have to press through the rest of them to be let go
function TourCloseTrigger(
    props: TourCloseTriggerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        icon = DismissRegular,
        onClick,
        "aria-label": ariaLabel = "Close tour",
        ...rest
    } = props;

    const tour = React.useContext(TourContext);

    if (!tour) {
        return null;
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);

        if (event.defaultPrevented) {
            return;
        }

        tour.dismiss();
    };

    return (
        <IconButton
            ref={ref}
            icon={icon}
            variant="invisible"
            size="small"
            aria-label={ariaLabel}
            className={classNames(classes.root, className)}
            onClick={handleClick}
            data-component="Tour.CloseTrigger"
            {...rest}
        />
    );
}

TourCloseTrigger.displayName = "Tour.CloseTrigger";

export default fixedForwardRef(TourCloseTrigger);
