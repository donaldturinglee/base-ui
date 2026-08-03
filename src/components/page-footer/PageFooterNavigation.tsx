import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterNavigationProps } from "./PageFooter.types";

const classes = {
    root: "page-footer-navigation",
};

// Moves on to the pages the reader is left with once this one is done, standing at the head
// of the footer. Rendered as a `nav` it is a landmark of its own, so it has to be named;
// rendered as a plain box it is not, so a name would say nothing and is left off
function PageFooterNavigation(
    props: PageFooterNavigationProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        as = "div",
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const isLandmark = as === "nav";

    return (
        <PageFooterRegion
            ref={ref}
            as={as}
            aria-label={isLandmark ? ariaLabel : undefined}
            aria-labelledby={isLandmark ? ariaLabelledBy : undefined}
            className={classNames(classes.root, className)}
            data-component="PageFooter.Navigation"
            {...rest}
        />
    );
}

PageFooterNavigation.displayName = "PageFooter.Navigation";

export default fixedForwardRef(PageFooterNavigation);
