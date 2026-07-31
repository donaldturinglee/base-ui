import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarChildProps } from "./PageSidebar.types";

const classes = {
    root: "flex flex-row items-center justify-between min-w-0 gap-[var(--stack-gap-condensed)]",
};

// The head of the sidebar, which holds whatever names it and whatever acts on it. The two
// stand at either end of the one line, so the actions are never read as part of the name
function PageSidebarHeader(
    props: PageSidebarChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageSidebarRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageSidebar.Header"
            {...rest}
        />
    );
}

PageSidebarHeader.displayName = "PageSidebar.Header";

export default fixedForwardRef(PageSidebarHeader);
