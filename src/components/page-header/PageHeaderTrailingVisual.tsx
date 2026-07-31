import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    // As tall as a line of the title, so it sits against the title's first line however many
    // lines the title runs to
    root: "order-3 flex items-center h-[calc(var(--page-header-title-line-height)_*_1em)]",
};

// Stands after the title and says something about the page itself: that it is in beta, say
function PageHeaderTrailingVisual(
    props: PageHeaderChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.TrailingVisual"
            {...rest}
        />
    );
}

PageHeaderTrailingVisual.displayName = "PageHeader.TrailingVisual";

export default fixedForwardRef(PageHeaderTrailingVisual);
