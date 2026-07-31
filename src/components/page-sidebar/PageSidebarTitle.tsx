import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarTitleProps } from "./PageSidebar.types";

const classes = {
    root: "m-0 [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-semibold)] leading-[var(--text-body-line-height-medium)]",
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
