import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderTitleAreaProps } from "./PageHeader.types";

const classes = {
    root: "page-header-title-area",
};

// Holds the title and whatever stands either side of it. Which size the title is drawn in is
// read off here by the header around it, since the whole header is set against that line
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
