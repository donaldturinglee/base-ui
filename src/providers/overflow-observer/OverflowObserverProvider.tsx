import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { OverflowObserverContext } from "./OverflowObserverContext";
import type { ObserveFn, OverflowObserverProviderProps } from "./OverflowObserver.types";

// Holds a single IntersectionObserver for everything below it, rather than leaving each thing
// being watched to build one of its own. One notification from that observer is handed on to
// whoever asked about the element it was about, so a row of twenty things costs one observer
// between them instead of twenty.
//
// The observer is scoped to the element that does the clipping, so a child pushed onto a row
// that is hidden is reported as cut off rather than as merely off screen. Until that element is
// there the provider does nothing at all: falling back to the viewport would answer about the
// window rather than about the row, which is not the question being asked
function OverflowObserverProvider({ children, rootRef }: OverflowObserverProviderProps) {
    // Every element being watched, against everything that asked to hear about it
    const subscribers = React.useRef(new Map<Element, Set<(isClipped: boolean) => void>>());
    const observed = React.useRef(new Set<Element>());
    const observer = React.useRef<IntersectionObserver | null>(null);
    const observerRoot = React.useRef<Element | null>(null);

    // Built only once there is a root to scope it to, so a render on the server, or one watching
    // nothing yet, builds nothing
    const getObserver = React.useCallback(() => {
        if (typeof IntersectionObserver === "undefined") {
            return null;
        }

        const root = rootRef.current;

        if (!root) {
            return null;
        }

        if (observer.current && observerRoot.current === root) {
            return observer.current;
        }

        observer.current?.disconnect();
        observed.current.clear();

        observer.current = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const callbacks = subscribers.current.get(entry.target);

                    if (!callbacks) {
                        continue;
                    }

                    // Anything less than the whole of it counts as cut off, since half a button
                    // is no more use than none of it
                    const isClipped = entry.intersectionRatio < 1;

                    for (const callback of callbacks) {
                        callback(isClipped);
                    }
                }
            },
            { root, threshold: 1 },
        );
        observerRoot.current = root;

        return observer.current;
    }, [rootRef]);

    // Whatever subscribed before there was a root to watch it against is put on the observer as
    // soon as there is one, and put on the new one wherever the root has changed underneath it
    const observeSubscribers = React.useCallback(() => {
        const current = getObserver();

        if (!current) {
            return;
        }

        for (const element of subscribers.current.keys()) {
            if (!observed.current.has(element)) {
                current.observe(element);
                observed.current.add(element);
            }
        }
    }, [getObserver]);

    const observe = React.useCallback<ObserveFn>(
        (element, onClippedChange) => {
            let callbacks = subscribers.current.get(element);

            if (!callbacks) {
                callbacks = new Set();
                subscribers.current.set(element, callbacks);
            }

            callbacks.add(onClippedChange);
            observeSubscribers();

            return () => {
                const remaining = subscribers.current.get(element);

                if (!remaining) {
                    return;
                }

                remaining.delete(onClippedChange);

                // The element is only taken off the observer once nothing is left listening for
                // it, since the same element can be watched by more than one caller
                if (remaining.size === 0) {
                    subscribers.current.delete(element);
                    observed.current.delete(element);
                    observer.current?.unobserve(element);
                }
            };
        },
        [observeSubscribers],
    );

    // The root is usually attached on the render after the first, so every render looks again
    // for anything still waiting to be watched
    useIsomorphicLayoutEffect(() => {
        observeSubscribers();
    });

    React.useEffect(
        () => () => {
            observer.current?.disconnect();
            observer.current = null;
            observerRoot.current = null;
            observed.current.clear();
            subscribers.current.clear();
        },
        [],
    );

    return (
        <OverflowObserverContext.Provider value={observe}>
            {children}
        </OverflowObserverContext.Provider>
    );
}

OverflowObserverProvider.displayName = "OverflowObserverProvider";

export default OverflowObserverProvider;
