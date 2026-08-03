import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { BreadcrumbsContext } from "./BreadcrumbsContext";
import type { BreadcrumbsItemProps } from "./Breadcrumbs.types";

const classes = {
    root: "inline-block [font-size:var(--text-body-size-medium)] no-underline",
    focus: "focus-visible:rounded-[var(--border-radius-small)] focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)] focus-visible:no-underline",
    // A step of the trail reads as a link
    normal: "text-foreground-accent hover:underline",
    // The page the reader is already on is where they are rather than somewhere else to go
    normalSelected: "text-foreground-default hover:no-underline",
    // A spacious trail is drawn as a row of boxes rather than as a line of links
    spacious:
        "px-[var(--base-size-6)] py-[var(--base-size-4)] rounded-[var(--border-radius-medium)] text-foreground-default hover:no-underline hover:bg-[var(--control-transparent-background-color-hover)]",
    spaciousSelected: "[font-weight:var(--base-text-weight-semibold)]",
};

// One step of the trail. It is somewhere to go unless it is the page the reader is already
// on, which is the last step and the one that goes nowhere
function BreadcrumbsItem<As extends React.ElementType = "a">(
    props: BreadcrumbsItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "a",
        className,
        selected,
        ...rest
    } = props as BreadcrumbsItemProps<React.ElementType>;

    const { variant = "normal" } = React.useContext(BreadcrumbsContext);
    const isSpacious = variant === "spacious";

    return (
        <Component
            ref={ref}
            aria-current={selected ? "page" : undefined}
            className={classNames(
                classes.root,
                classes.focus,
                isSpacious ? classes.spacious : classes.normal,
                selected && (isSpacious ? classes.spaciousSelected : classes.normalSelected),
                className,
            )}
            data-component="Breadcrumbs.Item"
            data-selected={selected ? "" : undefined}
            {...rest}
        />
    );
}

BreadcrumbsItem.displayName = "Breadcrumbs.Item";

export default fixedForwardRef(BreadcrumbsItem);
