import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderActionsProps } from "./PageHeader.types";

const classes = {
    root: "page-header-actions",
};

// The actions of the page, standing at the far end of the title row on every viewport
function PageHeaderActions(
    props: PageHeaderActionsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.Actions"
            {...rest}
        />
    );
}

PageHeaderActions.displayName = "PageHeader.Actions";

export default fixedForwardRef(PageHeaderActions);
