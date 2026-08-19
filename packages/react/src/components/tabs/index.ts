import TabsBase from "./Tabs";
import Tab from "./Tab";
import TabList from "./TabList";
import TabPanel from "./TabPanel";

export const Tabs = Object.assign(TabsBase, {
    List: TabList,
    Tab,
    Panel: TabPanel,
});

export { TabList, Tab, TabPanel };
export { TabsContext } from "./TabsContext";
export { useTab } from "./useTab";
export { useTabList } from "./useTabList";
export { useTabPanel } from "./useTabPanel";
export { useTabs } from "./useTabs";
export * from "./Tabs.types";
