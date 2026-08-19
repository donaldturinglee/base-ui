import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { TourContext } from "./TourContext";
import type { TourBackdropProps } from "./Tour.types";

const tourBackdropVariants = cva(
    ["tour-backdrop", "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short"],
    {
        variants: {
            // Where the step points at something, the dim is cast out from around it rather
            // than laid over the whole screen, so what is being spoken about is the one thing
            // left lit
            spotlit: {
                true: "tour-backdrop-spotlit",
                false: "",
            },
        },
    },
);

// The dim over the page behind the step. It is drawn rather than pressed: what closes a tour is
// Escape or a press the tour hears for itself, and leaving the dim out of the pointer's way is
// what lets a step ask the reader to click the very thing it is pointing at
function TourBackdrop(
    props: TourBackdropProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, style, portalContainerName, ...rest } = props;

    const tour = React.useContext(TourContext);

    if (!tour || !tour.open || !tour.ready || tour.step?.backdrop === false) {
        return null;
    }

    const { targetRect, spotlightOffset, spotlightRadius } = tour;

    return (
        <Portal containerName={portalContainerName}>
            <div
                ref={ref}
                aria-hidden="true"
                className={classNames(
                    tourBackdropVariants({ spotlit: targetRect !== null }),
                    className,
                )}
                style={
                    {
                        ...style,
                        "--tour-target-top": `${(targetRect?.top ?? 0) - spotlightOffset}px`,
                        "--tour-target-left": `${(targetRect?.left ?? 0) - spotlightOffset}px`,
                        "--tour-target-width": `${(targetRect?.width ?? 0) + spotlightOffset * 2}px`,
                        "--tour-target-height": `${(targetRect?.height ?? 0) + spotlightOffset * 2}px`,
                        "--tour-target-radius": `${spotlightRadius}px`,
                    } as React.CSSProperties
                }
                data-component="Tour.Backdrop"
                data-spotlit={targetRect ? "" : undefined}
                {...rest}
            />
        </Portal>
    );
}

TourBackdrop.displayName = "Tour.Backdrop";

export default fixedForwardRef(TourBackdrop);
