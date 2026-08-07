import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarTitleProps } from "./PageSidebar.types";

const classes = {
    root: "page-sidebar-title",
};

// Names the sidebar. Which heading level it is drawn as is the caller's, since that follows
// from what else the page already holds
function PageSidebarTitle(
    props: PageSidebarTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, as = "h2", ...rest } = props;

    return (
        <PageSidebarRegion
            ref={ref}
            as={as}
            className={classNames(classes.root, className)}
            data-component="PageSidebar.Title"
            {...rest}
        />
    );
}

PageSidebarTitle.displayName = "PageSidebar.Title";

export default fixedForwardRef(PageSidebarTitle);
