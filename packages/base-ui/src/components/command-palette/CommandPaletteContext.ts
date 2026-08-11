import { createContext } from "react";
import type {
    CommandPaletteContextValue,
    CommandPaletteGroupContextValue,
} from "./CommandPalette.types";

export const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

// Which group an item was written in, so that a group can stand down once the filter has left
// it with nothing
export const CommandPaletteGroupContext = createContext<CommandPaletteGroupContextValue | null>(
    null,
);
