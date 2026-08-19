import { createContext } from "react";
import type {
    ComboboxContextValue,
    ComboboxItemContextValue,
    ComboboxItemGroupContextValue,
} from "./Combobox.types";

export const ComboboxContext = createContext<ComboboxContextValue | null>(null);

// Which group an item was written in, so that a group can stand down once what was typed has
// left it with nothing to head
export const ComboboxItemGroupContext = createContext<ComboboxItemGroupContextValue | null>(null);

// What the item standing around them is, so that the text and the mark inside it do not each
// have to be told again what they belong to
export const ComboboxItemContext = createContext<ComboboxItemContextValue | null>(null);
