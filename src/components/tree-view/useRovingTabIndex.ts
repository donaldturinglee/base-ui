import type * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { getNextFocusableItem } from "./treeNavigation";

const TREE_ITEM = "[role=treeitem]";

export type RovingTabIndexOptions = {
    containerRef: React.RefObject<HTMLElement | null>;
};

// Moves through the tree with the arrow keys, keeping exactly one item in the tab order so
// that the tree is one stop on the way through the page rather than one stop an item
export const useRovingTabIndex = ({ containerRef }: RovingTabIndexOptions) => {
    useIsomorphicLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const rove = (preferred?: Element | null) => {
            const items = Array.from(container.querySelectorAll<HTMLElement>(TREE_ITEM));

            if (items.length === 0) {
                return;
            }

            // Whatever holds focus keeps the tab stop; failing that, whichever item already
            // had it, so that opening a sub-tree does not move it back to the beginning
            const target =
                (preferred instanceof HTMLElement && container.contains(preferred)
                    ? preferred.closest<HTMLElement>(TREE_ITEM)
                    : null) ??
                items.find((item) => item.tabIndex === 0) ??
                items.find((item) => item.getAttribute("aria-current") === "true") ??
                items[0];

            for (const item of items) {
                item.tabIndex = item === target ? 0 : -1;
            }
        };

        rove();

        const handleFocusIn = (event: FocusEvent) => {
            rove(event.target as Element | null);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            // A key pressed with a modifier belongs to the browser or the page, not to the
            // tree
            if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
                return;
            }

            const from = (event.target as HTMLElement | null)?.closest<HTMLElement>(TREE_ITEM);

            if (!from || !container.contains(from)) {
                return;
            }

            const next = getNextFocusableItem(from, event.key);

            if (!next) {
                return;
            }

            // Taking the event keeps the page from scrolling away underneath the tree
            event.preventDefault();
            next.focus();
        };

        // Opening a sub-tree brings items onto the page that have no tab stop of their own
        // yet, so the tree is handed back whichever item should hold it
        const observer = new MutationObserver(() => rove(document.activeElement));
        observer.observe(container, { childList: true, subtree: true });

        container.addEventListener("focusin", handleFocusIn);
        container.addEventListener("keydown", handleKeyDown);

        return () => {
            observer.disconnect();
            container.removeEventListener("focusin", handleFocusIn);
            container.removeEventListener("keydown", handleKeyDown);
        };
    }, [containerRef]);
};
