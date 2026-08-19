import * as React from "react";
import { TourContext } from "./TourContext";
import type { TourActionsProps } from "./Tour.types";

// Stable, so that a step written with no ways on from it does not hand a fresh list down on
// every render
const NO_ACTIONS: never[] = [];

// The ways on from the step being read, handed to the caller to draw. They are given rather than
// drawn here because what a tour's buttons look like is the design system's to settle and how
// many of them there are is the step's, and only the caller knows both
function TourActions(props: TourActionsProps) {
    const tour = React.useContext(TourContext);

    return <>{props.children(tour?.step?.actions ?? NO_ACTIONS)}</>;
}

TourActions.displayName = "Tour.Actions";

export default TourActions;
