import type { CustomWidthOptions, PaneWidth, PaneWidthValue } from "./PageLayout.types";

// How far short of the viewport a pane is held. The wide figure leaves room for the wider
// page container above that breakpoint
export const PANE_MAX_WIDTH_DIFF = 511;
export const PANE_MAX_WIDTH_DIFF_WIDE = 959;
export const PANE_MAX_WIDTH_DIFF_BREAKPOINT = 1280;

// A sidebar reserves less, since nothing else has to fit beside it
export const SIDEBAR_MAX_WIDTH_DIFF = 256;

// What the widest pane is taken to be before the viewport can be measured
export const SSR_DEFAULT_MAX_WIDTH = 600;

// How far an arrow key moves the divider
// @see https://github.com/github/accessibility/issues/5101#issuecomment-1822870655
export const ARROW_KEY_STEP = 3;

export const defaultPaneWidth: Record<PaneWidth, number> = {
    small: 256,
    medium: 296,
    large: 320,
};

export const isCustomWidthOptions = (width: PaneWidthValue): width is CustomWidthOptions =>
    typeof width === "object" && "min" in width && "default" in width && "max" in width;

export const isPaneWidth = (width: PaneWidthValue): width is PaneWidth =>
    width === "small" || width === "medium" || width === "large";

export const getDefaultPaneWidth = (width: PaneWidthValue) => {
    if (isPaneWidth(width)) {
        return defaultPaneWidth[width];
    }

    if (isCustomWidthOptions(width)) {
        return parseInt(width.default, 10);
    }

    return 0;
};

// Worked out from the viewport alone, rather than read back from the element, so a drag
// never forces the browser to lay the page out again mid-move
export const getMaxWidthDiffFromViewport = () => {
    if (typeof window === "undefined") {
        return PANE_MAX_WIDTH_DIFF;
    }

    return window.innerWidth >= PANE_MAX_WIDTH_DIFF_BREAKPOINT
        ? PANE_MAX_WIDTH_DIFF_WIDE
        : PANE_MAX_WIDTH_DIFF;
};

export const formatPaneValueText = (valueNow: number) => `Pane width ${valueNow} pixels`;

// The handle's ARIA values are written straight to the element, so a drag does not ask
// React to render on every pixel
export const updateAriaValues = (
    handle: HTMLElement | null,
    values: { current?: number; min?: number; max?: number },
) => {
    if (!handle) {
        return;
    }

    if (values.min !== undefined) {
        handle.setAttribute("aria-valuemin", String(values.min));
    }

    if (values.max !== undefined) {
        handle.setAttribute("aria-valuemax", String(values.max));
    }

    if (values.current !== undefined) {
        handle.setAttribute("aria-valuenow", String(values.current));
        handle.setAttribute("aria-valuetext", formatPaneValueText(values.current));
    }
};

type DraggingElements = {
    handle: HTMLElement | null;
    pane: HTMLElement | null;
    contentWrapper: HTMLElement | null;
};

// The handle lights up the moment it is taken hold of, and the pane and the content beside
// it are contained so the rest of the page is left out of the work
export const setDraggingStyles = ({ handle, pane, contentWrapper }: DraggingElements) => {
    handle?.style.setProperty(
        "--drag-handle-background-color",
        "var(--background-color-accent-emphasis)",
    );
    handle?.style.setProperty("--drag-handle-opacity", "1");
    handle?.style.setProperty("--drag-handle-transition", "none");

    pane?.setAttribute("data-dragging", "true");
    contentWrapper?.setAttribute("data-dragging", "true");
};

export const removeDraggingStyles = ({ handle, pane, contentWrapper }: DraggingElements) => {
    handle?.style.removeProperty("--drag-handle-background-color");
    handle?.style.removeProperty("--drag-handle-opacity");
    handle?.style.removeProperty("--drag-handle-transition");

    pane?.removeAttribute("data-dragging");
    contentWrapper?.removeAttribute("data-dragging");
};

// The persisted width is only ever a number of pixels, and storage may be unavailable
export const paneWidthStorage = {
    save: (key: string, width: number) => {
        try {
            localStorage.setItem(key, String(width));
        } catch {
            // Private browsing, a full quota: nothing here is worth failing over
        }
    },
    get: (key: string) => {
        try {
            const stored = localStorage.getItem(key);

            if (stored !== null) {
                const parsed = Number(stored);

                if (!Number.isNaN(parsed) && parsed > 0) {
                    return Math.round(parsed);
                }
            }
        } catch {
            // Storage unavailable
        }

        return null;
    },
};
