import * as React from "react";
import { useSlots } from "../../hooks/useSlots";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { PageLayoutContext } from "./PageLayoutContext";
import PageLayoutFooter from "./PageLayoutFooter";
import PageLayoutHeader from "./PageLayoutHeader";
import PageLayoutSidebar from "./PageLayoutSidebar";
import type { PageLayoutProps, PageLayoutWidth } from "./PageLayout.types";

const classes = {
    content: "page-layout-content-row",
};

const pageLayoutVariants = cva("page-layout", {
    variants: {
        hasSidebar: {
            true: "page-layout-has-sidebar",
            false: "",
        },
    },
});

const pageLayoutWrapperVariants = cva("page-layout-wrapper", {
    variants: {
        width: {
            full: "page-layout-width-full",
            medium: "page-layout-width-medium",
            large: "page-layout-width-large",
            xlarge: "page-layout-width-xlarge",
        } satisfies Record<PageLayoutWidth, string>,
    },
});

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
                    pageLayoutVariants({ hasSidebar: Boolean(slots.sidebar) }),
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
                    className={classNames(pageLayoutWrapperVariants({ width: containerWidth }))}
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
