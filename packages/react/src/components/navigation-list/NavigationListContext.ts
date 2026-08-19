import * as React from "react";

// The level of the list's own heading, as a number, so that a group heading can be set one
// level below it. `null` where the list has no heading, and a group falls back to an h3
export const NavigationListHeadingLevelContext = React.createContext<number | null>(null);

// How deeply a sub-list stands within the list, which is what steps its items in from the
// edge. The list itself is the zeroth level
export const NavigationListDepthContext = React.createContext<{ depth: number }>({ depth: 0 });

export type NavigationListItemWithSubNavigationContextValue = {
    // What names the sub-list, and what the sub-list says it is controlled by
    buttonId: string;
    subNavigationId: string;
    isOpen: boolean;
};

// What an item that holds a sub-list tells the sub-list about itself. The ids are empty
// where a sub-list has been written outside an item, which is nowhere it can work
export const NavigationListItemWithSubNavigationContext =
    React.createContext<NavigationListItemWithSubNavigationContextValue>({
        buttonId: "",
        subNavigationId: "",
        isOpen: false,
    });
