import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "col-start-2 row-start-2 flex items-center pe-[var(--base-size-8)] [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-normal)] leading-[var(--text-body-line-height-medium)]",
};

// The trail back up to the top of the site, standing before the title. This is kept for
// breadcrumbs alone: anything else above the title belongs in the context bar
function PageHeaderBreadcrumbs(
    props: PageHeaderChildProps,
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
