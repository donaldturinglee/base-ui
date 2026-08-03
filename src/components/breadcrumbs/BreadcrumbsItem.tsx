import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { BreadcrumbsContext } from "./BreadcrumbsContext";
import type { BreadcrumbsItemProps } from "./Breadcrumbs.types";

const classes = {
    root: "breadcrumbs-link",
    normal: "breadcrumbs-link-normal",
    normalSelected: "breadcrumbs-link-normal-selected",
    spacious: "breadcrumbs-link-spacious",
    spaciousSelected: "breadcrumbs-link-spacious-selected",
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
