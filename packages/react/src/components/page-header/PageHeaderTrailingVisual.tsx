import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderTrailingVisualProps } from "./PageHeader.types";

const classes = {
    root: "page-header-trailing-visual",
};

// A visual standing after the title, such as a label saying what state the page is in, kept
// on every viewport
function PageHeaderTrailingVisual(
    props: PageHeaderTrailingVisualProps,
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
