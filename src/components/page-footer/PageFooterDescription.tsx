import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterChildProps } from "./PageFooter.types";

const classes = {
    root: "page-footer-description",
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
