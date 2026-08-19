import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { composeEventHandlers } from "./composeEventHandlers";
import { useTabList } from "./useTabList";
import type { TabListProps } from "./Tabs.types";

const classes = {
    root: "tab-list",
    vertical: "tab-list-vertical",
};

// The row the tabs stand in, and what answers the keys that move between them
function TabList(
    props: TabListProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        onKeyDown,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-orientation": ariaOrientation,
        ...rest
    } = props;

    const { tabListProps } = useTabList<HTMLDivElement>({
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-orientation": ariaOrientation,
        ref,
    });

    const isVertical = tabListProps["aria-orientation"] === "vertical";

    return (
        <div
            {...rest}
            {...tabListProps}
            onKeyDown={composeEventHandlers(onKeyDown, tabListProps.onKeyDown)}
            className={classNames(classes.root, isVertical && classes.vertical, className)}
            data-component="Tabs.List"
            data-orientation={tabListProps["aria-orientation"]}
        />
    );
}

TabList.displayName = "Tabs.List";

export default fixedForwardRef(TabList);
