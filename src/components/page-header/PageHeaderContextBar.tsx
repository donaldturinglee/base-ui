import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "page-header-context-bar",
};

// Stands in the context area in place of a parent link, for a header whose way back up is
// more than one step: breadcrumbs, say
function PageHeaderContextBar(
    props: PageHeaderChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = { regular: true, wide: true }, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            hidden={hidden}
            data-component="PageHeader.ContextBar"
            {...rest}
        />
    );
}

PageHeaderContextBar.displayName = "PageHeader.ContextBar";

export default fixedForwardRef(PageHeaderContextBar);
