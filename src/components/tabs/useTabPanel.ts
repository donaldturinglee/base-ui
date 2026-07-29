import { useTabs } from "./useTabs";
import type { TabPanelHookResult, TabPanelProps } from "./Tabs.types";

// The props a panel needs, for a panel built out of something other than the one here
export const useTabPanel = (props: Pick<TabPanelProps, "value">): TabPanelHookResult => {
    const { value } = props;

    const tabs = useTabs();
    const selected = tabs.selectedValue === value;

    return {
        tabPanelProps: {
            id: `${tabs.groupId}-panel-${value}`,
            role: "tabpanel",
            // The tab the panel belongs to is what names it
            "aria-labelledby": `${tabs.groupId}-tab-${value}`,
            hidden: !selected,
            "data-selected": selected ? "" : undefined,
        },
    };
};
