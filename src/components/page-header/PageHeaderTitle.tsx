import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import PageHeaderRegion from "./PageHeaderRegion";
import type { PageHeaderTitleProps } from "./PageHeader.types";

const classes = {
    // The type is set by the header around it, so that everything standing beside the title
    // is sized against the same line
    root: "order-2 block m-0 [font-size:inherit] [font-weight:inherit]",
};

// Names the page. Which heading level it is drawn as is the caller's, since that follows from
// what else the page already holds
function PageHeaderTitle(
    props: PageHeaderTitleProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, as = "h2", ...rest } = props;

    return (
        <PageHeaderRegion
            ref={ref}
            as={as}
            className={classNames(classes.root, className)}
            data-component="PageHeader.Title"
            {...rest}
        />
    );
}

PageHeaderTitle.displayName = "PageHeader.Title";

export default fixedForwardRef(PageHeaderTitle);
