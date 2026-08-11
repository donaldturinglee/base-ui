import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { PageLayoutContext } from "./PageLayoutContext";
import type { PageLayoutContentProps, PageLayoutWidth } from "./PageLayout.types";

const classes = {
    wrapper: "page-layout-content-wrapper",
    hidden: "page-layout-hidden",
    dragging: "page-layout-dragging",
};

const pageLayoutContentVariants = cva("page-layout-content", {
    variants: {
        width: {
            full: "page-layout-content-width-full",
            medium: "page-layout-content-width-medium",
            large: "page-layout-content-width-large",
            xlarge: "page-layout-content-width-xlarge",
        } satisfies Record<PageLayoutWidth, string>,
    },
});

function PageLayoutContent(
    props: PageLayoutContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "main",
        className,
        children,
        width = "full",
        padding = "none",
        hidden = false,
        ...rest
    } = props;

    // The layout holds the content wrapper itself, so a pane being dragged can hold it
    // still alongside the pane
    const { contentWrapperRef } = React.useContext(PageLayoutContext);
    const mergedRef = useMergedRefs(ref, contentWrapperRef);

    return (
        <Component
            ref={mergedRef}
            className={classNames(classes.wrapper, classes.hidden, classes.dragging, className)}
            data-component="PageLayout.Content"
            {...getResponsiveAttributes("is-hidden", hidden)}
            {...rest}
        >
            <div
                className={classNames(pageLayoutContentVariants({ width }))}
                data-width={width}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${padding})`,
                    } as React.CSSProperties
                }
            >
                {children}
            </div>
        </Component>
    );
}

PageLayoutContent.displayName = "PageLayout.Content";

export default fixedForwardRef(PageLayoutContent);
