import type * as React from "react";
import type { Merge } from "../../utilities/polymorphic";
import type { ActionListDescriptionVariant, ActionListItemVariant } from "../action-list";
import type { TextInputProps } from "../text-input";
import type { AnchorAlignment, AnchorSide } from "../tooltip/anchoredPosition";

// Whether one option or several can be picked from the list
export type AutocompleteSelectionVariant = "single" | "multiple";

// A visual is given either as the component to draw, or as something already built: an
// element, or plain text such as a count
export type AutocompleteVisual = React.ElementType | React.ReactNode;

// A step of the overlay width scale, the width of whatever the menu holds, or the width of
// the field the menu stands against
export type AutocompleteOverlayWidth =
    "xsmall" | "small" | "medium" | "large" | "xlarge" | "auto" | "anchor";

// A step of the overlay height scale, or the height of whatever the menu holds
export type AutocompleteOverlayHeight = "small" | "medium" | "large" | "xlarge" | "auto";

// How far the menu grows before it scrolls within itself
export type AutocompleteOverlayMaxHeight = "small" | "medium" | "large" | "xlarge";

// What describes one option. The menu draws its options from these rather than being handed
// elements to render, so that it can filter, complete and order them itself
export type AutocompleteItem = Merge<
    Omit<React.ComponentPropsWithoutRef<"li">, "onSelect">,
    {
        // Tells one option from another, and is unique within the list
        id: string;
        // What the option is filtered and completed by, and what is drawn as its label
        text?: string;
        // Secondary text, which says more about it
        description?: string;
        descriptionVariant?: ActionListDescriptionVariant;
        // Icon (or similar) standing before the text
        leadingVisual?: AutocompleteVisual;
        // Icon or text standing after it
        trailingVisual?: AutocompleteVisual;
        variant?: ActionListItemVariant;
        disabled?: boolean;
        // Stands inside the option, before the text
        children?: React.ReactNode;
        className?: string;
    }
>;

// An option standing for whatever has been typed, so that something the list does not hold
// can still be picked. What it does is held beside it rather than on it, since only the
// option itself is ever drawn
export type AutocompleteAddNewItem<T extends AutocompleteItem = AutocompleteItem> = {
    // The option, which is drawn at the end of the list
    item: T;
    // Called with it once it is picked
    onAdd: (item: T) => void;
};

export type AutocompleteProps = React.PropsWithChildren<{
    // Stands in for the id the combobox would otherwise give itself, which is what the field
    // and the list are named and tied together by
    id?: string;
}>;

// The field is drawn as a `TextInput` unless the caller renders something else in its place,
// and takes that component's props either way. `value` is only ever read: the field is left
// to hold its own text, so that what has been typed can be completed as it stands
export type AutocompleteInputProps<As extends React.ElementType = never> = Merge<
    TextInputProps,
    {
        // Renders the field as something else, for a field the caller draws themselves
        as?: As;
        // Shows the menu as soon as the field takes focus, rather than waiting for something
        // to be typed
        openOnFocus?: boolean;
    }
>;

export type AutocompleteMenuProps<T extends AutocompleteItem = AutocompleteItem> = {
    // The options to pick from. They are filtered against what has been typed here rather
    // than by the caller, since the field completes what is typed with them
    items: T[];
    // The ids of the options that are picked
    selectedItemIds?: string[];
    selectionVariant?: AutocompleteSelectionVariant;
    // Narrows the options against what has been typed. By default an option is kept where
    // its text starts with it, whatever the case
    filter?: (item: T, index: number) => boolean;
    // Orders the options once the menu closes. By default the picked ones are brought to the
    // top, so that they are where they were left next time the menu opens
    sortOnClose?: (itemIdA: string, itemIdB: string) => number;
    // Stands in place of the list where the filter has left it with nothing. `false` draws
    // nothing at all
    emptyStateText?: React.ReactNode | false;
    // An option standing for whatever has been typed, drawn at the end of the list
    addNewItem?: AutocompleteAddNewItem<T>;
    loading?: boolean;
    // Called whenever the menu opens or closes
    onOpenChange?: (open: boolean) => void;
    // Called with every picked option whenever one is picked or dropped. A menu nobody is
    // holding the selection of puts the picked option's text in the field instead
    onSelectedChange?: (items: T[]) => void;
    // The box the list scrolls within, where the menu is drawn somewhere other than inside
    // an `Autocomplete.Overlay`
    customScrollContainerRef?: React.RefObject<HTMLElement | null>;
    // Names the list. The field is what carries the label, so the list has to be pointed at
    // it rather than named again
    "aria-labelledby": string;
    className?: string;
};

export type AutocompleteOverlayProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    // The element the menu is measured against. By default it stands against the field
    menuAnchorRef?: React.RefObject<HTMLElement | null>;
    // Which edge of the anchor the menu stands off
    side?: AnchorSide;
    // Where along that edge it lines up
    align?: AnchorAlignment;
    width?: AutocompleteOverlayWidth;
    height?: AutocompleteOverlayHeight;
    maxHeight?: AutocompleteOverlayMaxHeight;
    // The portal container the menu is rendered into, in place of the default one
    portalContainerName?: string;
    children?: React.ReactNode;
    className?: string;
};

export type AutocompleteContextValue = {
    // Names the combobox, and is what the field and the list are tied together by
    id?: string;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    // The box the menu scrolls within, which the overlay holds where there is one
    scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
    // The option the arrow keys have moved to. The field points at it rather than focusing
    // it, so that focus never leaves the field
    activeDescendantId?: string;
    setActiveDescendantId?: (id: string | undefined) => void;
    showMenu?: boolean;
    setShowMenu?: (show: boolean) => void;
    setInputValue?: (value: string) => void;
    setAutocompleteSuggestion?: (suggestion: string) => void;
};

// What has been typed, which changes on every keystroke and only the field itself has any
// use for
export type AutocompleteInputContextValue = {
    inputValue?: string;
    // The text of the highlighted option, which what has been typed is completed with
    autocompleteSuggestion?: string;
};

// What has been typed, held back to a lower priority. Filtering a long list against every
// keystroke is what would otherwise make typing slow
export type AutocompleteDeferredInputContextValue = {
    deferredInputValue?: string;
};
