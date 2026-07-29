import type * as React from "react";

// Which way the tablist runs, and so which arrow keys move along it
export type TabsOrientation = "horizontal" | "vertical";

export type TabsProps = {
    // Which tab is selected, where the caller keeps hold of the state
    value?: string;
    // Which tab starts out selected, where the tabs keep hold of the state themselves. One of
    // the two should always be given: a tablist with nothing selected has nothing for the
    // keyboard to land on
    defaultValue?: string;
    // Called with the value of the tab that has just been selected
    onChange?: (value: string) => void;
    // What the ids of the tabs and the panels are built from. One is worked out where it is
    // left out
    id?: string;
    children?: React.ReactNode;
};

// A tablist has to be named, either in its own words or by something already on the page
type TabListLabel = { "aria-label": string } | { "aria-labelledby": string };

export type TabListProps = React.ComponentPropsWithoutRef<"div"> &
    TabListLabel & {
        className?: string;
    };

export type TabProps = React.ComponentPropsWithoutRef<"button"> & {
    // Names the tab to the tabs around it, and ties it to the panel carrying the same value
    value: string;
    disabled?: boolean;
    className?: string;
};

export type TabPanelProps = React.ComponentPropsWithoutRef<"div"> & {
    // The value of the tab this panel belongs to
    value: string;
    className?: string;
};

export type TabsContextValue = {
    groupId: string;
    selectedValue?: string;
    selectTab: (value: string) => void;
};

export type TabListHookProps<T extends HTMLElement> = {
    "aria-label"?: string;
    "aria-labelledby"?: string;
    "aria-orientation"?: TabsOrientation;
    // Where the tablist ends up, for a caller who needs it. One is kept either way, since the
    // arrow keys are answered by looking at the tabs the tablist holds
    ref?: React.Ref<T | null>;
};

export type TabListHookResult<T extends HTMLElement> = {
    // The props to spread onto whatever is standing as the tablist
    tabListProps: {
        ref: React.Ref<T | null>;
        role: "tablist";
        "aria-label"?: string;
        "aria-labelledby"?: string;
        "aria-orientation": TabsOrientation;
        onKeyDown: React.KeyboardEventHandler<T>;
    };
};

export type TabHookProps = Pick<TabProps, "value" | "disabled">;

export type TabHookResult<T extends HTMLElement> = {
    // Whether this is the tab that is selected, which is what a tab built out of something
    // else needs in order to draw itself
    selected: boolean;
    // The props to spread onto whatever is standing as the tab
    tabProps: {
        id: string;
        role: "tab";
        "aria-controls": string;
        "aria-selected": boolean;
        "aria-disabled": true | undefined;
        tabIndex: number;
        onKeyDown: React.KeyboardEventHandler<T>;
        onMouseDown: React.MouseEventHandler<T>;
        onFocus: React.FocusEventHandler<T>;
    };
};

export type TabPanelHookResult = {
    // The props to spread onto whatever is standing as the panel
    tabPanelProps: {
        id: string;
        role: "tabpanel";
        "aria-labelledby": string;
        hidden: boolean;
        // Marks the panel that is showing, for anything styling itself by it
        "data-selected": string | undefined;
    };
};
