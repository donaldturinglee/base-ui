import type * as React from "react";
import type { TextDirection } from "../../providers/direction/Direction.types";
import type { PolymorphicProps } from "../../utilities/polymorphic";
import type { CaretProps } from "../caret";

// Which way the items run, and so which keys move along them and which key steps into a panel.
// It also settles where a panel stands: under its item across a row, and beside it down a column
export type NavigationMenuOrientation = "horizontal" | "vertical";

// Where along the open item the shared panel lines up, for a menu that draws every panel in the
// one viewport rather than under the item that opened it
export type NavigationMenuViewportAlign = "start" | "center" | "end";

// Which way a panel arrives from as one item's gives way to another's in the viewport: from the
// end of the row where the reader moved on along it, and from the start where they moved back
export type NavigationMenuMotion = "from-start" | "from-end";

// Which end of a panel focus is stepped into from: the start on the way in from its trigger, the
// end on the way back in from whatever stands after it
export type NavigationMenuFocusSide = "start" | "end";

export type NavigationMenuValueChangeDetails = {
    // The item whose panel stands open, by the value it was given. Empty where none does
    value: string;
};

export type NavigationMenuProps = Omit<React.ComponentPropsWithoutRef<"nav">, "defaultValue"> & {
    children?: React.ReactNode;
    // Which item stands open, by the value it was given, where the caller keeps hold of that.
    // Empty where none does
    value?: string;
    // Which item stands open to begin with, for a menu that keeps its own state
    defaultValue?: string;
    onValueChange?: (details: NavigationMenuValueChangeDetails) => void;
    orientation?: NavigationMenuOrientation;
    // How long the pointer has to rest on an item before its panel opens, in milliseconds, so
    // that a pointer crossing the row does not open every panel on its way past
    openDelay?: number;
    // How long a panel is left standing once the pointer has left, in milliseconds. This is
    // what gives the reader room to cross the gap between an item and the panel it opened
    closeDelay?: number;
    // Leaves a press on a trigger unanswered, for a menu that is only ever opened by the pointer
    disableClickTrigger?: boolean;
    // Leaves the pointer resting on a trigger unanswered, for a menu that is only ever opened by
    // a press. A menu that does not open on the pointer does not close on it either
    disableHoverTrigger?: boolean;
    // Leaves a panel standing once the pointer has left it, rather than closing it after the
    // closing delay
    disablePointerLeaveClose?: boolean;
    className?: string;
};

export type NavigationMenuListProps = React.ComponentPropsWithoutRef<"ul"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavigationMenuItemProps = Omit<React.ComponentPropsWithoutRef<"li">, "value"> & {
    children?: React.ReactNode;
    // Names the item, so that a caller holding the state of the menu can say which one stands
    // open. One is made up where the caller has no name of their own for it
    value?: string;
    // Keeps the item's panel shut, and its trigger from being pressed
    disabled?: boolean;
    className?: string;
};

export type NavigationMenuTriggerProps = React.ComponentPropsWithoutRef<"button"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavigationMenuContentProps<As extends React.ElementType = "div"> = PolymorphicProps<
    As,
    "div",
    {
        children?: React.ReactNode;
        className?: string;
    }
>;

export type NavigationMenuLinkProps<As extends React.ElementType = "a"> = PolymorphicProps<
    As,
    "a",
    {
        children?: React.ReactNode;
        // Marks the link as the page the reader is already on, which is the one link in the
        // menu that is not somewhere to go
        current?: boolean;
        // Whether following the link puts the menu away. Left out, it does: whatever the reader
        // came to the menu for, they have found it
        closeOnClick?: boolean;
        className?: string;
    }
>;

export type NavigationMenuIndicatorProps = React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavigationMenuItemIndicatorProps = React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
    className?: string;
};

// The caret works out which way it points from the way the items run, so the location is not
// the caller's to give
export type NavigationMenuArrowProps = Omit<CaretProps, "location">;

export type NavigationMenuPositionerProps = React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
    align?: NavigationMenuViewportAlign;
    className?: string;
};

export type NavigationMenuViewportProps = React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
    className?: string;
};

// Where the open item's trigger stands, measured against whatever it is laid out in, so that an
// indicator can be slid along the row to it
export type NavigationMenuRect = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type NavigationMenuSize = {
    width: number;
    height: number;
};

// Where the viewport stands, measured against the menu
export type NavigationMenuPoint = {
    x: number;
    y: number;
};

// What an item tells the menu about itself, so the menu can find the trigger that opens it and
// the panel that opens without looking around the page for them
export type NavigationMenuItemRegistration = {
    triggerId: string;
    contentId: string;
    triggerProxyId: string;
};

// What the viewport tells the menu about itself: where the panels are to be drawn, and where
// along the open item the viewport lines up
export type NavigationMenuViewportRegistration = {
    node: HTMLElement;
    align: NavigationMenuViewportAlign;
};

// Everything that can be read off a menu and done to it from outside its parts. A caller reaches
// it through `useNavigationMenu`
export type NavigationMenuApi = {
    // The item whose panel stands open. Empty where none does
    value: string;
    open: boolean;
    orientation: NavigationMenuOrientation;
    // Opens the item named, at once and with nothing waited out, or puts every panel away where
    // it is handed nothing
    setValue: (value: string) => void;
};

// What the menu holds for the parts standing in it. The delays belong to the menu rather than to
// an item, since it is the menu that knows a pointer moving between items is one gesture rather
// than several
export type NavigationMenuContextValue = NavigationMenuApi & {
    direction: TextDirection;
    // Which way the open panel arrived from in the viewport, where it took the place of another
    motion: NavigationMenuMotion | null;
    // Whether the parts that slide along the row are to be held still instead: a menu that has
    // just opened has nowhere for them to slide from
    still: boolean;
    triggerRect: NavigationMenuRect | null;
    viewportSize: NavigationMenuSize | null;
    viewportPosition: NavigationMenuPoint | null;
    viewport: NavigationMenuViewportRegistration | null;
    disableClickTrigger: boolean;
    disableHoverTrigger: boolean;
    disablePointerLeaveClose: boolean;
    // What a press on a trigger does: opens its panel, or puts it away where it already stood
    toggle: (value: string) => void;
    // Opens an item once the pointer has rested on it, and gives that up where it moved on
    openAfterDelay: (value: string) => void;
    cancelOpen: (value: string) => void;
    // Closes whatever is open once the pointer has been gone long enough, and keeps it standing
    // where the pointer came back
    closeAfterDelay: () => void;
    cancelClose: () => void;
    // Puts every panel away, and hands focus back to the trigger where it was inside the panel
    close: () => void;
    // Steps focus into an item's panel, opening it first where it was shut
    focusContent: (value: string, side: NavigationMenuFocusSide) => void;
    registerItem: (value: string, registration: NavigationMenuItemRegistration) => () => void;
    registerViewport: (registration: NavigationMenuViewportRegistration | null) => void;
    getTriggerElement: (value: string) => HTMLElement | null;
    getContentElement: (value: string) => HTMLElement | null;
    getTriggerProxyElement: (value: string) => HTMLElement | null;
    // The triggers and links standing in the row itself, in the order they are written
    getTopLevelElements: () => HTMLElement[];
    // The links standing in an item's panel, in the order they are written
    getContentLinks: (value: string) => HTMLElement[];
    listRef: React.RefObject<HTMLUListElement | null>;
};

// What one item holds for the trigger that opens it and the panel that opens
export type NavigationMenuItemContextValue = {
    value: string;
    disabled: boolean;
    isOpen: boolean;
    triggerId: string;
    contentId: string;
    triggerProxyId: string;
};

// Where along the open item the viewport lines up, answered by the positioner around it
export type NavigationMenuPositionerContextValue = {
    align: NavigationMenuViewportAlign;
};
