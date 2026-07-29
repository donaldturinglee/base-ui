import type * as React from "react";
import { useEffect, useState } from "react";

export type IsClippedOptions = {
    // The element being watched
    ref: React.RefObject<HTMLElement | null>;
    // The element it is clipped by, which is whatever holds it and hides its overflow
    rootRef: React.RefObject<HTMLElement | null>;
    // Leaves the element unwatched, for one that is already known to be out of the way
    disabled?: boolean;
};

// Reports whether an element has been cut off by whatever holds it, which is how a row of
// things works out which of them no longer fit
export const useIsClipped = ({ ref, rootRef, disabled }: IsClippedOptions) => {
    const [isClipped, setIsClipped] = useState(false);

    useEffect(() => {
        const element = ref.current;
        const root = rootRef.current;

        if (!element || !root || disabled) {
            setIsClipped(false);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    // Anything less than the whole of it counts as cut off, since half a
                    // button is no more use than none of it
                    setIsClipped(entry.intersectionRatio < 1);
                }
            },
            { root, threshold: 1 },
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, rootRef, disabled]);

    return isClipped;
};
