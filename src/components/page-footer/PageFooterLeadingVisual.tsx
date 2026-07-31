import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterChildProps } from "./PageFooter.types";

const classes = {
    // As tall as a line of the closing row, so it sits against that row's first line however
    // many lines the row runs to
    root: "col-start-1 row-start-2 flex items-center pe-[var(--base-size-8)] h-[calc(var(--page-footer-text-line-height)_*_1em)]",
};

// A mark, or something like one, standing before the closing line. It says whose page this
// is, so a narrow viewport keeps it
function PageFooterLeadingVisual(
    props: PageFooterChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageFooterRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageFooter.LeadingVisual"
            {...rest}
        />
    );
}

PageFooterLeadingVisual.displayName = "PageFooter.LeadingVisual";

export default fixedForwardRef(PageFooterLeadingVisual);
