import * as React from "react";
import { ArrowLeftRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import Link from "../link/Link";
import { hiddenOnRegularAndWide } from "./hiddenDefaults";
import type { PageHeaderParentLinkProps } from "./PageHeader.types";

const classes = {
    root: "page-header-parent-link",
    hidden: "page-header-hidden",
};

// The way back up the hierarchy, only shown on a narrow viewport by default where there is no
// room for a trail of breadcrumbs
function PageHeaderParentLink<As extends React.ElementType = "a">(
    props: PageHeaderParentLinkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "a",
        className,
        children,
        hidden = hiddenOnRegularAndWide,
        ...rest
    } = props as PageHeaderParentLinkProps<React.ElementType>;

    return (
        <Link
            ref={ref}
            as={Component}
            muted
            className={classNames(classes.root, classes.hidden, className)}
            data-component="PageHeader.ParentLink"
            {...getResponsiveAttributes("hidden", hidden)}
            {...rest}
        >
            <ArrowLeftRegular />
            <span>{children}</span>
        </Link>
    );
}

PageHeaderParentLink.displayName = "PageHeader.ParentLink";

export default fixedForwardRef(PageHeaderParentLink);
