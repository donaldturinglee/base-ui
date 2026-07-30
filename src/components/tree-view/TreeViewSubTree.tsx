import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { SkeletonAvatar } from "../skeleton-avatar";
import { SkeletonText } from "../skeleton-text";
import { Spinner } from "../spinner";
import { Text } from "../text";
import TreeViewItem from "./TreeViewItem";
import TreeViewLeadingVisual from "./TreeViewLeadingVisual";
import {
    TreeViewItemContext,
    TreeViewLoadingPlaceholderContext,
    TreeViewRootContext,
} from "./TreeViewContext";
import { getAccessibleName, getFirstChildItem } from "./treeNavigation";
import type { TreeViewSubTreeProps } from "./TreeView.types";

const classes = {
    root: "list-none m-0 p-0",
    // A row standing in for one still being fetched, drawn at the height a real row would
    // stand at so that the tree does not jump as they arrive
    skeletonRow:
        "flex items-center gap-[var(--base-size-8)] h-[2rem] [@media(pointer:coarse)]:h-[2.75rem]",
    skeletonText: "w-[var(--tree-view-skeleton-width)]",
    muted: "[color:var(--foreground-color-muted)]",
    hidden: "sr-only",
};

// The rows are drawn at a handful of widths in turn, so that a block of them reads as names
// of different lengths rather than as one solid shape
const SKELETON_WIDTHS = ["67%", "47%", "73%", "64%", "50%"];

// Whatever the value was the last time round, which is how the sub-tree tells having just
// finished fetching from having been finished all along
const usePreviousValue = <T,>(value: T) => {
    const previous = React.useRef(value);

    React.useEffect(() => {
        previous.current = value;
    }, [value]);

    return previous.current;
};

const SkeletonRow = ({ index }: { index: number }) => (
    <span
        className={classes.skeletonRow}
        style={
            {
                "--tree-view-skeleton-width": SKELETON_WIDTHS[index % SKELETON_WIDTHS.length],
            } as React.CSSProperties
        }
        aria-hidden="true"
    >
        <SkeletonAvatar size={16} shape="square" />
        <SkeletonText className={classes.skeletonText} />
    </span>
);

// Stands in place of the sub-tree while it is being fetched
const LoadingItem = React.forwardRef<HTMLLIElement, { count?: number }>(({ count }, ref) => {
    const itemId = useId();

    return (
        <TreeViewLoadingPlaceholderContext.Provider value={true}>
            <TreeViewItem ref={ref} id={itemId}>
                {count ? (
                    <>
                        {Array.from({ length: count }, (_, index) => (
                            <SkeletonRow key={index} index={index} />
                        ))}
                        <span className={classes.hidden}>Loading {count} items</span>
                    </>
                ) : (
                    <>
                        <TreeViewLeadingVisual>
                            <Spinner size="small" srText={null} />
                        </TreeViewLeadingVisual>
                        <Text className={classes.muted}>Loading...</Text>
                    </>
                )}
            </TreeViewItem>
        </TreeViewLoadingPlaceholderContext.Provider>
    );
});

LoadingItem.displayName = "TreeView.LoadingItem";

// Stands in place of a sub-tree that turned out to hold nothing. It says nothing about
// being open, since there is nothing there to open
const EmptyItem = () => (
    <TreeViewItem id={useId()} expanded={null}>
        <Text className={classes.muted}>No items found</Text>
    </TreeViewItem>
);

// The part of the tree standing under an item. It is only drawn while that item is open, so
// that a tree of thousands of rows only ever holds the ones that can be seen
function TreeViewSubTree(props: TreeViewSubTreeProps) {
    const { count, state, children, "aria-label": ariaLabel } = props;

    const { announceUpdate } = React.useContext(TreeViewRootContext);
    const { itemId, isExpanded, isSubTreeEmpty, setIsSubTreeEmpty } =
        React.useContext(TreeViewItemContext);

    const listRef = React.useRef<HTMLUListElement>(null);
    const loadingItemRef = React.useRef<HTMLLIElement>(null);
    const [loadingFocused, setLoadingFocused] = React.useState(false);
    const [subTreeLabel, setSubTreeLabel] = React.useState("");
    const previousState = usePreviousValue(state);

    // Where nothing is said about fetching, what the sub-tree holds is all it will ever
    // hold; where the fetching is done, what arrived is what it holds
    React.useEffect(() => {
        if (state !== undefined && state !== "done") {
            return;
        }

        setIsSubTreeEmpty(!children);
    }, [state, children, setIsSubTreeEmpty]);

    React.useEffect(() => {
        const parent = document.getElementById(itemId);

        if (!parent) {
            return;
        }

        const parentName = getAccessibleName(parent);
        setSubTreeLabel(parentName);

        if (state === "loading") {
            announceUpdate(`${parentName} content loading`);
            return;
        }

        if (previousState !== "loading" || state !== "done") {
            return;
        }

        announceUpdate(
            listRef.current?.childElementCount
                ? `${parentName} content loaded`
                : `${parentName} is empty`,
        );

        // A reader waiting on the placeholder is moved onto what arrived, since the row
        // they were on is about to be taken off the page
        if (!loadingFocused) {
            return;
        }

        const timeout = window.setTimeout(() => {
            (getFirstChildItem(parent) ?? parent).focus();
        });

        setLoadingFocused(false);

        return () => {
            window.clearTimeout(timeout);
        };
    }, [itemId, state, previousState, loadingFocused, announceUpdate]);

    React.useEffect(() => {
        const loadingItem = loadingItemRef.current;

        if (!loadingItem) {
            return;
        }

        const handleFocus = () => setLoadingFocused(true);

        const handleBlur = (event: FocusEvent) => {
            // A blur with nothing to move to is the row being taken off the page rather
            // than the reader leaving it, and the reader still has to be sent somewhere
            if (!event.relatedTarget) {
                return;
            }

            setLoadingFocused(false);
        };

        loadingItem.addEventListener("focus", handleFocus);
        loadingItem.addEventListener("blur", handleBlur);

        return () => {
            loadingItem.removeEventListener("focus", handleFocus);
            loadingItem.removeEventListener("blur", handleBlur);
        };
    }, [state]);

    if (!isExpanded) {
        return null;
    }

    return (
        <ul
            ref={listRef}
            role="group"
            aria-label={ariaLabel || subTreeLabel}
            className={classNames(classes.root)}
            data-component="TreeView.SubTree"
        >
            {state === "loading" ? <LoadingItem ref={loadingItemRef} count={count} /> : children}
            {isSubTreeEmpty && state !== "loading" ? <EmptyItem /> : null}
        </ul>
    );
}

TreeViewSubTree.displayName = "TreeView.SubTree";

export default TreeViewSubTree;
