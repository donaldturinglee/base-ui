import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarChildProps } from "./PageSidebar.types";

const classes = {
    // The room left over falls above the footer, so it is pushed to the foot of the sidebar
    // however little the rest of it holds
    root: "mt-auto flex flex-col min-w-0 pt-[var(--base-size-8)] gap-[var(--stack-gap-condensed)]",
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
