import type * as React from "react";
import type { PolymorphicProps } from "../../utilities/polymorphic";

// Which way the items run, and so which keys move along them and which key opens a panel. It
// also settles where a panel stands: a row has no room under it to give, so its panels stand
// over the page, while a column is already running the way a panel would grow and draws them
// in the flow, the way a navigation list shows the list standing under one of its items
export type NavigationMenuOrientation = "horizontal" | "vertical";

// What opens an item's panel. A menu that only answered the pointer would be shut to anyone
// who does not use one, so a press and the keyboard open it either way
export type NavigationMenuOpenOn = "click" | "hover";

// Where along the item its panel lines up. Only a panel standing over the page has this to
// answer, since one drawn in the flow of a column is under its item and nowhere else
export type NavigationMenuContentAlign = "start" | "center" | "end";

// A navigation menu is named by a heading of its own, and the groups inside its panels are
// headed one level deeper. The page title is the h1, so the menu never stands as high as that,
// and it never runs deeper than an h4
export type NavigationMenuHeadingLevel = "h2" | "h3";

export type NavigationMenuProps = Omit<React.ComponentPropsWithoutRef<"nav">, "defaultValue"> & {
    children?: React.ReactNode;
    // Which item stands open, by the value it was given, where the caller keeps hold of that.
    // `null` where none of them is
    value?: string | null;
    // Which item stands open to begin with, for a menu that keeps its own state
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    orientation?: NavigationMenuOrientation;
    openOn?: NavigationMenuOpenOn;
    // How long the pointer has to rest on an item before its panel opens, in milliseconds, so
    // that a pointer crossing the row does not open every panel on its way past
    openDelay?: number;
    // How long a panel is left standing once the pointer has left, in milliseconds. This is
    // what gives the reader room to cross the gap between an item and the panel it opened
    closeDelay?: number;
    className?: string;
};

export type NavigationMenuHeadingProps = Omit<React.ComponentPropsWithoutRef<"h2">, "children"> & {
    as?: NavigationMenuHeadingLevel;
    // Names the menu for a screen reader without being drawn on the page
    visuallyHidden?: boolean;
    children?: React.ReactNode;
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
        align?: NavigationMenuContentAlign;
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
        active?: boolean;
        className?: string;
    }
>;

export type NavigationMenuSubNavigationProps = React.ComponentPropsWithoutRef<"ul"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavigationMenuGroupProps = React.ComponentPropsWithoutRef<"div"> & {
    children?: React.ReactNode;
    // Names the group. Use `NavigationMenu.GroupHeading` instead where the heading holds more
    // than plain text, a link say
    title?: string;
    // Leaves out the line that would otherwise set the group apart from what comes before
    hideDivider?: boolean;
    className?: string;
};

export type NavigationMenuGroupHeadingProps = Omit<React.ComponentPropsWithoutRef<"h3">, "as"> & {
    // Which heading the group stands at. Left alone, it is set one level below the menu's own
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    children?: React.ReactNode;
    className?: string;
};

export type NavigationMenuDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavigationMenuVisualProps = React.ComponentPropsWithoutRef<"span"> & {
    children?: React.ReactNode;
    className?: string;
};

export type NavigationMenuDividerProps = Omit<React.ComponentPropsWithoutRef<"div">, "children"> & {
    className?: string;
};

// What the menu tells the items standing in it, being what is open and what is allowed to
// open it. The delays belong to the menu rather than to an item, since it is the menu that
// knows a pointer moving between items is one gesture rather than several
export type NavigationMenuContextValue = {
    openValue: string | null;
    setOpenValue: (value: string | null) => void;
    orientation: NavigationMenuOrientation;
    openOn: NavigationMenuOpenOn;
    // Opens an item once the pointer has rested on it, and closes whatever is open once the
    // pointer has left
    openAfterDelay: (value: string) => void;
    closeAfterDelay: () => void;
};

// What an item tells its trigger and its panel about itself. The ids are empty where either
// has been written outside an item, which is nowhere they can work
export type NavigationMenuItemContextValue = {
    value: string;
    triggerId: string;
    contentId: string;
    isOpen: boolean;
};

// What a link tells the parts written inside it about itself: what names a sub-list standing
// under it, and what says more about it than its label does. The ids are empty where one of
// those parts has been written outside a link, which is nowhere it can work
export type NavigationMenuLinkContextValue = {
    linkId: string;
    descriptionId: string;
};
