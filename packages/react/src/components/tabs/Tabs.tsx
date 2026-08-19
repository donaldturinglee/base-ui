import * as React from "react";
import { useId } from "../../hooks/useId";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { TabsContext } from "./TabsContext";
import type { TabsProps } from "./Tabs.types";

// Holds what is selected and hands it down to the tablist, the tabs and the panels inside it.
// Nothing of its own is rendered, so how a tabbed interface is laid out is left to whatever
// is put in it
function Tabs(props: TabsProps) {
    const { children, id, value, defaultValue, onChange } = props;

    const groupId = useId(id);

    // Tabs the caller is holding the state of take what is selected from the prop; ones that
    // are not keep their own
    const isControlled = value !== undefined;
    const [selfValue, setSelfValue] = React.useState(defaultValue);
    const selectedValue = isControlled ? value : selfValue;

    // Kept to one side so that a caller handing over a fresh callback on every render does
    // not put every tab and panel below them through a render of their own
    const latestOnChange = React.useRef(onChange);

    useIsomorphicLayoutEffect(() => {
        latestOnChange.current = onChange;
    }, [onChange]);

    const context = React.useMemo(
        () => ({
            groupId,
            selectedValue,
            selectTab: (next: string) => {
                if (!isControlled) {
                    setSelfValue(next);
                }

                latestOnChange.current?.(next);
            },
        }),
        [groupId, selectedValue, isControlled],
    );

    return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>;
}

Tabs.displayName = "Tabs";

export default Tabs;
