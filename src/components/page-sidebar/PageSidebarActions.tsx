import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarChildProps } from "./PageSidebar.types";

const classes = {
    root: "page-sidebar-actions",
};

// What can be done from the sidebar itself rather than from the page: adding to whatever the
// sidebar lists, closing the sidebar
function PageSidebarActions(
    props: PageSidebarChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageSidebarRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageSidebar.Actions"
            {...rest}
        />
    );
}

PageSidebarActions.displayName = "PageSidebar.Actions";

export default fixedForwardRef(PageSidebarActions);
