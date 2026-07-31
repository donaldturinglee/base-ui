import { createContext } from "react";
import type {
    AutocompleteContextValue,
    AutocompleteDeferredInputContextValue,
    AutocompleteInputContextValue,
} from "./Autocomplete.types";

// Refs, the id the combobox is tied together by, and whether the menu is showing. None of
// this changes as the reader types, so anything taking only this — the overlay, which has
// to be placed again whenever it changes — is left alone between keystrokes
export const AutocompleteContext = createContext<AutocompleteContextValue>({});

// What has been typed. Only the field has any use for it, and it changes on every keystroke,
// so it is kept apart from the rest
export const AutocompleteInputContext = createContext<AutocompleteInputContextValue>({});

// What has been typed, held back to a lower priority. The menu filters against this rather
// than against the field itself, so that a long list does not have to be filtered before the
// next keystroke can be drawn
export const AutocompleteDeferredInputContext =
    createContext<AutocompleteDeferredInputContextValue>({});
