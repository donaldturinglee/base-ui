import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageFooterRegion from "./PageFooterRegion";
import type { PageFooterChildProps } from "./PageFooter.types";

const classes = {
    root: "page-footer-actions",
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
