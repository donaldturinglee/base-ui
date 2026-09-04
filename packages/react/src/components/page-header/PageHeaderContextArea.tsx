import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { hiddenOnRegularAndWide } from "./hiddenDefaults";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderContextAreaProps } from "./PageHeader.types";

const classes = {
    root: "page-header-context-area",
};

// Only shown on a narrow viewport by default, above the title, where it tells the reader where
// in the site they are. Holds the parent link, the context bar and the context area actions
function PageHeaderContextArea(
    props: PageHeaderContextAreaProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, hidden = hiddenOnRegularAndWide, ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageHeader.ContextArea"
            hidden={hidden}
            {...rest}
        />
    );
}

PageHeaderContextArea.displayName = "PageHeader.ContextArea";

export default fixedForwardRef(PageHeaderContextArea);
