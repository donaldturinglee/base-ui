import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import type { PageLayoutDividerProps } from "./PageLayout.types";

// As with the horizontal divider, each viewport range is written out in full so that every
// class name reaches the stylesheet
const classes = {
    // The handle for a resizable pane is laid over the divider, so the divider is what it
    // is placed against
    root: "relative h-full",
    base: "data-[variant=none]:hidden data-[variant=line]:block data-[variant=line]:w-px data-[variant=line]:bg-[var(--border-color-default)] data-[variant=filled]:block data-[variant=filled]:w-[var(--base-size-8)] data-[variant=filled]:bg-[var(--background-color-inset)] data-[variant=filled]:[box-shadow:inset_-1px_0_0_0_var(--border-color-default),inset_1px_0_0_0_var(--border-color-default)]",
    narrow: "max-medium:data-[variant-narrow=none]:hidden max-medium:data-[variant-narrow=line]:block max-medium:data-[variant-narrow=line]:w-px max-medium:data-[variant-narrow=line]:bg-[var(--border-color-default)] max-medium:data-[variant-narrow=filled]:block max-medium:data-[variant-narrow=filled]:w-[var(--base-size-8)] max-medium:data-[variant-narrow=filled]:bg-[var(--background-color-inset)] max-medium:data-[variant-narrow=filled]:[box-shadow:inset_-1px_0_0_0_var(--border-color-default),inset_1px_0_0_0_var(--border-color-default)]",
    regular:
        "medium:data-[variant-regular=none]:hidden medium:data-[variant-regular=line]:block medium:data-[variant-regular=line]:w-px medium:data-[variant-regular=line]:bg-[var(--border-color-default)] medium:data-[variant-regular=filled]:block medium:data-[variant-regular=filled]:w-[var(--base-size-8)] medium:data-[variant-regular=filled]:bg-[var(--background-color-inset)] medium:data-[variant-regular=filled]:[box-shadow:inset_-1px_0_0_0_var(--border-color-default),inset_1px_0_0_0_var(--border-color-default)]",
    wide: "xxlarge:data-[variant-wide=none]:hidden xxlarge:data-[variant-wide=line]:block xxlarge:data-[variant-wide=line]:w-px xxlarge:data-[variant-wide=line]:bg-[var(--border-color-default)] xxlarge:data-[variant-wide=filled]:block xxlarge:data-[variant-wide=filled]:w-[var(--base-size-8)] xxlarge:data-[variant-wide=filled]:bg-[var(--background-color-inset)] xxlarge:data-[variant-wide=filled]:[box-shadow:inset_-1px_0_0_0_var(--border-color-default),inset_1px_0_0_0_var(--border-color-default)]",
};

function PageLayoutVerticalDivider(
    props: PageLayoutDividerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, variant = "none", position, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(
                classes.root,
                classes.base,
                classes.narrow,
                classes.regular,
                classes.wide,
                className,
            )}
            data-component="PageLayout.VerticalDivider"
            {...getResponsiveAttributes("variant", variant)}
            {...getResponsiveAttributes("position", position)}
            {...rest}
        />
    );
}

PageLayoutVerticalDivider.displayName = "PageLayout.VerticalDivider";

export default fixedForwardRef(PageLayoutVerticalDivider);
