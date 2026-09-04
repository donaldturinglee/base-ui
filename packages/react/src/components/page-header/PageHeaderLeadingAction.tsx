import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { hiddenOnNarrow } from "./hiddenDefaults";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderLeadingActionProps } from "./PageHeader.types";

const classes = {
    root: "page-header-leading-action",
};

// An action standing before the title, such as a way back. Only shown from the regular range
// up by default, since a narrow viewport has the parent link for that
function PageHeaderLeadingAction(
    props: PageHeaderLeadingActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = hiddenOnNarrow, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.LeadingAction"
            hidden={hidden}
            {...rest}
        />
    );
}

PageHeaderLeadingAction.displayName = "PageHeader.LeadingAction";

export default fixedForwardRef(PageHeaderLeadingAction);
