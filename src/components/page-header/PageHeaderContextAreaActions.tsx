import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "page-header-context-area-actions",
};

// What can be done from the context area, standing at the far end of it
function PageHeaderContextAreaActions(
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
            data-component="PageHeader.ContextAreaActions"
            {...rest}
        />
    );
}

PageHeaderContextAreaActions.displayName = "PageHeader.ContextAreaActions";

export default fixedForwardRef(PageHeaderContextAreaActions);
