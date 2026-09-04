import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { hiddenOnRegularAndWide } from "./hiddenDefaults";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderContextAreaActionsProps } from "./PageHeader.types";

const classes = {
    root: "page-header-context-area-actions",
};

// The actions that stand at the far end of the context area
function PageHeaderContextAreaActions(
    props: PageHeaderContextAreaActionsProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = hiddenOnRegularAndWide, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.ContextAreaActions"
            hidden={hidden}
            {...rest}
        />
    );
}

PageHeaderContextAreaActions.displayName = "PageHeader.ContextAreaActions";

export default fixedForwardRef(PageHeaderContextAreaActions);
