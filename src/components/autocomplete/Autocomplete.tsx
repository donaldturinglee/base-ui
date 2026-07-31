import * as React from "react";
import { useId } from "../../hooks/useId";
import {
    AutocompleteContext,
    AutocompleteDeferredInputContext,
    AutocompleteInputContext,
} from "./AutocompleteContext";
import type { AutocompleteProps } from "./Autocomplete.types";

// A field that completes what is typed into it from a list of options standing under it. The
// field, the list and the surface the list is drawn on are separate parts, so that the list
// can be put wherever it belongs on the page; this holds what they have to agree on
function Autocomplete({ children, id: idProp }: AutocompleteProps) {
    const id = useId(idProp);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const [inputValue, setInputValue] = React.useState("");
    const [autocompleteSuggestion, setAutocompleteSuggestion] = React.useState("");
    const [activeDescendantId, setActiveDescendantId] = React.useState<string>();
    const [isMenuShowing, setIsMenuShowing] = React.useState(false);

    const setShowMenu = React.useCallback((show: boolean) => {
        setIsMenuShowing(show);

        // Nothing is highlighted in a menu that is not showing, and the completion the
        // highlight stood for goes with it, leaving the field holding what was typed
        if (!show) {
            setActiveDescendantId(undefined);
            setAutocompleteSuggestion("");
        }
    }, []);

    const context = React.useMemo(
        () => ({
            id,
            inputRef,
            scrollContainerRef,
            activeDescendantId,
            setActiveDescendantId,
            showMenu: isMenuShowing,
            setShowMenu,
            setInputValue,
            setAutocompleteSuggestion,
        }),
        [id, activeDescendantId, isMenuShowing, setShowMenu],
    );

    const inputContext = React.useMemo(
        () => ({ inputValue, autocompleteSuggestion }),
        [inputValue, autocompleteSuggestion],
    );

    // Filtering a long list is the expensive part of typing, so the menu is handed what was
    // typed at a lower priority than the keystroke that typed it and the field stays quick
    const deferredInputValue = React.useDeferredValue(inputValue);
    const deferredInputContext = React.useMemo(
        () => ({ deferredInputValue }),
        [deferredInputValue],
    );

    return (
        <AutocompleteContext.Provider value={context}>
            <AutocompleteInputContext.Provider value={inputContext}>
                <AutocompleteDeferredInputContext.Provider value={deferredInputContext}>
                    {children}
                </AutocompleteDeferredInputContext.Provider>
            </AutocompleteInputContext.Provider>
        </AutocompleteContext.Provider>
    );
}

Autocomplete.displayName = "Autocomplete";

export default Autocomplete;
