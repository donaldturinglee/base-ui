import type * as React from "react";
import { useTabs } from "./useTabs";
import type { TabHookProps, TabHookResult } from "./Tabs.types";

// The props a tab needs, for a tab built out of something other than the one here
export const useTab = <T extends HTMLElement>(props: TabHookProps): TabHookResult<T> => {
    const { value, disabled } = props;

    const tabs = useTabs();
    const selected = tabs.selectedValue === value;

    const onKeyDown = (event: React.KeyboardEvent<T>) => {
        if (event.key === " " || event.key === "Enter") {
            tabs.selectTab(value);
        }
    };

    const onMouseDown = (event: React.MouseEvent<T>) => {
        // Anything other than a plain press of the primary button is left where it is, and a
        // disabled tab does not answer at all
        if (disabled || event.button !== 0 || event.ctrlKey) {
            event.preventDefault();
            return;
        }

        tabs.selectTab(value);
    };

    // Landing on a tab selects it, so that arrowing along the tablist carries the panels with it
    const onFocus = () => {
        if (!selected && !disabled) {
            tabs.selectTab(value);
        }
    };

    return {
        selected,
        tabProps: {
            id: `${tabs.groupId}-tab-${value}`,
            role: "tab",
            "aria-controls": `${tabs.groupId}-panel-${value}`,
            "aria-selected": selected,
            // Marked as unavailable rather than disabled, so that it can still be reached and
            // read out
            "aria-disabled": disabled ? true : undefined,
            // Only the selected tab stands in the tab sequence; the rest are reached with the
            // arrow keys once the tablist has been
            tabIndex: selected ? 0 : -1,
            onKeyDown,
            onMouseDown,
            onFocus,
        },
    };
};
