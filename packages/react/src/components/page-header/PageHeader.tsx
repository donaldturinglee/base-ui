import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import PageHeaderNavigation from "./PageHeaderNavigation";
import PageHeaderTitleArea from "./PageHeaderTitleArea";
import type {
    PageHeaderHidden,
    PageHeaderNavigationProps,
    PageHeaderProps,
    PageHeaderTitleAreaProps,
} from "./PageHeader.types";

const classes = {
    root: "page-header",
    border: "page-header-border",
};

type ChildState = {
    // Left undefined where no title area is rendered, so the root says nothing about a size
    titleVariant?: PageHeaderTitleAreaProps["variant"];
    hasNavigation: boolean;
    navigationHidden?: PageHeaderHidden;
};

// The title size and the navigation's visibility are read off the children and written onto
// the root, so the styles can match a plain attribute there rather than look down through the
// header with `:has()`. Only direct children are read, along with whatever a fragment among
// them holds: the regions are compound parts, supported as direct children and nothing deeper
const readChildren = (children: React.ReactNode): ChildState => {
    const state: ChildState = { hasNavigation: false };

    for (const child of React.Children.toArray(children)) {
        if (React.isValidElement(child)) {
            if (child.type === React.Fragment) {
                const { children: nested } = child.props as { children?: React.ReactNode };
                const found = readChildren(nested);

                if (found.titleVariant !== undefined) {
                    state.titleVariant = found.titleVariant;
                }
                if (found.hasNavigation) {
                    state.hasNavigation = true;
                    state.navigationHidden = found.navigationHidden;
                }
            } else if (child.type === PageHeaderTitleArea) {
                const { variant } = child.props as PageHeaderTitleAreaProps;
                state.titleVariant = variant ?? "medium";
            } else if (child.type === PageHeaderNavigation) {
                const { hidden } = child.props as PageHeaderNavigationProps;
                state.hasNavigation = true;
                state.navigationHidden = hidden ?? false;
            }
        }
    }

    return state;
};

// The region at the top of a page that names it: the title, what stands beside it, and the
// context, description and navigation around it. The title area comes first in the DOM even
// where it is not drawn first, so a reader moving by heading lands on it before anything else
function PageHeader<As extends React.ElementType = "div">(
    props: PageHeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        children,
        hasBorder,
        ...rest
    } = props as PageHeaderProps<"div">;

    const { titleVariant, hasNavigation, navigationHidden } = readChildren(children);

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, hasBorder && classes.border, className)}
            data-component="PageHeader"
            data-has-border={hasBorder}
            data-has-nav={hasNavigation ? "" : undefined}
            {...getResponsiveAttributes("title-size-variant", titleVariant)}
            {...getResponsiveAttributes("nav-hidden", navigationHidden)}
            {...rest}
        >
            {children}
        </Component>
    );
}

PageHeader.displayName = "PageHeader";

export default fixedForwardRef(PageHeader);
