import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useTabPanel } from "./useTabPanel";
import type { TabPanelProps } from "./Tabs.types";

// What one tab shows. The panel is only what it holds, so nothing is drawn around it
function TabPanel(
    props: TabPanelProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, value, ...rest } = props;

    const { tabPanelProps } = useTabPanel({ value });

    return (
        <div
            {...rest}
            {...tabPanelProps}
            ref={ref}
            className={className}
            data-component="Tabs.Panel"
            data-value={value}
        />
    );
}

TabPanel.displayName = "Tabs.Panel";

export default fixedForwardRef(TabPanel);
