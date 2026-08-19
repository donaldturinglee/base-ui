import { useContext } from "react";
import { TourContext } from "./TourContext";
import type { TourApi } from "./Tour.types";

// Everything that can be done to the tour standing around whatever is reading this: where it has
// come to, and the ways on from there. It is what a caller drawing controls of their own reaches
// for, in place of the actions a step carries.
//
// Standing outside of a `Tour` is a mistake worth stopping at rather than carrying on from:
// there is no tour to move, and nothing below can say which step is being read
export const useTour = (): TourApi => {
    const context = useContext(TourContext);

    if (!context) {
        throw new Error("`useTour` has to be called from within a `Tour` component.");
    }

    return context;
};
