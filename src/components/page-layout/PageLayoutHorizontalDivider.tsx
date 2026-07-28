import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { PageLayoutContext } from "./PageLayoutContext";
import type { PageLayoutDividerProps } from "./PageLayout.types";

// The four sets below say the same thing four times over: once for a variant given plainly,
// and once for each viewport range it can be given one at a time. They are written out in
// full because a class name only reaches the stylesheet if it appears here as it stands
const classes = {
    // The divider reaches out past the padding it sits in, so it runs the width of the page
    root: "-mx-[var(--spacing-divider)] medium:mx-0",
    base: "data-[variant=none]:hidden data-[variant=line]:block data-[variant=line]:h-px data-[variant=line]:bg-[var(--border-color-default)] data-[variant=filled]:block data-[variant=filled]:h-[var(--base-size-8)] data-[variant=filled]:bg-[var(--background-color-inset)] data-[variant=filled]:[box-shadow:inset_0_-1px_0_0_var(--border-color-default),inset_0_1px_0_0_var(--border-color-default)]",
    narrow: "max-medium:data-[variant-narrow=none]:hidden max-medium:data-[variant-narrow=line]:block max-medium:data-[variant-narrow=line]:h-px max-medium:data-[variant-narrow=line]:bg-[var(--border-color-default)] max-medium:data-[variant-narrow=filled]:block max-medium:data-[variant-narrow=filled]:h-[var(--base-size-8)] max-medium:data-[variant-narrow=filled]:bg-[var(--background-color-inset)] max-medium:data-[variant-narrow=filled]:[box-shadow:inset_0_-1px_0_0_var(--border-color-default),inset_0_1px_0_0_var(--border-color-default)]",
    regular:
        "medium:data-[variant-regular=none]:hidden medium:data-[variant-regular=line]:block medium:data-[variant-regular=line]:h-px medium:data-[variant-regular=line]:bg-[var(--border-color-default)] medium:data-[variant-regular=filled]:block medium:data-[variant-regular=filled]:h-[var(--base-size-8)] medium:data-[variant-regular=filled]:bg-[var(--background-color-inset)] medium:data-[variant-regular=filled]:[box-shadow:inset_0_-1px_0_0_var(--border-color-default),inset_0_1px_0_0_var(--border-color-default)]",
    wide: "xxlarge:data-[variant-wide=none]:hidden xxlarge:data-[variant-wide=line]:block xxlarge:data-[variant-wide=line]:h-px xxlarge:data-[variant-wide=line]:bg-[var(--border-color-default)] xxlarge:data-[variant-wide=filled]:block xxlarge:data-[variant-wide=filled]:h-[var(--base-size-8)] xxlarge:data-[variant-wide=filled]:bg-[var(--background-color-inset)] xxlarge:data-[variant-wide=filled]:[box-shadow:inset_0_-1px_0_0_var(--border-color-default),inset_0_1px_0_0_var(--border-color-default)]",
};

function PageLayoutHorizontalDivider(
    props: PageLayoutDividerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, style, variant = "none", position, ...rest } = props;
    const { padding } = React.useContext(PageLayoutContext);

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
            style={
                {
                    "--spacing-divider": `var(--page-layout-spacing-${padding})`,
                    ...style,
                } as React.CSSProperties
            }
            data-component="PageLayout.HorizontalDivider"
            {...getResponsiveAttributes("variant", variant)}
            {...getResponsiveAttributes("position", position)}
            {...rest}
        />
    );
}

PageLayoutHorizontalDivider.displayName = "PageLayout.HorizontalDivider";

export default fixedForwardRef(PageLayoutHorizontalDivider);
