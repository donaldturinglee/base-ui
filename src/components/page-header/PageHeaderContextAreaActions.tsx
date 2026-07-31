import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "order-3 flex grow flex-row items-center justify-end gap-[var(--stack-gap-condensed)]",
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
