import ResizableBase from "./Resizable";
import ResizablePanel from "./ResizablePanel";
import ResizableResizeTrigger from "./ResizableResizeTrigger";
import ResizableResizeTriggerIndicator from "./ResizableResizeTriggerIndicator";
import ResizableResizeTriggerSeparator from "./ResizableResizeTriggerSeparator";

export const Resizable = Object.assign(ResizableBase, {
    Panel: ResizablePanel,
    ResizeTrigger: ResizableResizeTrigger,
    ResizeTriggerSeparator: ResizableResizeTriggerSeparator,
    ResizeTriggerIndicator: ResizableResizeTriggerIndicator,
});

export {
    ResizablePanel,
    ResizableResizeTrigger,
    ResizableResizeTriggerSeparator,
    ResizableResizeTriggerIndicator,
};
export * from "./Resizable.types";
