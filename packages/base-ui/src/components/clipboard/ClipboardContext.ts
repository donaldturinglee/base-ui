import { createContext } from "react";
import type { ClipboardContextValue } from "./Clipboard.types";

export const ClipboardContext = createContext<ClipboardContextValue>({});
