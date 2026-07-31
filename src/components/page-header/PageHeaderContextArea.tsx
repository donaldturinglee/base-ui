import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderChildProps } from "./PageHeader.types";

const classes = {
    root: "col-span-full row-start-1 flex flex-row items-center gap-[var(--stack-gap-condensed)] pb-[var(--base-size-8)] [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-normal)] leading-[var(--text-body-line-height-medium)]",
};

// Stands above the title and says where in the site the reader is. A narrow viewport has no
// room for that anywhere else, so it is only drawn there unless the caller says otherwise
function PageHeaderContextArea(
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
            data-component="PageHeader.ContextArea"
            {...rest}
        />
    );
}

PageHeaderContextArea.displayName = "PageHeader.ContextArea";

export default fixedForwardRef(PageHeaderContextArea);
