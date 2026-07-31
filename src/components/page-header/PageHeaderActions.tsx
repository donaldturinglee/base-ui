import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "col-start-5 row-start-2 flex min-w-max flex-row items-center justify-end ps-[var(--base-size-8)] gap-[var(--stack-gap-condensed)] h-[calc(var(--page-header-title-line-height)_*_1em)]",
};

// What can be done to whatever the page is about, standing at the far end of the title row
function PageHeaderActions(
    props: PageHeaderChildProps,
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
