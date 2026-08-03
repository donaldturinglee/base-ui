import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../utilities/classnames";
import { TreeViewRootContext } from "./TreeViewContext";
import type { TreeViewRootContextValue } from "./TreeViewContext";
import { useRovingTabIndex } from "./useRovingTabIndex";
import { useTypeahead } from "./useTypeahead";
import type { TreeViewProps } from "./TreeView.types";

const classes = {
    root: "tree-view",
    hover: "tree-view-hover",
    coarse: "tree-view-coarse",
    hidden: "sr-only",
};

// A list of things that hold more of themselves. Moving through it is by arrow key rather
// than by tab, so that a tree of a thousand rows is one stop on the way through the page
function TreeView(
    props: TreeViewProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { children, className, flat, truncate = true, ...rest } = props;

    const containerRef = React.useRef<HTMLUListElement>(null);
    const mergedRef = useMergedRefs(ref, containerRef);

    const [announcement, setAnnouncement] = React.useState("");
    const announceUpdate = React.useCallback((message: string) => setAnnouncement(message), []);

    useRovingTabIndex({ containerRef });
    useTypeahead({
        containerRef,
        onFocusChange: (element) => element.focus(),
    });

    // Scrolling is held back to one request a frame, so that an arrow key held down lays
    // the page out once a frame rather than once a keystroke
    const pendingScroll = React.useRef<number | null>(null);

    const scrollElementIntoView = React.useCallback((element: Element | null | undefined) => {
        if (!element) {
            return;
        }

        if (pendingScroll.current !== null) {
            cancelAnimationFrame(pendingScroll.current);
        }

        pendingScroll.current = requestAnimationFrame(() => {
            pendingScroll.current = null;

            if (element.isConnected) {
                element.scrollIntoView({ block: "nearest", inline: "nearest" });
            }
        });
    }, []);

    React.useEffect(
        () => () => {
            if (pendingScroll.current !== null) {
                cancelAnimationFrame(pendingScroll.current);
            }
        },
        [],
    );

    const expandedStateCache = React.useRef<Map<string, boolean> | null>(null);

    expandedStateCache.current ??= new Map();

    const rootContextValue = React.useMemo<TreeViewRootContextValue>(
        () => ({ announceUpdate, expandedStateCache, scrollElementIntoView }),
        [announceUpdate, scrollElementIntoView],
    );

    return (
        <TreeViewRootContext.Provider value={rootContextValue}>
            {/* Sub-trees arrive and empty out under a reader whose focus never leaves the
                row it is on, so what happened is announced from here */}
            <span
                role="status"
                aria-live="polite"
                className={classes.hidden}
                data-component="TreeView.Announcement"
            >
                {announcement}
            </span>
            <ul
                ref={mergedRef}
                role="tree"
                className={classNames(classes.root, classes.hover, classes.coarse, className)}
                data-component="TreeView"
                data-omit-spacer={flat ? "true" : undefined}
                data-truncate-text={truncate ? "true" : "false"}
                {...rest}
            >
                {children}
            </ul>
        </TreeViewRootContext.Provider>
    );
}

TreeView.displayName = "TreeView";

export default React.forwardRef(TreeView);
