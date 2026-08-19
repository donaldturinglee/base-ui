import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import type { TabListHookProps, TabListHookResult } from "./Tabs.types";

// The tabs the arrow keys move between. A disabled tab is passed over rather than landed on
const getFocusableTabs = (tablist: HTMLElement) =>
    Array.from(tablist.querySelectorAll<HTMLElement>("[role='tab']:not([aria-disabled])"));

// The props a tablist needs, for a tablist built out of something other than the one here
export const useTabList = <T extends HTMLElement>(
    props: TabListHookProps<T>,
): TabListHookResult<T> => {
    const {
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-orientation": ariaOrientation,
        ref,
    } = props;

    const tabListRef = React.useRef<T>(null);
    const mergedRef = useMergedRefs(ref, tabListRef);

    const orientation = ariaOrientation ?? "horizontal";

    const onKeyDown = (event: React.KeyboardEvent<T>) => {
        const tablist = tabListRef.current;

        if (!tablist) {
            return;
        }

        // Standing beside the panels rather than above them turns the keys onto the other axis
        const isVertical = orientation === "vertical";
        const nextKey = isVertical ? "ArrowDown" : "ArrowRight";
        const previousKey = isVertical ? "ArrowUp" : "ArrowLeft";

        const toEdge = event.key === "Home" || event.key === "End";
        const step = event.key === nextKey ? 1 : event.key === previousKey ? -1 : 0;

        if (step === 0 && !toEdge) {
            return;
        }

        // The keys belong to the tablist rather than to the page around it
        event.preventDefault();
        event.stopPropagation();

        const tabs = getFocusableTabs(tablist);

        if (tabs.length === 0) {
            return;
        }

        if (toEdge) {
            tabs[event.key === "Home" ? 0 : tabs.length - 1].focus();
            return;
        }

        // Moving on from the last tab wraps round to the first. Where nothing is selected the
        // keys have nowhere to move on from, so they start at the first tab instead
        const selected = tabs.findIndex((tab) => tab.getAttribute("aria-selected") === "true");
        const next = selected === -1 ? 0 : (selected + step + tabs.length) % tabs.length;

        tabs[next].focus();
    };

    return {
        tabListProps: {
            ref: mergedRef,
            role: "tablist",
            "aria-label": ariaLabel,
            "aria-labelledby": ariaLabelledBy,
            "aria-orientation": orientation,
            onKeyDown,
        },
    };
};
