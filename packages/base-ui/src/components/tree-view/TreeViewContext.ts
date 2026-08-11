import * as React from "react";

export type TreeViewRootContextValue = {
    // Says something about the tree to a screen reader, for changes it would otherwise
    // read nothing about
    announceUpdate: (message: string) => void;
    // Whether an item is open is remembered here rather than by the item, since an item
    // inside a closed sub-tree is taken off the page and would forget it otherwise
    expandedStateCache: React.RefObject<Map<string, boolean> | null>;
    // Brings an element into view, holding the request back to one a frame so that a held
    // arrow key lays the page out once rather than once a keystroke
    scrollElementIntoView: (element: Element | null | undefined) => void;
};

export const TreeViewRootContext = React.createContext<TreeViewRootContextValue>({
    announceUpdate: () => {},
    expandedStateCache: { current: new Map() },
    scrollElementIntoView: () => {},
});

export type TreeViewItemContextValue = {
    itemId: string;
    // How deep the item stands, counting the roots as the first level
    level: number;
    isSubTreeEmpty: boolean;
    setIsSubTreeEmpty: React.Dispatch<React.SetStateAction<boolean>>;
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
    leadingVisualId: string;
    trailingVisualId: string;
    trailingActionId: string;
};

export const TreeViewItemContext = React.createContext<TreeViewItemContextValue>({
    itemId: "",
    level: 1,
    isSubTreeEmpty: false,
    setIsSubTreeEmpty: () => {},
    isExpanded: false,
    setIsExpanded: () => {},
    leadingVisualId: "",
    trailingVisualId: "",
    trailingActionId: "",
});

// Tells the row standing in for what is being fetched that that is what it is, so that it
// can be drawn as a placeholder rather than as something to reach for. It is kept off the
// item's own props, since it is nothing a caller has any use for
export const TreeViewLoadingPlaceholderContext = React.createContext(false);
