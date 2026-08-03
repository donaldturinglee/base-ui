import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import type { PageLayoutDividerProps } from "./PageLayout.types";

// As with the horizontal divider, each viewport range is written out in full so that every
// class name reaches the stylesheet
const classes = {
    root: "page-layout-vertical-divider",
};

function PageLayoutVerticalDivider(
    props: PageLayoutDividerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, variant = "none", position, ...rest } = props;

    return (
        <div
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="PageLayout.VerticalDivider"
            {...getResponsiveAttributes("variant", variant)}
            {...getResponsiveAttributes("position", position)}
            {...rest}
        />
    );
}

PageLayoutVerticalDivider.displayName = "PageLayout.VerticalDivider";

export default fixedForwardRef(PageLayoutVerticalDivider);
