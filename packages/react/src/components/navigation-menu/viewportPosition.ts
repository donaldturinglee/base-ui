import type { NavigationMenuPoint, NavigationMenuViewportAlign } from "./NavigationMenu.types";

// How close to the edge of the screen the viewport is let come, in pixels, so that a panel
// lined up against an item at the end of the row is drawn back onto the page rather than off it
const SCREEN_OFFSET = 10;

// Where along one axis the viewport stands, held on the screen. The position is measured against
// the menu while the screen is measured against the page, so where the menu stands is what the
// two are told apart by. A viewport too big for the screen is put against its near edge and left
// to run off the far one, since there is nowhere else for it to go
const keepOnScreen = (position: number, origin: number, size: number, extent: number) => {
    let next = position;

    if (next + origin < SCREEN_OFFSET) {
        next = SCREEN_OFFSET - origin;
    }

    const far = next + origin + size;

    if (far > extent - SCREEN_OFFSET) {
        next -= far - extent + SCREEN_OFFSET;

        if (next < SCREEN_OFFSET - origin) {
            next = SCREEN_OFFSET - origin;
        }
    }

    // Whole pixels, since a viewport standing on a fraction of one blurs whatever it holds
    return Math.round(next);
};

// Where the viewport stands against the menu so that the panel it holds lines up with the open
// item's trigger, on whichever axis the menu runs along. Both axes are worked out the same way,
// and the stylesheet reads whichever one the way the items run calls for
export const getViewportPosition = (
    root: HTMLElement,
    trigger: HTMLElement,
    content: HTMLElement,
    align: NavigationMenuViewportAlign,
): NavigationMenuPoint => {
    const { documentElement } = root.ownerDocument;
    const rootRect = root.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();
    const { offsetWidth, offsetHeight } = content;

    // Where the trigger begins, measured against the menu
    const startX = triggerRect.left - rootRect.left;
    const startY = triggerRect.top - rootRect.top;

    let x = startX;
    let y = startY;

    if (align === "end") {
        x = startX - offsetWidth + triggerRect.width;
        y = startY - offsetHeight + triggerRect.height;
    } else if (align === "center") {
        x = startX - offsetWidth / 2 + triggerRect.width / 2;
        y = startY - offsetHeight / 2 + triggerRect.height / 2;
    }

    return {
        x: keepOnScreen(x, rootRect.left, offsetWidth, documentElement.offsetWidth),
        y: keepOnScreen(y, rootRect.top, offsetHeight, documentElement.offsetHeight),
    };
};
