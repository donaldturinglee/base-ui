import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderTitleAreaProps } from "./PageHeader.types";

const classes = {
    root: "page-header-title-area",
};

// The title of the page and the visuals either side of it, shown on every viewport. The size
// it is given is what the whole header is drawn to
function PageHeaderTitleArea(
    props: PageHeaderTitleAreaProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, variant = "medium", ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.TitleArea"
            {...getResponsiveAttributes("size-variant", variant)}
            {...rest}
        />
    );
}

PageHeaderTitleArea.displayName = "PageHeader.TitleArea";

export default fixedForwardRef(PageHeaderTitleArea);
