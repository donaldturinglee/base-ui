import type * as React from "react";

// Where on the page the menu was asked for. A press leaves nothing standing behind for the
// menu to be measured against, so the point it was made at is measured against instead
export type ContextMenuPoint = {
    x: number;
    y: number;
    // How much room is left around the point. A finger covers what it presses, so a menu
    // opened by one stands clear of it rather than underneath it
    size: number;
};

export type ContextMenuItemVariant = "default" | "danger";

export type ContextMenuProps = {
    // Recommended: a `ContextMenu.Trigger` and a `ContextMenu.Positioner`
    children?: React.ReactNode;
    // Holds the open state outside the menu, alongside `onOpenChange`. A menu opened this
    // way stands where it was last pressed open, and at the top left corner until it has been
    open?: boolean;
    // Opens the menu as it is first drawn, for a menu that keeps its own state
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    // Called with the value of whichever item is picked
    onSelect?: (value: string) => void;
    // Whether picking an item closes the menu. An item can say otherwise for itself
    closeOnSelect?: boolean;
    // Whether the arrow keys come round from the last item to the first, and back again
    loopFocus?: boolean;
    // Whether typing moves the reader to the item that starts with what they typed
    typeahead?: boolean;
    // Leaves the press alone, so the browser answers it with the menu it would have shown
    disabled?: boolean;
    // Which registered portal the menu is rendered into, for a page that keeps more than one
    portalContainerName?: string;
};

export type ContextMenuTriggerProps = React.ComponentPropsWithoutRef<"div"> & {
    // Whatever the menu is about, which is drawn as it was given
    children?: React.ReactNode;
    className?: string;
};

export type ContextMenuPositionerProps = React.ComponentPropsWithoutRef<"div"> & {
    // Recommended: a `ContextMenu.Content`
    children?: React.ReactNode;
    className?: string;
};

export type ContextMenuContentProps = React.ComponentPropsWithoutRef<"div"> & {
    // Names the menu, in place of the area it was opened from
    "aria-label"?: string;
    // Names it after something already on the page, in place of `aria-label`
    "aria-labelledby"?: string;
    className?: string;
};

// `onSelect` means something else on a plain element, so the item's own version replaces it
export type ContextMenuItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
    // What the item stands for, which is what the menu says was picked
    value: string;
    // The words the item is found by when the reader types, where its own text does not say
    valueText?: string;
    disabled?: boolean;
    // Whether picking the item closes the menu, in place of what the menu says
    closeOnSelect?: boolean;
    // Called when the item is picked, by pointer or by key. An item that is disabled is
    // never picked
    onSelect?: () => void;
    variant?: ContextMenuItemVariant;
    className?: string;
};

export type ContextMenuCheckboxItemProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "onSelect"
> & {
    value: string;
    valueText?: string;
    checked: boolean;
    // Called with what the item is to become, since picking it turns it over
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
    closeOnSelect?: boolean;
    className?: string;
};

export type ContextMenuRadioItemGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    // The value of whichever item is picked
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
};

export type ContextMenuRadioItemProps = Omit<React.ComponentPropsWithoutRef<"div">, "onSelect"> & {
    value: string;
    valueText?: string;
    disabled?: boolean;
    closeOnSelect?: boolean;
    className?: string;
};

export type ContextMenuItemGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type ContextMenuItemGroupLabelProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type ContextMenuItemTextProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type ContextMenuItemIndicatorProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type ContextMenuSeparatorProps = React.ComponentPropsWithoutRef<"hr"> & {
    className?: string;
};

export type ContextMenuContextValue = {
    // The area the menu was opened from, which names the menu and takes focus back once it
    // closes
    triggerRef: React.RefObject<HTMLDivElement | null>;
    triggerId: string;
    contentId: string;
    // Where the press that opened the menu landed
    point: ContextMenuPoint;
    open: boolean;
    disabled: boolean;
    closeOnSelect: boolean;
    loopFocus: boolean;
    typeahead: boolean;
    // The value of the item the reader is on, or nothing while they are on none of them
    highlightedValue: string | null;
    portalContainerName?: string;
    onOpen: (point: ContextMenuPoint) => void;
    onClose: () => void;
    // Called by an item once it has been picked, with whether the menu closes on it
    onSelect: (value: string, closeOnSelect: boolean) => void;
    setHighlightedValue: (value: string | null) => void;
};

export type ContextMenuItemContextValue = {
    highlighted: boolean;
    disabled: boolean;
    // Whether the item is picked, for an item that can be
    checked?: boolean;
};

export type ContextMenuItemGroupContextValue = {
    // Names the group, and is what its label is drawn with
    labelId: string;
    // The value of whichever item is picked, for a group whose items are picked one at a time
    value?: string;
    onValueChange?: (value: string) => void;
};
