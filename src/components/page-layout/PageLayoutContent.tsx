import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import { PageLayoutContext } from "./PageLayoutContext";
import type { PageLayoutContentProps, PageLayoutWidth } from "./PageLayout.types";

const classes = {
    // The basis of zero is what lets the content take the room left over rather than the
    // room its contents ask for, which would otherwise wrap the pane onto its own line. The
    // minimum width does the same for anything inside that overflows
    wrapper:
        "flex flex-col w-full min-w-px grow shrink basis-0 [order:var(--region-order-content)]",
    hidden: "data-[is-hidden=true]:hidden max-medium:data-[is-hidden-narrow=true]:hidden medium:data-[is-hidden-regular=true]:hidden xxlarge:data-[is-hidden-wide=true]:hidden",
    // A drag holds the content still, so the browser has less to work out on every move
    dragging:
        "data-[dragging=true]:[contain:layout_style_paint] data-[dragging=true]:pointer-events-none",
};

const pageLayoutContentVariants = cva("w-full grow mx-auto p-[var(--spacing)]", {
    variants: {
        width: {
            full: "max-w-full",
            medium: "max-w-[768px]",
            large: "max-w-[1012px]",
            xlarge: "max-w-[1280px]",
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
