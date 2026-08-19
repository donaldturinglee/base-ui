import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Portal } from "../portal";
import { getAnchoredPosition } from "../tooltip/anchoredPosition";
import { TourContext, TourPositionerContext } from "./TourContext";
import type { AnchoredPosition } from "../tooltip/anchoredPosition";
import type { TourPositionerProps, TourStepType } from "./Tour.types";

// How far the surface stands off the ring drawn around the target, so the two read as one thing
// pointing at another rather than as a box sitting on top of it
const SURFACE_OFFSET = 8;

const tourPositionerVariants = cva(
    [
        "tour-positioner",
        // It arrives from the edge of what it points at, which says where it came from
        "motion-safe:animate-in motion-safe:fade-in motion-safe:duration-short motion-safe:data-[side=outside-bottom]:slide-in-from-top-2 motion-safe:data-[side=outside-top]:slide-in-from-bottom-2 motion-safe:data-[side=outside-right]:slide-in-from-left-2 motion-safe:data-[side=outside-left]:slide-in-from-right-2",
    ],
    {
        variants: {
            type: {
                dialog: "tour-positioner-dialog",
                tooltip: "tour-positioner-tooltip",
                floating: "tour-positioner-floating",
            } satisfies Record<TourStepType, string>,
            // Held back until it has been placed, so it is never seen where it does not belong
            unplaced: {
                true: "invisible",
                false: "",
            },
        },
    },
);

// Whether the surface ended up where it already was, which is the only thing worth not
// rendering it again for
const isSamePosition = (one: AnchoredPosition, other: AnchoredPosition) =>
    one.top === other.top &&
    one.left === other.left &&
    one.anchorSide === other.anchorSide &&
    one.anchorAlign === other.anchorAlign;

// Where the surface stands. It is drawn out of the page and laid out against the viewport, since
// what a step points at may be standing anywhere, in a region that clips or scrolls.
//
// Which of the three ways it is placed is settled by the step rather than here: one that points
// at something stands against it, one that points at nothing stands in the middle of the screen,
// and a floating one keeps to a corner wherever the reader has scrolled to
function TourPositioner(
    props: TourPositionerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        side: sideProp = "outside-bottom",
        align: alignProp = "center",
        placement: placementProp = "bottom-end",
        portalContainerName,
        className,
        style,
        children,
        ...rest
    } = props;

    const tour = React.useContext(TourContext);

    const step = tour?.step ?? null;
    const stepType = tour?.stepType ?? "dialog";
    const anchored = stepType === "tooltip";

    // A step says for itself which way round it stands where it cares to, and takes what the
    // positioner was given where it does not
    const side = step?.side ?? sideProp;
    const align = step?.align ?? alignProp;
    const placement = step?.placement ?? placementProp;

    const showing = Boolean(tour?.open && tour.ready && step);

    const positionerRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, positionerRef);

    // Where the surface was last placed, kept beside the state so that placing it again can be
    // told apart from placing it somewhere new without waiting for a render
    const placedRef = React.useRef<AnchoredPosition | null>(null);
    const [position, setPosition] = React.useState<AnchoredPosition | null>(null);

    const getTarget = tour?.getTarget;
    const spotlightOffset = tour?.spotlightOffset ?? 0;

    const updatePosition = React.useCallback(() => {
        const anchor = getTarget?.();
        const positioner = positionerRef.current;

        if (!anchor || !positioner) {
            return;
        }

        const placed = getAnchoredPosition(positioner, anchor, {
            side,
            align,
            // Stood off the ring rather than off the target itself, so the surface never sits
            // on the very thing it is pointing at
            anchorOffset: spotlightOffset + SURFACE_OFFSET,
        });

        if (placedRef.current && isSamePosition(placedRef.current, placed)) {
            return;
        }

        placedRef.current = placed;
        setPosition(placed);
    }, [align, getTarget, side, spotlightOffset]);

    // Placed before the browser paints, so the surface is never seen standing anywhere but
    // against what its step points at. The tour measures the target itself, so the rect it is
    // holding is what says the target has moved
    useIsomorphicLayoutEffect(() => {
        if (!showing || !anchored) {
            // Forgotten, so that the next step is placed from scratch rather than from wherever
            // the one before it was left
            placedRef.current = null;
            setPosition(null);
            return;
        }

        updatePosition();

        // The surface moves with whatever it grows to hold, which changes with every step
        const observer = new ResizeObserver(updatePosition);

        if (positionerRef.current) {
            observer.observe(positionerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [anchored, showing, tour?.targetRect, updatePosition]);

    if (!tour || !showing) {
        return null;
    }

    return (
        <Portal containerName={portalContainerName}>
            <div
                ref={mergedRef}
                className={classNames(
                    tourPositionerVariants({
                        type: stepType,
                        unplaced: anchored && !position,
                    }),
                    className,
                )}
                style={
                    {
                        ...style,
                        "--tour-positioner-top": `${position?.top ?? 0}px`,
                        "--tour-positioner-left": `${position?.left ?? 0}px`,
                    } as React.CSSProperties
                }
                data-component="Tour.Positioner"
                data-type={stepType}
                data-side={position?.anchorSide ?? side}
                data-align={position?.anchorAlign ?? align}
                data-placement={stepType === "floating" ? placement : undefined}
                {...rest}
            >
                <TourPositionerContext.Provider
                    value={{
                        side: position?.anchorSide ?? side,
                        align: position?.anchorAlign ?? align,
                    }}
                >
                    {children}
                </TourPositionerContext.Provider>
            </div>
        </Portal>
    );
}

TourPositioner.displayName = "Tour.Positioner";

export default fixedForwardRef(TourPositioner);
