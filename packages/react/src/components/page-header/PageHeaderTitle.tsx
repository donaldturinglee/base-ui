import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import type { PageHeaderTitleProps } from "./PageHeader.types";

const classes = {
    root: "page-header-title",
    hidden: "page-header-hidden",
};

// The heading that names the page. It takes the type the header sets, so the size the title
// area asks for is what it is drawn at whichever heading level it is rendered as
function PageHeaderTitle(
    props: PageHeaderTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h2", className, hidden = false, ...rest } = props;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.hidden, className)}
            data-component="PageHeader.Title"
            {...getResponsiveAttributes("hidden", hidden)}
            {...rest}
        />
    );
}

PageHeaderTitle.displayName = "PageHeader.Title";

export default fixedForwardRef(PageHeaderTitle);
