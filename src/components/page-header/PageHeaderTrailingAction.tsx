import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "page-header-trailing-action",
};

// Something to press straight after the title, which acts on the title itself: renaming it,
// say. A narrow viewport has no room for it beside the title, so it is left off there by
// default
function PageHeaderTrailingAction(
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
            data-component="PageHeader.TrailingAction"
            {...rest}
        />
    );
}

PageHeaderTrailingAction.displayName = "PageHeader.TrailingAction";

export default fixedForwardRef(PageHeaderTrailingAction);
