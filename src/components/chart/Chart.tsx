import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { ChartContext } from "./ChartContext";
import type { ChartProps } from "./Chart.types";

const classes = {
    root: "chart",
};

// The room a chart is drawn in, and where the parts of it are told what is being plotted.
//
// The plot itself is a recharts chart handed in as the only child, so that everything recharts
// can draw is still there to be reached for, and what this adds is the part that belongs to the
// design system rather than to the drawing: the palette the series take their colours from, the
// type and the rules the axes are drawn with, and a legend and a readout that look like the
// rest of the library.
//
// The box is measured rather than given a size, so the plot fills whatever room it is put in.
// How tall that comes out is settled by the aspect ratio in the stylesheet, which a caller can
// set to something else through --chart-aspect-ratio without having to say what the width is
function Chart(
    props: ChartProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { chart, className, children, ...rest } = props;

    return (
        <ChartContext.Provider value={chart}>
            <div
                ref={ref}
                className={classNames(classes.root, className)}
                data-component="Chart"
                {...rest}
            >
                <ResponsiveContainer width="100%" height="100%">
                    {children}
                </ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
}

Chart.displayName = "Chart";

export default fixedForwardRef(Chart);
