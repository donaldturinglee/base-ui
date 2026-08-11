import { createContext } from "react";
import type { DialogContextValue } from "./Dialog.types";

// Undefined outside a dialog, so anything that behaves differently within one can tell
export const DialogContext = createContext<DialogContextValue | undefined>(undefined);
