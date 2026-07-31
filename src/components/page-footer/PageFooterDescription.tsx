import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterChildProps } from "./PageFooter.types";

const classes = {
    root: "col-span-full row-start-3 flex flex-row items-center pt-[var(--base-size-8)] gap-[var(--stack-gap-condensed)] [font-size:var(--text-body-size-small)] leading-[var(--text-body-line-height-small)]",
};

// The small print, standing under the closing line: whatever has to be said and belongs with
// none of the rest of the page
function PageFooterDescription(
    props: PageFooterChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageFooterRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageFooter.Description"
            {...rest}
        />
    );
}

PageFooterDescription.displayName = "PageFooter.Description";

export default fixedForwardRef(PageFooterDescription);
