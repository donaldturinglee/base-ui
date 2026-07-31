import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarChildProps } from "./PageSidebar.types";

const classes = {
    // The body takes whatever room is left between the head and the foot, so the foot is
    // pushed to the bottom however little stands above it. The runs inside are spaced by the
    // sidebar's own scale, so they read the same as the parts standing beside them
    root: "flex flex-col grow min-w-0 gap-[var(--page-sidebar-gap)]",
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
