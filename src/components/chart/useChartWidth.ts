import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

// How wide the chart has to draw itself. The plot is laid out in real pixels rather than drawn
// once and stretched, so that the text on it stays the size text is everywhere else on the page
export const useChartWidth = (ref: React.RefObject<HTMLElement | null>, fallback: number) => {
    const [width, setWidth] = React.useState(fallback);

    useIsomorphicLayoutEffect(() => {
        const element = ref.current;

        if (!element) {
            return;
        }

        const measure = () => {
            const measured = element.getBoundingClientRect().width;

            setWidth(measured > 0 ? measured : fallback);
        };

        measure();

        // Not every browser has one to reach for, and a chart that is never measured again
        // still stands at the width it was first given
        if (typeof ResizeObserver === "undefined") {
            return;
        }

        const observer = new ResizeObserver(measure);
        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, fallback]);

    return width;
};
