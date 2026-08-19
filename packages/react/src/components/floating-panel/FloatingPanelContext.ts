import { createContext, useContext } from "react";
import { DEFAULT_FLOATING_PANEL_POSITION, DEFAULT_FLOATING_PANEL_SIZE } from "./floatingPanelRect";
import type { FloatingPanelContextValue } from "./FloatingPanel.types";

// The default stands in for a root that is not there, so a part rendered on its own still reads
// rather than throwing. Nothing can be dragged without a root to hold where it was dragged to, so
// the gestures are left as no-ops
export const FloatingPanelContext = createContext<FloatingPanelContextValue>({
    open: false,
    setOpen: () => undefined,
    position: DEFAULT_FLOATING_PANEL_POSITION,
    size: DEFAULT_FLOATING_PANEL_SIZE,
    stage: "default",
    setStage: () => undefined,
    dragging: false,
    resizing: false,
    draggable: false,
    resizable: false,
    canDrag: false,
    canResize: false,
    disabled: false,
    strategy: "fixed",
    triggerId: "",
    contentId: "",
    titleId: "",
    startDrag: () => undefined,
    startResize: () => undefined,
    moveBy: () => undefined,
    resizeBy: () => undefined,
});

export const useFloatingPanelContext = () => useContext(FloatingPanelContext);
