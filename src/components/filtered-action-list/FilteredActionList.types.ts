import type * as React from "react";
import type { Merge } from "../../utilities/polymorphic";
import type {
    ActionListDescriptionVariant,
    ActionListGroupVariant,
    ActionListItemVariant,
    ActionListProps,
    ActionListSelectEvent,
    ActionListSelectionVariant,
} from "../action-list";
import type { TextInputProps } from "../text-input";

// Where the wait is shown. The body kinds stand in place of the list; "input" leaves the
// list where it is and shows the spinner in the field instead
export type FilteredActionListLoadingType = "body-spinner" | "body-skeleton" | "input";

// What describes one item. The list draws its items from these rather than being handed
// elements to render, so that only the items in view need be built
export type FilteredActionListItemProps = {
    // Primary text, which names the item
    text?: string;
    // Secondary text, which says more about it
    description?: string;
    descriptionVariant?: ActionListDescriptionVariant;
    // Icon (or similar) standing before the text
    leadingVisual?: React.ElementType;
    // Icon or text standing after it
    trailingVisual?: React.ElementType | React.ReactNode;
    variant?: ActionListItemVariant;
    selected?: boolean;
    disabled?: boolean;
    // Which group the item belongs to, in a grouped list
    groupId?: string;
    // Called when the item is picked, by pointer or by key
    onAction?: (item: FilteredActionListItemProps, event: ActionListSelectEvent) => void;
    // Tells one item from another, and is unique within the list
    id?: number | string;
    // Stands inside the item, before the text
    children?: React.ReactNode;
    className?: string;
};

// Draws an item in place of the list's own rendering, for an item the list has no way to
// describe
export type FilteredActionListRenderItem = (
    item: FilteredActionListItemProps,
) => React.ReactElement;

// An item as it is passed in: what describes it, whatever else belongs on the element it is
// drawn as, and a key of its own where its `id` does not stand for one
export type FilteredActionListItemInput = Merge<
    Omit<React.ComponentPropsWithoutRef<"li">, "onSelect">,
    FilteredActionListItemProps
> & {
    key?: React.Key;
    renderItem?: FilteredActionListRenderItem;
};

// Names a group of items and says how it is set apart. The items themselves say which group
// they belong to, and the groups are drawn in the order they are given here
export type FilteredActionListGroup = {
    groupId: string;
    header?: {
        title?: string;
        variant?: ActionListGroupVariant;
    };
};

// What the list is told in place of the items, where a filter has left it with none
export type FilteredActionListMessageText = {
    title: string;
    description: string;
};

// `value` and `onChange` are the list's own, since the field is what the list is filtered by
export type FilteredActionListInputProps = Omit<TextInputProps, "value" | "onChange"> & {
    inputRef: React.Ref<HTMLInputElement | null>;
    value: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onInputKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    placeholderText?: string;
    // The list the field filters, which it is read as controlling
    listId: string;
    // Says that the list is filtered as the reader types
    inputDescriptionId: string;
    loading?: boolean;
};

export type FilteredActionListBodyLoaderProps = React.ComponentPropsWithoutRef<"div"> & {
    loadingType: FilteredActionListLoadingType;
    // How much room there is to fill, which says how many skeleton rows are drawn
    height?: number;
    className?: string;
};

export type FilteredActionListProps = {
    // The items to show. Filtering them is the caller's, so that the list can be filtered
    // against whatever holds them, near or far
    items: FilteredActionListItemInput[];
    // Collects the items under headings of their own. A grouped list is never virtualised,
    // since a list small enough to be grouped is small enough to draw whole
    groupMetadata?: FilteredActionListGroup[];
    // The text the list is filtered by. Left out, the field keeps its own
    filterValue?: string;
    // Called as the text changes, so that the caller can filter the items it passes back
    onFilterChange: (value: string, event: React.ChangeEvent<HTMLInputElement> | null) => void;
    placeholderText?: string;
    loading?: boolean;
    loadingType?: FilteredActionListLoadingType;
    // Stands in place of the list, for a list with nothing to show
    message?: React.ReactNode;
    // What a screen reader is told in place of the list, where there is nothing to show
    messageText?: FilteredActionListMessageText;
    selectionVariant?: ActionListSelectionVariant;
    showItemDividers?: boolean;
    // Shows a box above the list that picks every item at once. Left out, there is no box
    onSelectAllChange?: (checked: boolean) => void;
    // Draws every item that has no renderer of its own
    renderItem?: FilteredActionListRenderItem;
    // Whether the list is announced as it is filtered
    announcementsEnabled?: boolean;
    // Whether only the items in view are drawn, which is what keeps a list of more than a
    // hundred items quick. It is a client-side saving alone: the caller still passes every
    // item, and the list draws the few that can be seen. It has no effect on a grouped list
    virtualized?: boolean;
    textInputProps?: Partial<Omit<TextInputProps, "value" | "onChange">>;
    actionListProps?: Partial<ActionListProps>;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    // A ref of the caller's own on the box the list scrolls within
    scrollContainerRef?: React.Ref<HTMLDivElement | null>;
    // Called with the element the list is drawn as, as it arrives and as it goes
    onListContainerRefChanged?: (element: HTMLUListElement | null) => void;
    // Called with the ref the field is held by, once it is held
    onInputRefChanged?: (ref: React.RefObject<HTMLInputElement | null>) => void;
    className?: string;
};
