import { useEffect, useRef } from "react";

export type EscapeHandler = (event: KeyboardEvent) => void;

// Every handler that is listening, in the order they started to. One document listener
// stands in for all of them, so the order they answer in is ours to decide
const handlers: EscapeHandler[] = [];

const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || event.defaultPrevented) {
        return;
    }

    // The innermost layer answers first, and takes the event to stop the ones around it
    // from answering at all
    for (const handler of [...handlers].reverse()) {
        handler(event);

        if (event.defaultPrevented) {
            break;
        }
    }
};

// Calls back when Escape is pressed anywhere in the document. A handler that calls
// `preventDefault` keeps the ones registered before it from being called
export const useOnEscapePress = (onEscape: EscapeHandler) => {
    const latest = useRef<EscapeHandler>(onEscape);

    useEffect(() => {
        latest.current = onEscape;
    }, [onEscape]);

    useEffect(() => {
        // The registered handler stays the same for as long as the layer is open, so a
        // fresh callback does not move it to the front of the queue
        const handler: EscapeHandler = (event) => latest.current(event);

        if (handlers.length === 0) {
            document.addEventListener("keydown", onKeyDown);
        }

        handlers.push(handler);

        return () => {
            handlers.splice(handlers.indexOf(handler), 1);

            if (handlers.length === 0) {
                document.removeEventListener("keydown", onKeyDown);
            }
        };
    }, []);
};
