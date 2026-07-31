import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterChildProps } from "./PageFooter.types";

const classes = {
    root: "col-start-2 row-start-2 flex flex-row items-center gap-[var(--stack-gap-condensed)]",
};

// Says who the page belongs to, standing on the closing line. The year is the caller's, since
// only the caller knows which year it is meant to be
function PageFooterCopyright(
    props: PageFooterChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageFooterRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageFooter.Copyright"
            {...rest}
        />
    );
}

PageFooterCopyright.displayName = "PageFooter.Copyright";

export default fixedForwardRef(PageFooterCopyright);
