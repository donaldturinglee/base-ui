import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Caret } from "../caret";
import { TourContext, TourPositionerContext } from "./TourContext";
import type { CaretLocation } from "../caret";
import type { AnchorAlignment, AnchorSide } from "../tooltip/anchoredPosition";
import type { TourArrowProps } from "./Tour.types";

// Which edge of the surface the caret stands on. It is the edge facing what the step points at,
// which is the opposite of the side of the target the surface ended up on
const facingEdge: Record<AnchorSide, "top" | "bottom" | "left" | "right"> = {
    "outside-top": "bottom",
    "outside-bottom": "top",
    "outside-left": "right",
    "outside-right": "left",
};

// Where along that edge it stands. A caret on a horizontal edge runs left to right, one on a
// vertical edge runs top to bottom, and either way the middle is named by the edge alone
const alongEdge: Record<"top" | "bottom" | "left" | "right", Record<AnchorAlignment, string>> = {
    top: { start: "-left", center: "", end: "-right" },
    bottom: { start: "-left", center: "", end: "-right" },
    left: { start: "-top", center: "", end: "-bottom" },
    right: { start: "-top", center: "", end: "-bottom" },
};

// The point the surface is drawn with to say what its step is speaking about. Which way it points
// is worked out from where the surface ended up rather than from what the step asked for, since
// the viewport may have left room only on the other side.
//
// A step standing on its own has nothing to point at, so it draws none
function TourArrow(
    props: TourArrowProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const tour = React.useContext(TourContext);
    const positioner = React.useContext(TourPositionerContext);

    if (!tour || !positioner || tour.stepType !== "tooltip") {
        return null;
    }

    // Left out, a step standing against something points at it
    if (tour.step?.arrow === false) {
        return null;
    }

    const edge = facingEdge[positioner.side];
    const location = `${edge}${alongEdge[edge][positioner.align]}` as CaretLocation;

    return <Caret ref={ref} location={location} data-component="Tour.Arrow" {...props} />;
}

TourArrow.displayName = "Tour.Arrow";

export default fixedForwardRef(TourArrow);
