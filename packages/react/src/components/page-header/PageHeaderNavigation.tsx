import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import type {
    PageHeaderNavigationElementProps,
    PageHeaderNavigationProps,
} from "./PageHeader.types";

const classes = {
    root: "page-header-navigation",
    hidden: "page-header-hidden",
};

// The page's own navigation, beneath everything else in the header and shown on every
// viewport. Rendered as a `nav` landmark where it is asked to be, which then has to be named
function PageHeaderNavigation(
    props: PageHeaderNavigationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        hidden = false,
        ...rest
    } = props as PageHeaderNavigationElementProps;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.hidden, className)}
            data-component="PageHeader.Navigation"
            {...getResponsiveAttributes("hidden", hidden)}
            {...rest}
        />
    );
}

PageHeaderNavigation.displayName = "PageHeader.Navigation";

export default fixedForwardRef(PageHeaderNavigation);
