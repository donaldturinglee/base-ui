import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { composeEventHandlers } from "./composeEventHandlers";
import { useTab } from "./useTab";
import type { TabProps } from "./Tabs.types";

const classes = {
    root: "tab",
    vertical: "tab-vertical",
    hover: "tab-hover",
    selected: "tab-selected",
    disabled: "tab-disabled",
};

// One tab, which shows the panel carrying the same value
function Tab(
    props: TabProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, value, disabled, onKeyDown, onMouseDown, onFocus, ...rest } = props;

    const { selected, tabProps } = useTab<HTMLButtonElement>({ value, disabled });

    return (
        <button
            {...rest}
            {...tabProps}
            ref={ref}
            type="button"
            onKeyDown={composeEventHandlers(onKeyDown, tabProps.onKeyDown)}
            onMouseDown={composeEventHandlers(onMouseDown, tabProps.onMouseDown)}
            onFocus={composeEventHandlers(onFocus, tabProps.onFocus)}
            className={classNames(
                classes.root,
                classes.vertical,
                classes.hover,
                selected && classes.selected,
                disabled && classes.disabled,
                className,
            )}
            data-component="Tabs.Tab"
            data-value={value}
            data-selected={selected ? "" : undefined}
        />
    );
}

Tab.displayName = "Tabs.Tab";

export default fixedForwardRef(Tab);
