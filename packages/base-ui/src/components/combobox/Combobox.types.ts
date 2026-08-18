import type * as React from "react";
import type { ButtonVisual } from "../button";
import type { TextInputProps } from "../text-input";
import type { AnchorAlignment, AnchorSide } from "../tooltip/anchoredPosition";

// How the list answers what is being typed: not at all, with the best answer taken in hand as
// it is typed, or with that answer written into the field behind the caret so the rest of it
// can be taken by carrying on
export type ComboboxInputBehavior = "none" | "autohighlight" | "autocomplete";

// What becomes of what was typed once something has been picked: it is replaced by the name of
// what was picked, rubbed out so the next one can be typed for, or left exactly as it stands
export type ComboboxSelectionBehavior = "replace" | "clear" | "preserve";

// Whether an item still answers what has been typed. It is handed what the item reads as and
// what stands in the field, and says whether the item is worth showing
export type ComboboxFilter = (label: string, inputValue: string) => boolean;

// An item as the combobox holds it while it is registered. The items are not known until they
// have drawn themselves, since an item can be written anywhere inside the list
export type ComboboxItemEntry = {
    // What the combobox is left holding once the item is picked
    value: string;
    // What the item reads as, which is what typing at the field is matched against
    label: string;
    // The id of the element, which the field points at while the item is the one in hand
    id: string;
    // Which group it was written in, so that a group with nothing left in it can stand down
    groupId?: string;
    disabled: boolean;
};

export type ComboboxContextValue = {
    // The ids the parts point at one another by, so that two comboboxes offering the same
    // items do not both lay claim to the same element
    inputId: string;
    labelId: string;
    listId: string;
    getItemId: (value: string) => string | undefined;

    // What stands in the field
    inputValue: string;
    // What the field would hold were the item in hand taken, which is only ever filled while
    // the combobox is completing what is typed
    completion: string;
    // Called as the reader types, which is the one change that narrows the list
    onType: (inputValue: string) => void;
    // Writes into the field without narrowing anything, for the places the text changes
    // without having been typed
    setInputValue: (inputValue: string) => void;

    // What has been picked. It is always a list, whether or not more than one can be held
    value: string[];
    isSelected: (value: string) => boolean;
    select: (value: string) => void;
    clear: () => void;

    open: boolean;
    // Opens the list without narrowing it, which is what pressing the button reaches for
    setOpen: (open: boolean) => void;
    // Opens it starting from one end or the other, which is what the arrow keys reach for.
    // The items are not there to be pointed at until the list has been drawn, so which end
    // was asked for is remembered and the highlight follows once they arrive
    openAt: (end: "first" | "last") => void;

    // The item in hand, which Enter takes and the field points at
    highlightedValue: string | null;
    setHighlightedValue: (value: string | null) => void;
    // Steps through the items still worth showing, passing over the ones that cannot be picked
    moveHighlight: (step: number) => void;

    // Every item that has said it is there, which is what a group reads to know whether it has
    // anything left to head
    entries: ComboboxItemEntry[];
    register: (entry: ComboboxItemEntry) => void;
    unregister: (value: string) => void;
    // The items still answering what was typed, in the order they were written
    matches: string[];
    isMatch: (value: string) => boolean;

    multiple: boolean;
    disabled: boolean;
    readOnly: boolean;
    invalid: boolean;
    required: boolean;
    placeholder?: string;
    inputBehavior: ComboboxInputBehavior;
    openOnClick: boolean;
    openOnKeyPress: boolean;

    // The field keeps the caret throughout, so every other part hands it back rather than
    // taking it
    inputRef: React.RefObject<HTMLInputElement | null>;
    // What the list is placed against, and what a press has to land outside of to dismiss it
    controlRef: React.RefObject<HTMLDivElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
};

export type ComboboxItemGroupContextValue = {
    groupId: string;
    labelId: string;
};

export type ComboboxItemContextValue = {
    value: string;
    selected: boolean;
    highlighted: boolean;
    disabled: boolean;
};

export type ComboboxProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onSelect" | "defaultValue"
> & {
    // What has been picked. Left out, the combobox keeps its own
    value?: string[];
    defaultValue?: string[];
    onValueChange?: (value: string[]) => void;
    // Called with the value of the item that was picked, whether or not it was already held
    onSelect?: (value: string) => void;

    // What stands in the field. Left out, the combobox keeps its own
    inputValue?: string;
    defaultInputValue?: string;
    onInputValueChange?: (inputValue: string) => void;

    // Whether the list is showing. Left out, the combobox keeps its own
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;

    // The item in hand. Left out, the combobox keeps its own
    highlightedValue?: string | null;
    defaultHighlightedValue?: string | null;
    onHighlightChange?: (highlightedValue: string | null) => void;

    // Whether more than one item can be held at a time
    multiple?: boolean;
    // Whether picking an item takes the list down. Left out, a combobox holding one item at a
    // time closes and one holding several stays open for the next
    closeOnSelect?: boolean;
    selectionBehavior?: ComboboxSelectionBehavior;
    inputBehavior?: ComboboxInputBehavior;
    // Whether the field is allowed to keep text that names no item. Left out, what was typed
    // is put back to what is held once the reader goes elsewhere
    allowCustomValue?: boolean;
    // Whether stepping off either end of the list comes round to the other
    loopFocus?: boolean;

    // Whether clicking the field opens the list
    openOnClick?: boolean;
    // Whether typing opens the list
    openOnChange?: boolean;
    // Whether the arrow keys open the list
    openOnKeyPress?: boolean;

    // Stands in for the ranking the combobox does itself
    filter?: ComboboxFilter;
    // Leaves the items alone, for a caller narrowing them against something the combobox
    // cannot see, such as a server
    shouldFilter?: boolean;

    disabled?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    // Says a choice has to be made, which a caller checks for itself
    required?: boolean;
    placeholder?: string;
    // The name what is picked is submitted under with the form the combobox stands in
    name?: string;
    // The form those values belong to, for a combobox standing outside it
    form?: string;
    className?: string;
};

export type ComboboxLabelProps = React.ComponentPropsWithoutRef<"label"> & {
    className?: string;
};

export type ComboboxControlProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// `value`, `placeholder` and the validation state are the combobox's own, since the field only
// ever shows what it is holding. `type` is dropped because the field is only ever typed into
export type ComboboxInputProps = Omit<
    TextInputProps,
    "value" | "defaultValue" | "type" | "placeholder" | "disabled" | "readOnly" | "required"
> & {
    className?: string;
};

// A button standing inside the field is only ever an icon, so it is named by a label of its
// own rather than by anything on the page. Each carries one already, so a caller only says
// what it is called where the default does not read right
type ComboboxTriggerOwnProps = {
    // What the button is drawn as. Left out, each is the icon that stands for what it does
    icon?: NonNullable<ButtonVisual>;
    className?: string;
};

export type ComboboxTriggerProps = Omit<
    React.ComponentPropsWithoutRef<"button">,
    "aria-labelledby"
> &
    ComboboxTriggerOwnProps;

export type ComboboxClearTriggerProps = ComboboxTriggerProps;

export type ComboboxPositionerProps = React.ComponentPropsWithoutRef<"div"> & {
    // Which edge of the field the list stands off
    side?: AnchorSide;
    // Where along that edge it lines up
    align?: AnchorAlignment;
    // The portal the list is drawn into, for a page that keeps more than one
    portalContainerName?: string;
    className?: string;
};

export type ComboboxContentProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type ComboboxListProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type ComboboxItemGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    // Kept standing even where what was typed has left it with nothing in it
    forceMount?: boolean;
    className?: string;
};

export type ComboboxItemGroupLabelProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type ComboboxItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
    // What the combobox is left holding once the item is picked
    value: string;
    // What the item reads as, which is what typing at the field is matched against. Taken from
    // the text it is written with where it is left out
    label?: string;
    disabled?: boolean;
    onSelect?: (value: string) => void;
    className?: string;
};

export type ComboboxItemTextProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type ComboboxItemIndicatorProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type ComboboxEmptyProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};
