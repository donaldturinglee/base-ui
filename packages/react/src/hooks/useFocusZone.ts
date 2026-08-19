import type * as React from "react";
import { useEffect } from "react";
import { getInteractiveNodes } from "../utilities/interactive";

// Which pair of arrow keys the zone answers to
export type FocusZoneDirection = "vertical" | "horizontal";

export type FocusZoneOptions = {
    // The element focus is moved around within
    containerRef: React.RefObject<HTMLElement | null>;
    direction?: FocusZoneDirection;
    // Whether moving off one end comes round to the other
    wrap?: boolean;
    // Leaves the arrow keys alone, for a zone that is not open yet
    disabled?: boolean;
    // Narrows what the arrow keys reach, for things that are in the container but out of
    // the way
    focusableFilter?: (element: HTMLElement) => boolean;
};

const keysByDirection = {
    vertical: { previous: "ArrowUp", next: "ArrowDown" },
    horizontal: { previous: "ArrowLeft", next: "ArrowRight" },
} satisfies Record<FocusZoneDirection, { previous: string; next: string }>;

// Moves focus between the things inside a container with the arrow keys, which is how a
// menu or a toolbar is read rather than how the page around it is tabbed through
export const useFocusZone = ({
    containerRef,
    direction = "vertical",
    wrap = false,
    disabled,
    focusableFilter,
}: FocusZoneOptions) => {
    useEffect(() => {
        const container = containerRef.current;

        if (!container || disabled) {
            return;
        }

        const { previous, next } = keysByDirection[direction];

        const handleKeyDown = (event: KeyboardEvent) => {
            // A key pressed with a modifier belongs to the browser or the page, not to the
            // zone
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }

            const toEnd = event.key === "End";
            const toStart = event.key === "Home";
            const step = event.key === next ? 1 : event.key === previous ? -1 : 0;

            if (step === 0 && !toStart && !toEnd) {
                return;
            }

            const nodes = getInteractiveNodes(container).filter(
                (node) => focusableFilter?.(node) ?? true,
            );

            if (nodes.length === 0) {
                return;
            }

            // Taking the event keeps the page from scrolling away underneath the zone
            event.preventDefault();

            if (toStart || toEnd) {
                nodes[toStart ? 0 : nodes.length - 1].focus();
                return;
            }

            const current = nodes.indexOf(document.activeElement as HTMLElement);
            // Arriving from outside the zone, the first thing in it is where focus lands
            const target = current === -1 ? 0 : current + step;

            if (target >= 0 && target < nodes.length) {
                nodes[target].focus();
                return;
            }

            if (wrap) {
                nodes[(target + nodes.length) % nodes.length].focus();
            }
        };

        container.addEventListener("keydown", handleKeyDown);

        return () => {
            container.removeEventListener("keydown", handleKeyDown);
        };
    }, [containerRef, direction, wrap, disabled, focusableFilter]);
};
