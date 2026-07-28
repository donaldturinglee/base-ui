import type * as React from "react";
import { useEffect } from "react";
import { getInteractiveNodes } from "../utilities/interactive";

export type FocusTrapOptions = {
    // The element focus is held within
    containerRef: React.RefObject<HTMLElement | null>;
    // What takes focus as the trap opens, in place of the first thing inside it that can
    initialFocusRef?: React.RefObject<HTMLElement | null>;
    // Where focus lands once the trap closes, in place of whatever held it beforehand
    returnFocusRef?: React.RefObject<HTMLElement | null>;
};

// Every trap that is open, in the order they opened. Only the last one answers the tab
// key, so a dialog opened from a dialog keeps focus to itself
const traps: HTMLElement[] = [];

// Holds focus inside a container for as long as it is mounted, and hands it back when it
// is taken down
export const useFocusTrap = ({
    containerRef,
    initialFocusRef,
    returnFocusRef,
}: FocusTrapOptions) => {
    useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const previouslyFocused = document.activeElement;

        traps.push(container);
        // The container itself is the last resort, so focus is never left behind on the
        // page underneath even when there is nothing inside to take it
        (initialFocusRef?.current ?? getInteractiveNodes(container)[0] ?? container).focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Tab" || traps[traps.length - 1] !== container) {
                return;
            }

            const nodes = getInteractiveNodes(container);

            if (nodes.length === 0) {
                event.preventDefault();
                return;
            }

            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            const active = document.activeElement;
            const isLeaving = event.shiftKey ? active === first : active === last;

            // Tabbing off either end comes round to the other, as does tabbing at all
            // while focus has been left outside the trap
            if (isLeaving || !container.contains(active)) {
                event.preventDefault();
                (event.shiftKey ? last : first).focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            traps.splice(traps.indexOf(container), 1);

            const returnFocus = returnFocusRef?.current ?? previouslyFocused;

            if (returnFocus instanceof HTMLElement) {
                returnFocus.focus();
            }
        };
    }, [containerRef, initialFocusRef, returnFocusRef]);
};
