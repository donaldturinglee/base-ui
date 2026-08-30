import * as React from "react";
import { getHeadingElement, scrollToHeading } from "./headingScroll";
import type {
    TableOfContentsItemData,
    UseTableOfContentsProps,
    UseTableOfContentsReturn,
} from "./TableOfContents.types";

// How much of the scrolled area counts as being read. The band is held near the top: a little
// off the top edge so a heading that has only just come in is not read as arrived at, and a long
// way off the bottom so a heading down at the foot of the page is not read as arrived at until
// the reader has actually got to it
export const DEFAULT_TABLE_OF_CONTENTS_ROOT_MARGIN = "-20px 0% -40% 0%";

// Nothing to draw from and nothing to watch, so an empty list is the same list every render and
// the document is not watched again for want of one
const NO_ITEMS: TableOfContentsItemData[] = [];

const sameIds = (one: string[], other: string[]) =>
    one.length === other.length && one.every((id, index) => id === other[index]);

// Everything the contents need to follow a reader down a document and nothing that draws them:
// which headings are on screen, and the ways of going to one. The contents are built on this, so
// a nav of the caller's own is following the same document the parts are.
//
//     const contents = useTableOfContents({ items, scrollElement });
//
//     <Link href={`#${item.value}`} aria-current={contents.activeIds.includes(item.value)} />
//
// The document is watched rather than measured on every scroll: an observer is told once which
// headings to report on and says so only when one of them crosses the band, so a page of a
// hundred headings costs nothing between the times the reader passes one
export const useTableOfContents = (
    props: UseTableOfContentsProps = {},
): UseTableOfContentsReturn => {
    const {
        items = NO_ITEMS,
        activeIds,
        defaultActiveIds,
        onActiveChange,
        rootMargin = DEFAULT_TABLE_OF_CONTENTS_ROOT_MARGIN,
        threshold = 0,
        scrollElement = null,
        scrollBehavior = "smooth",
    } = props;

    // A caller holding where the reader is takes it from the prop; one that is not leaves the
    // hook holding it instead
    const isControlled = activeIds !== undefined;
    const [selfActiveIds, setSelfActiveIds] = React.useState(defaultActiveIds ?? []);
    const currentActiveIds = isControlled ? activeIds : selfActiveIds;

    const activeItems = items.filter((item) => currentActiveIds.includes(item.value));

    // Where the reader is is reported as it changes, and the document is watched once rather
    // than again on every render, so what the watch needs to read is held aside where it can
    // reach the latest of it without being set up again
    const latest = React.useRef({ items, currentActiveIds, onActiveChange, isControlled });

    React.useEffect(() => {
        latest.current = { items, currentActiveIds, onActiveChange, isControlled };
    });

    const applyActiveIds = React.useCallback((next: string[]) => {
        const read = latest.current;

        // Arriving where the reader already was is not a change, and is not reported as one
        if (sameIds(read.currentActiveIds, next)) {
            return;
        }

        if (!read.isControlled) {
            setSelfActiveIds(next);
        }

        read.onActiveChange?.({
            activeIds: next,
            activeItems: read.items.filter((item) => next.includes(item.value)),
        });
    }, []);

    // The list of headings and the closeness they are watched at are what the watch is built
    // from, so they are read as what they say rather than as the objects they were handed in
    const itemsKey = items.map((item) => item.value).join();
    const thresholdKey = Array.isArray(threshold) ? threshold.join() : String(threshold);

    // The headings and the closeness they are watched at are read as what they say rather than
    // as the objects they were handed in as, so a caller writing the same list out afresh each
    // render does not have the document watched again for it
    React.useEffect(() => {
        const watched = latest.current.items;

        if (watched.length === 0 || typeof IntersectionObserver === "undefined") {
            return;
        }

        // Which headings are on screen at the moment. The observer reports only the ones that
        // have just crossed the band, so the rest are remembered here
        const onScreen = new Map<string, boolean>();

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    onScreen.set(entry.target.id, entry.isIntersecting);
                }

                const next = latest.current.items
                    .filter((item) => onScreen.get(item.value))
                    .map((item) => item.value);

                // Nothing on screen means the reader is somewhere in the middle of a section
                // whose heading has already gone by overhead. They are still under that heading,
                // so the contents are left saying what they were saying
                if (next.length === 0) {
                    return;
                }

                applyActiveIds(next);
            },
            { rootMargin, threshold, root: scrollElement },
        );

        for (const item of watched) {
            const heading = getHeadingElement(item.value);

            if (heading) {
                observer.observe(heading);
            }
        }

        return () => {
            observer.disconnect();
        };
    }, [itemsKey, rootMargin, thresholdKey, scrollElement, applyActiveIds]);

    const scrollTo: UseTableOfContentsReturn["scrollTo"] = (value, details) =>
        scrollToHeading(value, {
            scrollElement,
            behavior: details?.behavior ?? scrollBehavior,
        });

    return {
        items,
        activeIds: currentActiveIds,
        activeItems,
        setActiveIds: applyActiveIds,
        scrollTo,
        getItemState: (item) => ({
            active: currentActiveIds.includes(item.value),
            first: item.value === currentActiveIds[0],
            last: item.value === currentActiveIds[currentActiveIds.length - 1],
            depth: item.depth,
        }),
    };
};
