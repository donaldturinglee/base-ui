import ClipboardTextBase from "./ClipboardText";
import ClipboardTextIndicator from "./ClipboardTextIndicator";
import ClipboardTextInput from "./ClipboardTextInput";
import ClipboardTextTrigger from "./ClipboardTextTrigger";

export const ClipboardText = Object.assign(ClipboardTextBase, {
    Input: ClipboardTextInput,
    Trigger: ClipboardTextTrigger,
    Indicator: ClipboardTextIndicator,
});

export { ClipboardTextInput, ClipboardTextTrigger, ClipboardTextIndicator };
export { ClipboardTextContext } from "./ClipboardTextContext";
export { copyText } from "./copyText";
export * from "./ClipboardText.types";
