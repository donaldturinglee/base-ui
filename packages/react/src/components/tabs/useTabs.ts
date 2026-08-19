import { useContext } from "react";
import { TabsContext } from "./TabsContext";
import type { TabsContextValue } from "./Tabs.types";

// Everything a tablist, a tab or a panel needs from the tabs around it. Standing outside of a
// `Tabs` is a mistake worth stopping at rather than carrying on from: nothing below it can
// know what is selected, and none of it would answer the keyboard
export const useTabs = (): TabsContextValue => {
    const context = useContext(TabsContext);

    if (!context) {
        throw new Error(
            "A tablist, a tab and a panel all have to stand within a `Tabs` component.",
        );
    }

    return context;
};
