import * as React from "react";
import { useSlots } from "../../hooks/useSlots";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { PageLayoutContext } from "./PageLayoutContext";
import PageLayoutFooter from "./PageLayoutFooter";
import PageLayoutHeader from "./PageLayoutHeader";
import PageLayoutSidebar from "./PageLayoutSidebar";
import type { PageLayoutProps, PageLayoutWidth } from "./PageLayout.types";

const classes = {
    // The scale every region reads its spacing from, and the order the regions fall into
    // once the page wraps
    root: "p-[var(--spacing)] [--page-layout-spacing-none:0px] [--page-layout-spacing-condensed:var(--base-size-16)] [--page-layout-spacing-normal:var(--base-size-16)] large:[--page-layout-spacing-normal:var(--base-size-24)] [--region-order-header:0] [--region-order-pane-start:1] [--region-order-content:2] [--region-order-pane-end:3] [--region-order-footer:4]",
    // A pane is as wide as the page until there is room beside the content for it
    paneWidths:
        "[--pane-width-small:100%] [--pane-width-medium:100%] [--pane-width-large:100%] medium:[--pane-width-small:240px] medium:[--pane-width-medium:256px] medium:[--pane-width-large:256px] large:[--pane-width-small:256px] large:[--pane-width-medium:296px] large:[--pane-width-large:320px]",
    // How much of the viewport a resizable region has to leave for everything beside it.
    // A sidebar reserves less, since nothing else has to fit alongside
    maxWidthDiff:
        "[--pane-max-width-diff:511px] [--sidebar-max-width-diff:256px] xlarge:[--pane-max-width-diff:959px]",
    // A sidebar stands beside everything else, so the page container is laid out in a row
    // around it
    hasSidebar:
        "flex flex-row [&>[data-page-layout-wrapper]]:shrink [&>[data-page-layout-wrapper]]:min-w-0",
    wrapper: "flex flex-wrap w-full h-full mx-auto",
    width: {
        full: "max-w-full",
        medium: "max-w-[768px]",
        large: "max-w-[1012px]",
        xlarge: "max-w-[1280px]",
    } satisfies Record<PageLayoutWidth, string>,
    // The header, the content and the footer share a line with the panes, which take their
    // place in it through the region order above
    content: "flex flex-wrap flex-1 basis-full max-w-full max-medium:flex-col",
};

// Lays a page out as a header, a body of content with panes either side of it, and a
// footer, with an optional sidebar standing outside the lot
function PageLayout(
    props: PageLayoutProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        children,
        containerWidth = "xlarge",
        padding = "normal",
        rowGap = "normal",
        columnGap = "normal",
        ...rest
    } = props;

    const paneRef = React.useRef<HTMLDivElement>(null);
    const contentWrapperRef = React.useRef<HTMLDivElement>(null);
    const sidebarRef = React.useRef<HTMLDivElement>(null);
    const sidebarContentWrapperRef = React.useRef<HTMLDivElement>(null);

    const [slots, rest_] = useSlots(children, {
        header: PageLayoutHeader,
        footer: PageLayoutFooter,
        sidebar: PageLayoutSidebar,
    });

    const context = React.useMemo(
        () => ({
            padding,
            rowGap,
            columnGap,
            paneRef,
            contentWrapperRef,
            sidebarRef,
            sidebarContentWrapperRef,
        }),
        [padding, rowGap, columnGap],
    );

    return (
        <PageLayoutContext.Provider value={context}>
            <div
                ref={ref}
                className={classNames(
                    classes.root,
                    classes.paneWidths,
                    classes.maxWidthDiff,
                    slots.sidebar && classes.hasSidebar,
                    className,
                )}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${padding})`,
                        ...style,
                    } as React.CSSProperties
                }
                data-component="PageLayout"
                data-has-sidebar={slots.sidebar ? "" : undefined}
                {...rest}
            >
                {slots.sidebar}
                <div
                    ref={sidebarContentWrapperRef}
                    className={classNames(classes.wrapper, classes.width[containerWidth])}
                    data-page-layout-wrapper=""
                    data-width={containerWidth}
                >
                    {slots.header}
                    <div className={classes.content}>{rest_}</div>
                    {slots.footer}
                </div>
            </div>
        </PageLayoutContext.Provider>
    );
}

PageLayout.displayName = "PageLayout";

export default fixedForwardRef(PageLayout);
