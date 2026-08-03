import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarChildProps } from "./PageSidebar.types";

const classes = {
    root: "page-sidebar-content",
};

// The body of the sidebar: what stands between the head and the foot of it. A sidebar with
// nothing to head or foot has no need of it, and can hold its runs itself
function PageSidebarContent(
    props: PageSidebarChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageSidebarRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageSidebar.Content"
            {...rest}
        />
    );
}

PageSidebarContent.displayName = "PageSidebar.Content";

export default fixedForwardRef(PageSidebarContent);
