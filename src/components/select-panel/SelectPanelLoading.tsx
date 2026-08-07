import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Spinner } from "../spinner";
import type { SelectPanelLoadingProps } from "./SelectPanel.types";

const classes = {
    root: "select-panel-loading",
    text: "select-panel-loading-text",
};

// Stands in place of the list while the items are being fetched. It is a live region, so the
// wait is announced to a reader whose focus has stayed in the search field
function SelectPanelLoading(
    props: SelectPanelLoadingProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children = "Fetching items...", ...rest } = props;

    return (
        <div
            ref={ref}
            role="status"
            aria-live="polite"
            className={classNames(classes.root, className)}
            data-component="SelectPanel.Loading"
            {...rest}
        >
            {/* The wait is announced by the wording below, so the spinner beside it is
                left as something to look at */}
            <Spinner size="medium" srText={null} role="presentation" />
            <span className={classes.text}>{children}</span>
        </div>
    );
}

SelectPanelLoading.displayName = "SelectPanel.Loading";

export default fixedForwardRef(SelectPanelLoading);
