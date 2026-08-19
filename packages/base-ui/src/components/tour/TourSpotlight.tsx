import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { TourContext } from "./TourContext";
import type { TourSpotlightProps } from "./Tour.types";

const classes = {
    root: [
        "tour-spotlight",
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short",
    ],
};

// The ring drawn around what the step points at. The dim is the backdrop's to cast, so this only
// picks the target out of it; a step pointing at nothing has nothing to ring and draws nothing.
//
// Presses fall through it, since what is under a spotlight is the very thing the step is asking
// the reader to look at, and often the thing it is asking them to press
function TourSpotlight(
    props: TourSpotlightProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, style, portalContainerName, ...rest } = props;

    const tour = React.useContext(TourContext);

    if (!tour || !tour.open || !tour.ready || !tour.targetRect) {
        return null;
    }

    const { targetRect, spotlightOffset, spotlightRadius } = tour;

    return (
        <Portal containerName={portalContainerName}>
            <div
                ref={ref}
                aria-hidden="true"
                className={classNames(classes.root, className)}
                style={
                    {
                        ...style,
                        "--tour-target-top": `${targetRect.top - spotlightOffset}px`,
                        "--tour-target-left": `${targetRect.left - spotlightOffset}px`,
                        "--tour-target-width": `${targetRect.width + spotlightOffset * 2}px`,
                        "--tour-target-height": `${targetRect.height + spotlightOffset * 2}px`,
                        "--tour-target-radius": `${spotlightRadius}px`,
                    } as React.CSSProperties
                }
                data-component="Tour.Spotlight"
                {...rest}
            />
        </Portal>
    );
}

TourSpotlight.displayName = "Tour.Spotlight";

export default fixedForwardRef(TourSpotlight);
