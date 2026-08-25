import ClipboardBase from "./Clipboard";
import ClipboardControl from "./ClipboardControl";
import ClipboardCopyText from "./ClipboardCopyText";
import ClipboardIndicator from "./ClipboardIndicator";
import ClipboardInput from "./ClipboardInput";
import ClipboardLabel from "./ClipboardLabel";
import ClipboardTrigger from "./ClipboardTrigger";
import ClipboardValueText from "./ClipboardValueText";

export const Clipboard = Object.assign(ClipboardBase, {
    // Named as the root in its own right as well as by the compound itself, so either reads the
    // same and a clipboard written out in full is written the way it is read
    Root: ClipboardBase,
    Label: ClipboardLabel,
    Control: ClipboardControl,
    Input: ClipboardInput,
    Trigger: ClipboardTrigger,
    Indicator: ClipboardIndicator,
    CopyText: ClipboardCopyText,
    ValueText: ClipboardValueText,
});

export {
    ClipboardLabel,
    ClipboardControl,
    ClipboardInput,
    ClipboardTrigger,
    ClipboardIndicator,
    ClipboardCopyText,
    ClipboardValueText,
};
export { ClipboardContext, useClipboardContext } from "./ClipboardContext";
export { useClipboard } from "./useClipboard";
export { copyText } from "./copyText";
export * from "./Clipboard.types";
