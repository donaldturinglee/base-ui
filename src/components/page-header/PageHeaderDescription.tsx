import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "col-span-full row-start-3 flex flex-row items-center pt-[var(--base-size-8)] gap-[var(--stack-gap-condensed)] [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-normal)] leading-[var(--text-body-line-height-medium)]",
};

// Says more about whatever the page is about, standing under the title
function PageHeaderDescription(
    props: PageHeaderChildProps,
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
