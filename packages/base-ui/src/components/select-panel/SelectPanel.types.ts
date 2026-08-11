import type * as React from "react";
import type { ResponsiveValue } from "../../hooks/useResponsive";
import type { ButtonProps } from "../button";
import type { CheckboxProps } from "../checkbox";
import type { LinkProps } from "../link";
import type { TextInputProps } from "../text-input";
import type { AnchorAlignment, AnchorSide } from "../tooltip/anchoredPosition";

// Where the panel stands. Anchored, it is drawn against whatever opened it; modal, it is
// drawn over the middle of the page
export type SelectPanelVariant = "anchored" | "modal";

// A narrow viewport has no room to stand a panel beside its anchor, so it can be given the
// whole screen or the foot of it instead
export type SelectPanelNarrowVariant = SelectPanelVariant | "full-screen" | "bottom-sheet";

export type SelectPanelResponsiveVariant = ResponsiveValue<
    SelectPanelVariant,
    SelectPanelNarrowVariant
>;

// Whether one item or several can be picked. "instant" takes the first pick as the answer and
// closes the panel with it, so there is nothing left to save
export type SelectPanelSelectionVariant = "single" | "multiple" | "instant";

export type SelectPanelWidth = "small" | "medium" | "large" | "xlarge" | "auto";

// How tall the panel is allowed to grow before the list within it starts to scroll
export type SelectPanelMaxHeight = "small" | "medium" | "large" | "xlarge" | "fit-content";

export type SelectPanelMessageVariant = "warning" | "error" | "empty";

// A full message stands in place of the list; an inline one stands above it
export type SelectPanelMessageSize = "inline" | "full";

// `title` and `onSubmit` both mean something else on a plain div, so the div's own versions
// are dropped in favour of the panel's
export type SelectPanelProps = Omit<React.ComponentPropsWithoutRef<"div">, "title" | "onSubmit"> & {
    // Names the panel to a screen reader as well as titling it
    title: string;
    // Rendered below the title in smaller type, and describes the panel to a screen reader
    description?: string;
    variant?: SelectPanelVariant | SelectPanelResponsiveVariant;
    selectionVariant?: SelectPanelSelectionVariant;
    // Ties the title and the description to the panel. One is made where the caller does not
    // give one
    id?: string;
    // Whether the panel starts open, for a panel the caller is not holding the state of
    defaultOpen?: boolean;
    // Whether the panel is shown. Left out, the panel keeps its own state
    open?: boolean;
    // Stands in for the ref the panel would otherwise hold its anchor with
    anchorRef?: React.RefObject<HTMLButtonElement | null>;
    // Which edge of the anchor an anchored panel stands off
    side?: AnchorSide;
    // Where along that edge it lines up
    align?: AnchorAlignment;
    // Called when the panel is dismissed without the selection being saved
    onCancel?: () => void;
    // Shows a button that clears the selection, and is called when it is pressed. Left out,
    // there is no button
    onClearSelection?: () => void;
    // Called when the selection is saved, which closes the panel
    onSubmit?: (event?: React.FormEvent<HTMLFormElement>) => void;
    width?: SelectPanelWidth;
    maxHeight?: SelectPanelMaxHeight;
    className?: string;
};

export type SelectPanelButtonProps = ButtonProps;

export type SelectPanelHeaderProps = React.ComponentPropsWithoutRef<"div"> & {
    // Shows a button that goes back to wherever the panel was opened from, and is called when
    // it is pressed. Left out, there is no button
    onBack?: () => void;
    className?: string;
};

// `value` and `onChange` are the panel's own, since the field is what the list is filtered by
export type SelectPanelSearchInputProps = Omit<TextInputProps, "onChange"> & {
    // Called as the text changes, and with an empty string when the field is cleared. There
    // is no event to hand back in that second case, so the text comes first
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement> | null) => void;
    className?: string;
};

export type SelectPanelFooterProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// A second thing the footer can do, standing beside saving and cancelling
export type SelectPanelSecondaryActionProps =
    | ({ variant: "button" } & Omit<ButtonProps, "variant">)
    | ({ variant: "link" } & LinkProps)
    | ({ variant: "checkbox" } & CheckboxProps);

export type SelectPanelLoadingProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

// A title only belongs to a full message, since an inline one is a single line of text. An
// empty list is only ever reported in full, since there is no list left for a line to stand
// above
export type SelectPanelMessageProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
} & (
        | { variant: "empty"; size?: "full"; title: string }
        | { variant: "warning" | "error"; size: "full"; title: string }
        | { variant: "warning" | "error"; size?: "inline"; title?: never }
    );

export type SelectPanelContextValue = {
    panelId?: string;
    title?: string;
    description?: string;
    selectionVariant?: SelectPanelSelectionVariant;
    // The text the list is filtered by, which the panel keeps for a field the caller is not
    // holding the value of
    searchQuery?: string;
    setSearchQuery?: (value: string) => void;
    // Held by the panel so that it can open with the field that filters it
    searchInputRef?: React.RefObject<HTMLInputElement | null>;
    onCancel?: () => void;
    onClearSelection?: () => void;
    // Moves focus onto the first thing in the list, which is where the down arrow goes from
    // the search field
    moveFocusToList?: () => void;
};
