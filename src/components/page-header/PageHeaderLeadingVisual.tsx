import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    // As tall as a line of the title, so it sits against the title's first line however many
    // lines the title runs to
    root: "order-1 flex items-center h-[calc(var(--page-header-title-line-height)_*_1em)]",
};

// An icon, or something like one, standing before the title. It says what kind of thing the
// page is about, so a narrow viewport keeps it
function PageHeaderLeadingVisual(
    props: PageHeaderChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.LeadingVisual"
            {...rest}
        />
    );
}

PageHeaderLeadingVisual.displayName = "PageHeader.LeadingVisual";

export default fixedForwardRef(PageHeaderLeadingVisual);
