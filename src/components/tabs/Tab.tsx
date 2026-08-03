import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { composeEventHandlers } from "./composeEventHandlers";
import { useTab } from "./useTab";
import type { TabProps } from "./Tabs.types";

const classes = {
    // The line under the selected tab is the tab's own border, drawn over the rule the
    // tablist carries
    root: "inline-flex items-center justify-center gap-[var(--base-size-8)] m-0 px-[var(--base-size-12)] py-[var(--base-size-8)] bg-transparent border-solid border-0 border-b-[length:var(--base-size-2)] border-b-transparent rounded-t-[var(--border-radius-medium)] cursor-pointer whitespace-nowrap [font-family:inherit] [font-size:var(--text-body-size-medium)] [line-height:var(--text-body-line-height-medium)] [color:var(--foreground-color-default)] transition-[background-color,border-color] duration-micro ease-hover",
    // A tablist standing beside the panels turns the line onto the other side, which the tabs
    // follow from the tablist rather than being told of it
    vertical:
        "group-data-[orientation=vertical]/tablist:justify-start group-data-[orientation=vertical]/tablist:border-b-0 group-data-[orientation=vertical]/tablist:border-e-[length:var(--base-size-2)] group-data-[orientation=vertical]/tablist:border-e-transparent group-data-[orientation=vertical]/tablist:rounded-t-none group-data-[orientation=vertical]/tablist:rounded-s-[var(--border-radius-medium)]",
    // The ring is drawn inside the tab, so it is not cut off by the tablist around it
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[calc(var(--focus-outline-offset)_*_-1)]",
    hover: "hover:bg-[var(--control-transparent-background-color-hover)] hover:border-b-[color:var(--underline-nav-border-color-hover)] group-data-[orientation=vertical]/tablist:hover:border-e-[color:var(--underline-nav-border-color-hover)]",
    selected:
        "[font-weight:var(--base-text-weight-semibold)] border-b-[color:var(--underline-nav-border-color-active)] group-data-[orientation=vertical]/tablist:border-e-[color:var(--underline-nav-border-color-active)]",
    disabled:
        "cursor-not-allowed [color:var(--control-foreground-color-disabled)] hover:bg-transparent hover:border-b-transparent group-data-[orientation=vertical]/tablist:hover:border-e-transparent",
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
                classes.focus,
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
