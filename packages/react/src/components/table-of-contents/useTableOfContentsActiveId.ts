import * as React from "react";
import type {
    UseTableOfContentsActiveIdOptions,
    UseTableOfContentsActiveIdResult,
} from "./TableOfContents.types";

// How long the page has to be still before a section marked by a press gives the marking back
// to the scroll. Every scroll event pushes the wait out again, so it is measured from the last
// of them rather than from the press
const SCROLL_SETTLE_DURATION = 150;

// Nothing can appear in a document id, so a run of ids joined by it comes apart again exactly
// as it went together. The joined run is what the effects are keyed on, since the list itself is
// usually built afresh on every render and would otherwise set them off every time
const IDS_SEPARATOR = "\0";

// Works out which section of a page is the one being read, and hands back a way to say so
// outright.
//
// The sections are watched rather than measured: the topmost of them standing in view is the one
// being read, and where none of them is — partway down a long section, say — the last answer is
// kept rather than cleared, since the reader is still somewhere.
//
// A press is a different thing from a scroll. A section too short to reach the line the sections
// are counted against would never be marked by scrolling to it, so `selectSection` marks it and
// holds the watching off until the page has stopped moving.
//
// Everything it does it does in an effect, so a page drawn on a server is drawn with no section
// marked and settles on the reader's own once it arrives
export const useTableOfContentsActiveId = ({
    ids,
    offset = 0,
    root = null,
    trackHash = true,
}: UseTableOfContentsActiveIdOptions): UseTableOfContentsActiveIdResult => {
    const [activeId, setActiveId] = React.useState<string | null>(null);

    // While a section is held by a press the watching carries on, it simply does not write its
    // answer down until the hold is let go
    const pinned = React.useRef(false);

    const idsKey = ids.join(IDS_SEPARATOR);

    React.useEffect(() => {
        // Not every runtime has one to reach for, and a page whose sections are never watched
        // still marks whatever a press or an address asks for
        if (typeof IntersectionObserver === "undefined") {
            return;
        }

        const elements = idsKey
            .split(IDS_SEPARATOR)
            .map((id) => document.getElementById(id))
            .filter((element): element is HTMLElement => element !== null);

        if (elements.length === 0) {
            return;
        }

        // What is standing in view, kept between callbacks: a callback is only told about the
        // sections that have changed, not about all of them
        const inView = new Set<Element>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        inView.add(entry.target);
                    } else {
                        inView.delete(entry.target);
                    }
                }

                // The first of them in the order they stand on the page, which is the one the
                // reader has come to rather than the one they are heading towards
                const first = elements.find((element) => inView.has(element));

                if (first && !pinned.current) {
                    setActiveId(first.id);
                }
            },
            { root, rootMargin: `-${offset}px 0px 0px 0px` },
        );

        for (const element of elements) {
            observer.observe(element);
        }

        return () => {
            observer.disconnect();
        };
    }, [idsKey, offset, root]);

    // The wait for the page to settle, and the way to call it off. It is called off by the next
    // press as well as on the way out, so a run of presses leaves only the last one waiting
    const settleTimer = React.useRef<number | undefined>(undefined);
    const cancelUnpin = React.useRef<(() => void) | null>(null);

    const selectSection = React.useCallback(
        (id: string) => {
            cancelUnpin.current?.();
            pinned.current = true;
            setActiveId(id);

            // The scroll to the section is a scroll like any other, so it keeps pushing the wait
            // out until it has run its course. It is counted this way rather than through
            // `scrollend`, which Safari had no answer for until 18.2
            const scrollTarget: EventTarget = root ?? window;

            const armSettleTimer = () => {
                window.clearTimeout(settleTimer.current);
                settleTimer.current = window.setTimeout(() => {
                    cancelUnpin.current?.();
                    pinned.current = false;
                }, SCROLL_SETTLE_DURATION);
            };

            scrollTarget.addEventListener("scroll", armSettleTimer, { passive: true });

            cancelUnpin.current = () => {
                window.clearTimeout(settleTimer.current);
                scrollTarget.removeEventListener("scroll", armSettleTimer);
                cancelUnpin.current = null;
            };

            armSettleTimer();
        },
        [root],
    );

    React.useEffect(() => () => cancelUnpin.current?.(), []);

    // A link into the middle of a page names the section it lands on. It is taken on arrival and
    // again whenever it changes, and only where it names one of the sections being followed
    React.useEffect(() => {
        if (!trackHash) {
            return;
        }

        const knownIds = new Set(idsKey.split(IDS_SEPARATOR));

        const syncFromHash = () => {
            const id = decodeURIComponent(window.location.hash.slice(1));

            if (id && knownIds.has(id)) {
                selectSection(id);
            }
        };

        syncFromHash();
        window.addEventListener("hashchange", syncFromHash);

        return () => {
            window.removeEventListener("hashchange", syncFromHash);
        };
    }, [trackHash, idsKey, selectSection]);

    return { activeId, selectSection };
};
