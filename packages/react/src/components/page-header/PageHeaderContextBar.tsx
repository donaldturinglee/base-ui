import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { hiddenOnRegularAndWide } from "./hiddenDefaults";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderContextBarProps } from "./PageHeader.types";

const classes = {
    root: "page-header-context-bar",
};

// A slot for whatever stands above the title in place of the parent link, such as a trail of
// breadcrumbs of the caller's own
function PageHeaderContextBar(
    props: PageHeaderContextBarProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = hiddenOnRegularAndWide, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.ContextBar"
            hidden={hidden}
            {...rest}
        />
    );
}

PageHeaderContextBar.displayName = "PageHeader.ContextBar";

export default fixedForwardRef(PageHeaderContextBar);
