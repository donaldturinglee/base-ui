import { createContext } from "react";
import type { ClipboardTextContextValue } from "./ClipboardText.types";

export const ClipboardTextContext = createContext<ClipboardTextContextValue>({});
