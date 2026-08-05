import { createContext, useContext } from "react";
import type { ChartInstance } from "./Chart.types";

// The chart the root was built from, so that the legend and the readout know what is being
// plotted without being handed it again. Both are given to recharts as content rather than
// written into the tree by the caller, so there is nowhere for them to be passed it by hand
export const ChartContext = createContext<ChartInstance | null>(null);

export const useChartContext = (): ChartInstance => {
    const chart = useContext(ChartContext);

    if (!chart) {
        throw new Error("Chart parts have to be rendered inside a Chart");
    }

    return chart;
};
