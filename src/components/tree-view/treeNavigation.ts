// The DOM the tree is read from. Where an item stands, and what is open around it, is held
// on the page rather than in state, so that moving through a tree of thousands of items
// never draws anything that is not moving

const TREE = "[role=tree]";

const TREE_ITEM = "[role=treeitem]";

const COLLAPSED_ITEM = "[role=treeitem][aria-expanded=false]";

const GROUP = "[role=group]";

// How tall a row is taken to be before there is one on the page to measure
const DEFAULT_ITEM_HEIGHT = 32;

// What a screen reader would call the element
export const getAccessibleName = (element: Element) => {
    const label = element.getAttribute("aria-label");

    if (label) {
        return label;
    }

    const labelledBy = element.getAttribute("aria-labelledby");

    if (labelledBy) {
        return document.getElementById(labelledBy)?.textContent ?? "";
    }

    return element.textContent ?? "";
};

// Whether the item is open, can be opened, or holds nothing to open
export const getItemState = (element: HTMLElement) => {
    const expanded = element.getAttribute("aria-expanded");

    if (expanded === "true") {
        return "open";
    }

    if (expanded === "false") {
        return "closed";
    }

    return "end";
};

// Whether the element stands inside a sub-tree that has been closed, and so is on the page
// but not somewhere to move onto
const isWithinCollapsedItem = (element: Element) =>
    Boolean(element.parentElement?.closest(COLLAPSED_ITEM));

export const getFirstChildItem = (element: HTMLElement) => {
    const child = element.querySelector(TREE_ITEM);

    return child instanceof HTMLElement ? child : undefined;
};

export const getParentItem = (element: HTMLElement) => {
    const parent = element.closest(GROUP)?.closest(TREE_ITEM);

    return parent instanceof HTMLElement ? parent : undefined;
};

export const getFirstItem = (element: HTMLElement) => {
    const first = element.closest(TREE)?.querySelector(TREE_ITEM);

    return first instanceof HTMLElement ? first : undefined;
};

export const getLastItem = (element: HTMLElement) => {
    const root = element.closest(TREE);

    if (!root) {
        return undefined;
    }

    const items = Array.from(root.querySelectorAll<HTMLElement>(TREE_ITEM));

    for (let index = items.length - 1; index >= 0; index--) {
        if (!isWithinCollapsedItem(items[index])) {
            return items[index];
        }
    }

    return undefined;
};

// The item before or after this one as the tree reads down the page, stepping over whatever
// stands inside a sub-tree that has been closed
export const getVisibleItem = (element: HTMLElement, direction: "next" | "previous") => {
    const root = element.closest(TREE);

    if (!root) {
        return undefined;
    }

    const items = Array.from(root.querySelectorAll<HTMLElement>(TREE_ITEM));
    const step = direction === "next" ? 1 : -1;

    for (
        let index = items.indexOf(element) + step;
        index >= 0 && index < items.length;
        index += step
    ) {
        if (!isWithinCollapsedItem(items[index])) {
            return items[index];
        }
    }

    return undefined;
};

// Whatever the tree scrolls within, which says how many rows a page of it holds
const getScrollContainer = (element: Element) => {
    let parent = element.parentElement;

    while (parent) {
        const { overflowY } = getComputedStyle(parent);

        if (overflowY === "auto" || overflowY === "scroll") {
            return parent;
        }

        parent = parent.parentElement;
    }

    return undefined;
};

const getPageSize = (root: Element, item: Element | null) => {
    const itemHeight = item?.getBoundingClientRect().height || DEFAULT_ITEM_HEIGHT;
    const availableHeight = getScrollContainer(root)?.clientHeight ?? window.innerHeight;

    return Math.max(Math.floor(availableHeight / itemHeight), 1);
};

const getPageItem = (element: HTMLElement, direction: "next" | "previous") => {
    const root = element.closest(TREE);

    if (!root) {
        return undefined;
    }

    const items = Array.from(root.querySelectorAll<HTMLElement>(TREE_ITEM));

    if (items.length === 0) {
        return undefined;
    }

    const pageSize = getPageSize(root, items[0].firstElementChild);
    const index = items.indexOf(element);
    const page = Math.floor(index / pageSize);
    const offset = index - pageSize * page;
    const target = (page + (direction === "next" ? 1 : -1)) * pageSize + offset;

    return items[Math.min(Math.max(target, 0), items.length - 1)];
};

type ItemLookup = (element: HTMLElement) => HTMLElement | undefined;

// The keys whose meaning depends on whether the item is open. Anything they do not name
// leaves focus where it is, and the item itself sees to opening or closing
const alongTheBranch: Record<string, ItemLookup> = {
    "open ArrowRight": getFirstChildItem,
    "closed ArrowLeft": getParentItem,
    "end ArrowLeft": getParentItem,
};

const branchKeys = new Set(["ArrowLeft", "ArrowRight"]);

// The keys that mean the same thing wherever they are pressed
const acrossTheTree: Record<string, ItemLookup> = {
    ArrowUp: (element) => getVisibleItem(element, "previous"),
    ArrowDown: (element) => getVisibleItem(element, "next"),
    Backspace: getParentItem,
    Home: getFirstItem,
    End: getLastItem,
    PageUp: (element) => getPageItem(element, "previous"),
    PageDown: (element) => getPageItem(element, "next"),
};

// Where a key takes a reader from the item they are on, following the tree pattern:
// https://www.w3.org/WAI/ARIA/apg/patterns/treeview/#keyboard-interaction-24
export const getNextFocusableItem = (element: HTMLElement, key: string) => {
    if (branchKeys.has(key)) {
        return alongTheBranch[`${getItemState(element)} ${key}`]?.(element);
    }

    return acrossTheTree[key]?.(element);
};
