import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageSidebarRegion from "./PageSidebarRegion";
import type { PageSidebarChildProps } from "./PageSidebar.types";

const classes = {
    // A run cannot be pushed wider than the sidebar by anything inside it that overflows
    root: "flex flex-col min-w-0 gap-[var(--stack-gap-condensed)]",
};

// A run of the sidebar: a group of things that belong together, whatever heads it. This is
// for everything that is not a way to somewhere else, which belongs in the navigation
function PageSidebarSection(
    props: PageSidebarChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageSidebarRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageSidebar.Section"
            {...rest}
        />
    );
}

PageSidebarSection.displayName = "PageSidebar.Section";

export default fixedForwardRef(PageSidebarSection);
