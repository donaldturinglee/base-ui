import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderBreadcrumbsProps } from "./PageHeader.types";

const classes = {
    root: "page-header-breadcrumbs",
};

// Reserved for a trail of breadcrumbs, which stands in the title row before the title
function PageHeaderBreadcrumbs(
    props: PageHeaderBreadcrumbsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.Breadcrumbs"
            {...rest}
        />
    );
}

PageHeaderBreadcrumbs.displayName = "PageHeader.Breadcrumbs";

export default fixedForwardRef(PageHeaderBreadcrumbs);
