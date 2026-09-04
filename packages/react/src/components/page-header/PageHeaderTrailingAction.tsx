import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { hiddenOnNarrow } from "./hiddenDefaults";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderTrailingActionProps } from "./PageHeader.types";

const classes = {
    root: "page-header-trailing-action",
};

// An action standing right after the title, such as a way to edit it. Only shown from the
// regular range up by default
function PageHeaderTrailingAction(
    props: PageHeaderTrailingActionProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = hiddenOnNarrow, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.TrailingAction"
            hidden={hidden}
            {...rest}
        />
    );
}

PageHeaderTrailingAction.displayName = "PageHeader.TrailingAction";

export default fixedForwardRef(PageHeaderTrailingAction);
