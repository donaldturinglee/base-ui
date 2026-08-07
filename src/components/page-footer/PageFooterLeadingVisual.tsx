import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterChildProps } from "./PageFooter.types";

const classes = {
    root: "page-footer-leading-visual",
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
