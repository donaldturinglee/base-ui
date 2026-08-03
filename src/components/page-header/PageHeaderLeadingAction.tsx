import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "page-header-leading-action",
};

// Something to press before the title, which opens the sidebar the page stands in. A narrow
// viewport has no room for it beside the title, so it is left off there by default
function PageHeaderLeadingAction(
    props: PageHeaderChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = { narrow: true }, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            hidden={hidden}
            data-component="PageHeader.LeadingAction"
            {...rest}
        />
    );
}

PageHeaderLeadingAction.displayName = "PageHeader.LeadingAction";

export default fixedForwardRef(PageHeaderLeadingAction);
