import { useContext } from "react";
import { StepsItemContext } from "./StepsItemContext";
import type { StepsItemContextValue } from "./Steps.types";

// Everything a step, and the parts it is drawn from, needs from the list around it. Standing
// outside of a `Steps` is a mistake worth stopping at rather than carrying on from: nothing
// below it can know which number it stands at or how far along the flow has come
export const useStepsItem = (): StepsItemContextValue => {
    const context = useContext(StepsItemContext);

    if (!context) {
        throw new Error("A step and its parts all have to stand within a `Steps` component.");
    }

    return context;
};
