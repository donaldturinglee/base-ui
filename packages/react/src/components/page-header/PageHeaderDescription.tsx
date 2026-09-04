import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderDescriptionProps } from "./PageHeader.types";

const classes = {
    root: "page-header-description",
};

// A line about the page beneath the title, shown on every viewport
function PageHeaderDescription(
    props: PageHeaderDescriptionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.Description"
            {...rest}
        />
    );
}

PageHeaderDescription.displayName = "PageHeader.Description";

export default fixedForwardRef(PageHeaderDescription);
