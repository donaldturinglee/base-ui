import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterChildProps } from "./PageFooter.types";

const classes = {
    root: "col-start-3 row-start-2 flex min-w-max flex-row items-center justify-end ps-[var(--base-size-8)] gap-[var(--stack-gap-condensed)] h-[calc(var(--page-footer-text-line-height)_*_1em)]",
};

// What can be done from the foot of the page rather than from the page itself: picking a
// language, going back to the top. It stands at the far end of the closing line
function PageFooterActions(
    props: PageFooterChildProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, ...rest } = props;

    return (
        <PageFooterRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageFooter.Actions"
            {...rest}
        />
    );
}

PageFooterActions.displayName = "PageFooter.Actions";

export default fixedForwardRef(PageFooterActions);
