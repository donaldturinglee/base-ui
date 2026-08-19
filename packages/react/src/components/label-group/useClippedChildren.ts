import * as React from "react";
import { useIsRtl } from "../../providers/direction";

export type ClippedChildrenOptions = {
    // The row the children stand in, which is what they are measured against
    containerRef: React.RefObject<HTMLElement | null>;
    // How many children there are, so the row is measured again as they come and go
    childCount: number;
    // Room to leave clear at the end of the row for whatever else stands there, since that is
    // not room a child can be shown in
    reservedWidth: number;
    // Leaves the row unmeasured, for one that is already showing everything it holds
    disabled?: boolean;
};

const nothingClipped: ReadonlySet<number> = new Set<number>();

const isSameSet = (one: ReadonlySet<number>, other: ReadonlySet<number>) =>
    one.size === other.size && [...one].every((value) => other.has(value));

// Which of a row's children have been cut off by it, by index. Each child carries its index as
// `data-index`, so one observer over the whole row answers for all of them at once rather than
// a row of a hundred labels standing up a hundred observers.
//
// The children are only ever measured, never moved: what does not fit is left where it is and
// taken out of sight, so the room the rest were measured in does not change as they go
export const useClippedChildren = ({
    containerRef,
    childCount,
    reservedWidth,
    disabled,
}: ClippedChildrenOptions) => {
    const [clipped, setClipped] = React.useState<ReadonlySet<number>>(nothingClipped);

    // The end of the row is the left of it where the page is read that way, and the room set
    // aside has to be set aside on the side the toggle actually stands
    const isRtl = useIsRtl();

    React.useEffect(() => {
        const container = containerRef.current;

        // What was last measured is left standing rather than forgotten. A row that stops being
        // measured has not changed width, so the answer it had is still the right one, and
        // throwing it away would show every child again for the frame before the observer
        // answers for the first time
        if (!container || disabled) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                setClipped((current) => {
                    const next = new Set(current);

                    for (const entry of entries) {
                        const index = Number(entry.target.getAttribute("data-index"));

                        // Anything less than the whole of it counts as cut off, since half a
                        // label is no more use than none of it
                        if (entry.intersectionRatio < 1) {
                            next.add(index);
                        } else {
                            next.delete(index);
                        }
                    }

                    // Held still where nothing has changed, so a row that has settled is not
                    // rendered again on every scroll or resize
                    return isSameSet(current, next) ? current : next;
                });
            },
            {
                root: container,
                rootMargin: isRtl
                    ? `0px 0px 0px ${-reservedWidth}px`
                    : `0px ${-reservedWidth}px 0px 0px`,
                threshold: 1,
            },
        );

        for (const child of container.querySelectorAll("[data-index]")) {
            observer.observe(child);
        }

        return () => {
            observer.disconnect();
        };
    }, [containerRef, childCount, reservedWidth, disabled, isRtl]);

    return clipped;
};
