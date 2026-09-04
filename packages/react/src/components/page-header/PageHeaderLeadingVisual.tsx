import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderLeadingVisualProps } from "./PageHeader.types";

const classes = {
    root: "page-header-leading-visual",
};

// A visual standing before the title, such as an icon or an avatar, kept on every viewport
function PageHeaderLeadingVisual(
    props: PageHeaderLeadingVisualProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.LeadingVisual"
            {...rest}
        />
    );
}

PageHeaderLeadingVisual.displayName = "PageHeader.LeadingVisual";

export default fixedForwardRef(PageHeaderLeadingVisual);
