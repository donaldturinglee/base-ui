import * as React from "react";
import { getAccessibleName } from "./treeNavigation";

const TREE_ITEM = "[role=treeitem]";

// How long a run of keystrokes is taken to be one word before the next one starts a new
// search
const SEARCH_RESET_DELAY = 300;

export type TypeaheadOptions = {
    containerRef: React.RefObject<HTMLElement | null>;
    onFocusChange: (element: HTMLElement) => void;
};

// Wraps the array around itself so that the search runs on from wherever the reader is
// rather than from the top of the tree every time
const wrapArray = <T>(array: T[], startIndex: number) =>
    array.map((_, index) => array[(startIndex + index) % array.length]);

// Moves to the item whose name begins with what has just been typed, which is how a long
// tree is reached into without walking down it
export const useTypeahead = ({ containerRef, onFocusChange }: TypeaheadOptions) => {
    const searchValue = React.useRef("");
    const timeout = React.useRef(0);

    // The callback is held by a ref so that a caller passing a new one each render does not
    // set the listener up again
    const onFocusChangeRef = React.useRef(onFocusChange);

    React.useEffect(() => {
        onFocusChangeRef.current = onFocusChange;
    }, [onFocusChange]);

    React.useEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        // The items are looked up once and looked up again only when the tree changes,
        // since a search runs over every one of them on every keystroke
        let items: HTMLElement[] | null = null;

        const getItems = () => {
            items ??= Array.from(container.querySelectorAll<HTMLElement>(TREE_ITEM));

            return items;
        };

        const observer = new MutationObserver(() => {
            items = null;
        });

        observer.observe(container, { childList: true, subtree: true });

        const handleKeyDown = (event: KeyboardEvent) => {
            // Only keys that stand for a character are typed into the search, and only
            // where nothing else has claim to them
            if (!event.key || event.key.length > 1 || event.key === " ") {
                return;
            }

            if (event.ctrlKey || event.altKey || event.metaKey) {
                return;
            }

            searchValue.current += event.key;

            const all = getItems();
            const from = all.findIndex((item) => item === document.activeElement);
            const ordered = wrapArray(all, Math.max(from, 0));

            // A search that has only just begun steps past the item the reader is on, so
            // that pressing the same letter again moves on rather than staying put
            const candidates = searchValue.current.length === 1 ? ordered.slice(1) : ordered;
            const search = searchValue.current.toLowerCase();
            const next = candidates.find((item) =>
                getAccessibleName(item).trim().toLowerCase().startsWith(search),
            );

            if (next) {
                onFocusChangeRef.current(next);
            }

            window.clearTimeout(timeout.current);
            timeout.current = window.setTimeout(() => {
                searchValue.current = "";
            }, SEARCH_RESET_DELAY);

            event.preventDefault();
            event.stopPropagation();
        };

        container.addEventListener("keydown", handleKeyDown);

        return () => {
            observer.disconnect();
            container.removeEventListener("keydown", handleKeyDown);
            window.clearTimeout(timeout.current);
        };
    }, [containerRef]);
};
