import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarChildProps } from "./PageSidebar.types";

const classes = {
    root: "page-sidebar-footer",
};

// What stands at the foot of the sidebar, under everything else it holds: whose account this
// is, what the settings are
function PageSidebarFooter(
    props: PageSidebarChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageSidebarRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageSidebar.Footer"
            {...rest}
        />
    );
}

PageSidebarFooter.displayName = "PageSidebar.Footer";

export default fixedForwardRef(PageSidebarFooter);
