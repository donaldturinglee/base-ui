import type * as React from "react";

type EventHandler<E> = ((event: E) => void) | undefined;

// Runs a caller's own handler before the one the tabs need, and stops where the caller has
// already answered the event themselves
export const composeEventHandlers = <E extends React.SyntheticEvent>(
    ...handlers: Array<EventHandler<E>>
) => {
    return (event: E) => {
        for (const handler of handlers) {
            handler?.(event);

            if (event.defaultPrevented) {
                break;
            }
        }
    };
};
