import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarNavigationProps } from "./PageSidebar.types";

const classes = {
    root: "block",
};

// Moves between the pages the sidebar stands for, which is most of what a sidebar is for.
// Rendered as a `nav` it is a landmark of its own, so it has to be named; rendered as a plain
// box it is not, so a name would say nothing and is left off
function PageSidebarNavigation(
    props: PageSidebarNavigationProps,
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
        <PageSidebarRegion
            ref={ref}
            as={as}
            aria-label={isLandmark ? ariaLabel : undefined}
            aria-labelledby={isLandmark ? ariaLabelledBy : undefined}
            className={classNames(classes.root, className)}
            data-component="PageSidebar.Navigation"
            {...rest}
        />
    );
}

PageSidebarNavigation.displayName = "PageSidebar.Navigation";

export default fixedForwardRef(PageSidebarNavigation);
