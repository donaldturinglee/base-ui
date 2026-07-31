import AutocompleteBase from "./Autocomplete";
import AutocompleteInput from "./AutocompleteInput";
import AutocompleteMenu from "./AutocompleteMenu";
import AutocompleteOverlay from "./AutocompleteOverlay";

export const Autocomplete = Object.assign(AutocompleteBase, {
    Input: AutocompleteInput,
    Menu: AutocompleteMenu,
    Overlay: AutocompleteOverlay,
});

export { AutocompleteInput, AutocompleteMenu, AutocompleteOverlay };
export {
    AutocompleteContext,
    AutocompleteInputContext,
    AutocompleteDeferredInputContext,
} from "./AutocompleteContext";
export * from "./Autocomplete.types";
