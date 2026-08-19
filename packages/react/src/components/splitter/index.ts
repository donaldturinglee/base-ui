import SplitterBase from "./Splitter";
import SplitterPanel from "./SplitterPanel";
import SplitterResizeTrigger from "./SplitterResizeTrigger";
import SplitterResizeTriggerIndicator from "./SplitterResizeTriggerIndicator";
import SplitterResizeTriggerSeparator from "./SplitterResizeTriggerSeparator";

export const Splitter = Object.assign(SplitterBase, {
    Panel: SplitterPanel,
    ResizeTrigger: SplitterResizeTrigger,
    ResizeTriggerSeparator: SplitterResizeTriggerSeparator,
    ResizeTriggerIndicator: SplitterResizeTriggerIndicator,
});

export {
    SplitterPanel,
    SplitterResizeTrigger,
    SplitterResizeTriggerSeparator,
    SplitterResizeTriggerIndicator,
};
export * from "./Splitter.types";
