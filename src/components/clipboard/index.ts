import ClipboardBase from "./Clipboard";
import ClipboardIndicator from "./ClipboardIndicator";
import ClipboardInput from "./ClipboardInput";
import ClipboardTrigger from "./ClipboardTrigger";

export const Clipboard = Object.assign(ClipboardBase, {
    Input: ClipboardInput,
    Trigger: ClipboardTrigger,
    Indicator: ClipboardIndicator,
});

export { ClipboardInput, ClipboardTrigger, ClipboardIndicator };
export { ClipboardContext } from "./ClipboardContext";
export { copyText } from "./copyText";
export * from "./Clipboard.types";
