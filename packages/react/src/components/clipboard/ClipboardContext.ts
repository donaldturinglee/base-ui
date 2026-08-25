import { createContext, useContext } from "react";
import type { ClipboardContextValue } from "./Clipboard.types";

export const ClipboardContext = createContext<ClipboardContextValue>({});

// What the clipboard around a part is holding, for a control of the caller's own standing among
// the parts. A control standing on its own has no clipboard to read, and reaches for useClipboard
export const useClipboardContext = () => useContext(ClipboardContext);
