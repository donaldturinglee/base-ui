import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import type { PageHeaderRegionProps } from "./PageHeader.types";

const classes = {
    hidden: "page-header-hidden",
};

// Shared layout for the regions of the header. Each one is a box that can be taken away for
// good or one viewport range at a time, so the hiding is written here once. Not part of the
// public PageHeader namespace
function PageHeaderRegion(
    props: PageHeaderRegionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = false, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.hidden, className)}
            {...getResponsiveAttributes("hidden", hidden)}
            {...rest}
        />
    );
}

PageHeaderRegion.displayName = "PageHeader.Region";

export default fixedForwardRef(PageHeaderRegion);
