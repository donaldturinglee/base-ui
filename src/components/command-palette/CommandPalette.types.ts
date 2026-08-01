import type * as React from "react";
import type { TextInputProps } from "../text-input";

// How well an item answers what was typed, from 1 for an outright match down to 0 for none at
// all. An item worth nothing is left out of the list
export type CommandPaletteFilter = (value: string, search: string, keywords: string[]) => number;

// An item as the palette holds it while it is registered
export type CommandPaletteEntry = {
    // What the item is known by, which is what is handed back when it is picked
    value: string;
    // The id of the element, which the field points at while the item is the one in hand
    id: string;
    // Other words the item can be found under
    keywords: string[];
    // Which group it was written in, so that a group with nothing left in it can stand down
    groupId?: string;
    disabled: boolean;
    // Shown whatever was typed, for an item that is not the list's to filter
    forceMount: boolean;
};

export type CommandPaletteContextValue = {
    // What has been typed
    search: string;
    setSearch: (search: string) => void;
    // The item in hand, which Enter picks and the field points at
    value: string;
    // The id of that item's element, which is what the field points at so that a screen reader
    // reads it without focus ever leaving the field
    activeId?: string;
    setValue: (value: string) => void;
    // Every item still worth showing, best answer first. The order the arrows move in and the
    // order they are laid out in are the same one
    order: string[];
    // Every item that has said it is there, which is what a group reads to know whether it has
    // anything left to head
    entries: CommandPaletteEntry[];
    scores: Record<string, number>;
    register: (entry: CommandPaletteEntry) => void;
    unregister: (value: string) => void;
    onSelect: (value: string) => void;
    listId: string;
    labelId: string;
    // Whether the palette is filtering at all, or the caller is doing it themselves
    shouldFilter: boolean;
};

export type CommandPaletteGroupContextValue = {
    groupId: string;
};

export type CommandPaletteProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onSelect" | "defaultValue"
> & {
    // What has been typed. Left out, the palette keeps its own
    search?: string;
    defaultSearch?: string;
    onSearchChange?: (search: string) => void;
    // The item in hand. Left out, the palette keeps its own and settles it on the best answer
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    // Called with the value of the item that was picked
    onSelect?: (value: string) => void;
    // Stands in for the ranking the palette does itself
    filter?: CommandPaletteFilter;
    // Leaves the items alone, for a caller filtering them against something the palette cannot
    // see, such as a server
    shouldFilter?: boolean;
    // Whether moving off either end of the list comes round to the other
    loop?: boolean;
    // Names the palette to a screen reader
    label?: string;
    className?: string;
};

// `value` and `onChange` are the palette's own, since the field is what it is filtered by
export type CommandPaletteInputProps = Omit<TextInputProps, "value" | "onChange" | "type"> & {
    className?: string;
};

export type CommandPaletteListProps = React.ComponentPropsWithoutRef<"div"> & {
    // How tall the list is allowed to get before it scrolls
    maxHeight?: number;
    className?: string;
};

export type CommandPaletteItemProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onSelect" | "value"
> & {
    // What the item is known by. Taken from the text it is written with where it is left out
    value?: string;
    // Other words the item can be found under
    keywords?: string[];
    disabled?: boolean;
    // Shown whatever was typed, for an item the list is not to filter away
    forceMount?: boolean;
    onSelect?: (value: string) => void;
    className?: string;
};

export type CommandPaletteGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    // Names the run of items below it
    heading?: React.ReactNode;
    // Kept standing even where the filter has left it with nothing in it
    forceMount?: boolean;
    className?: string;
};

export type CommandPaletteEmptyProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type CommandPaletteLoadingProps = React.ComponentPropsWithoutRef<"div"> & {
    // What a screen reader is told while the palette is waiting
    label?: string;
    className?: string;
};

export type CommandPaletteSeparatorProps = React.ComponentPropsWithoutRef<"div"> & {
    // Kept standing while something has been typed, where it would otherwise stand down
    alwaysRender?: boolean;
    className?: string;
};

export type CommandPaletteDialogProps = CommandPaletteProps & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Takes focus once the palette closes, in place of whatever held it beforehand
    returnFocusRef?: React.RefObject<HTMLElement | null>;
    overlayClassName?: string;
};
