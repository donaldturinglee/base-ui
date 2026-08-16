import FloatingPanelBase from "./FloatingPanel";
import FloatingPanelBody from "./FloatingPanelBody";
import FloatingPanelCloseTrigger from "./FloatingPanelCloseTrigger";
import FloatingPanelContent from "./FloatingPanelContent";
import FloatingPanelControl from "./FloatingPanelControl";
import FloatingPanelDragTrigger from "./FloatingPanelDragTrigger";
import FloatingPanelHeader from "./FloatingPanelHeader";
import FloatingPanelPositioner from "./FloatingPanelPositioner";
import FloatingPanelResizeTrigger from "./FloatingPanelResizeTrigger";
import FloatingPanelStageTrigger from "./FloatingPanelStageTrigger";
import FloatingPanelTitle from "./FloatingPanelTitle";
import FloatingPanelTrigger from "./FloatingPanelTrigger";

export const FloatingPanel = Object.assign(FloatingPanelBase, {
    Trigger: FloatingPanelTrigger,
    Positioner: FloatingPanelPositioner,
    Content: FloatingPanelContent,
    DragTrigger: FloatingPanelDragTrigger,
    Header: FloatingPanelHeader,
    Title: FloatingPanelTitle,
    Control: FloatingPanelControl,
    StageTrigger: FloatingPanelStageTrigger,
    CloseTrigger: FloatingPanelCloseTrigger,
    Body: FloatingPanelBody,
    ResizeTrigger: FloatingPanelResizeTrigger,
});

export {
    FloatingPanelTrigger,
    FloatingPanelPositioner,
    FloatingPanelContent,
    FloatingPanelDragTrigger,
    FloatingPanelHeader,
    FloatingPanelTitle,
    FloatingPanelControl,
    FloatingPanelStageTrigger,
    FloatingPanelCloseTrigger,
    FloatingPanelBody,
    FloatingPanelResizeTrigger,
};
export { FloatingPanelContext, useFloatingPanelContext } from "./FloatingPanelContext";
export {
    DEFAULT_FLOATING_PANEL_MIN_SIZE,
    DEFAULT_FLOATING_PANEL_POSITION,
    DEFAULT_FLOATING_PANEL_SIZE,
    FLOATING_PANEL_LARGE_STEP,
    FLOATING_PANEL_STEP,
} from "./floatingPanelRect";
export * from "./FloatingPanel.types";
