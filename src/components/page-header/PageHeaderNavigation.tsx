import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderNavigationProps } from "./PageHeader.types";

const classes = {
    root: "page-header-navigation",
};

// Moves between the pages that belong with this one, standing at the foot of the header.
// Rendered as a `nav` it is a landmark of its own, so it has to be named; rendered as a plain
// box it is not, so a name would say nothing and is left off
function PageHeaderNavigation(
    props: PageHeaderNavigationProps,
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
        <PageHeaderRegion
            ref={ref}
            as={as}
            aria-label={isLandmark ? ariaLabel : undefined}
            aria-labelledby={isLandmark ? ariaLabelledBy : undefined}
            className={classNames(classes.root, className)}
            data-component="PageHeader.Navigation"
            {...rest}
        />
    );
}

PageHeaderNavigation.displayName = "PageHeader.Navigation";

export default fixedForwardRef(PageHeaderNavigation);
