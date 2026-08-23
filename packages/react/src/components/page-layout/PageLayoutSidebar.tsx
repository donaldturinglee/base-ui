import * as React from "react";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOverflow } from "../../hooks/useOverflow";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import DragHandle from "./DragHandle";
import { PageLayoutContext } from "./PageLayoutContext";
import PageLayoutVerticalDivider from "./PageLayoutVerticalDivider";
import { isCustomWidthOptions, isPaneWidth, updateAriaValues } from "./paneUtils";
import { usePaneWidth } from "./usePaneWidth";
import type { PageLayoutSidebarProps } from "./PageLayout.types";

const classes = {
    wrapper: "page-layout-sidebar-wrapper",
    hidden: "page-layout-hidden",
    position: "page-layout-sidebar-position",
    sticky: "page-layout-sidebar-sticky",
    fullscreen: "page-layout-sidebar-fullscreen",
    sidebar: "page-layout-sidebar",
    sidebarResizable: "page-layout-sidebar-resizable",
    dragging: "page-layout-dragging",
    sidebarFullscreen: "page-layout-sidebar-fullscreen-inner",
    divider: "page-layout-sidebar-divider",
};

function PageLayoutSidebar(
    props: PageLayoutSidebarProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        children,
        id,
        position = "start",
        width = "medium",
        minWidth = 256,
        currentWidth: controlledWidth,
        onResizeEnd,
        widthStorageKey,
        padding = "none",
        divider = "none",
        resizable = false,
        sticky = false,
        responsiveVariant = "default",
        hidden = false,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const { columnGap, sidebarRef, sidebarContentWrapperRef } = React.useContext(PageLayoutContext);

    const handleRef = React.useRef<HTMLDivElement>(null);
    const dragStartClientX = React.useRef(0);
    const dragStartWidth = React.useRef(0);
    const dragMaxWidth = React.useRef(0);

    const {
        currentWidth,
        currentWidthRef,
        minPaneWidth,
        maxPaneWidth,
        getMaxPaneWidth,
        getDefaultWidth,
        saveWidth,
    } = usePaneWidth({
        width,
        minWidth,
        resizable,
        widthStorageKey,
        paneRef: sidebarRef,
        handleRef,
        contentWrapperRef: sidebarContentWrapperRef,
        // The sidebar stands in a row that does not wrap, so it can never be wider than
        // what the viewport leaves
        constrainToViewport: true,
        onResizeEnd,
        currentWidth: controlledWidth,
    });

    const mergedSidebarRef = useMergedRefs(ref, sidebarRef);
    const hasOverflow = useOverflow(sidebarRef);
    const sidebarId = useId(id);

    const labelProps = hasOverflow
        ? {
              role: "region",
              tabIndex: 0,
              ...(ariaLabelledBy
                  ? { "aria-labelledby": ariaLabelledBy }
                  : ariaLabel
                    ? { "aria-label": ariaLabel }
                    : {}),
          }
        : {};

    const setSidebarWidth = (value: number) => {
        sidebarRef.current?.style.setProperty("--pane-width", `${value}px`);
        currentWidthRef.current = value;
    };

    const line = (
        <PageLayoutVerticalDivider
            variant={resizable ? "line" : divider}
            position={position}
            className={classes.divider}
        >
            {resizable ? (
                <DragHandle
                    handleRef={handleRef}
                    dragTargetRef={sidebarRef}
                    contentWrapperRef={sidebarContentWrapperRef}
                    aria-valuemin={minPaneWidth}
                    aria-valuemax={maxPaneWidth}
                    aria-valuenow={currentWidth}
                    onDragStart={(clientX) => {
                        dragStartClientX.current = clientX;
                        dragStartWidth.current =
                            sidebarRef.current?.getBoundingClientRect().width ??
                            currentWidthRef.current;
                        dragMaxWidth.current = getMaxPaneWidth();
                    }}
                    onDrag={(value, isKeyboard) => {
                        const maxWidth = isKeyboard ? getMaxPaneWidth() : dragMaxWidth.current;

                        if (isKeyboard) {
                            // A sidebar at the end grows as the arrow keys move away from
                            // it, so the step is turned around to keep them reading right
                            const delta = position === "end" ? -value : value;
                            const next = Math.max(
                                minPaneWidth,
                                Math.min(maxWidth, currentWidthRef.current + delta),
                            );

                            if (next !== currentWidthRef.current) {
                                setSidebarWidth(next);
                                updateAriaValues(handleRef.current, {
                                    current: next,
                                    max: maxWidth,
                                });
                            }

                            return;
                        }

                        if (!sidebarRef.current) {
                            return;
                        }

                        const delta = value - dragStartClientX.current;
                        const next = Math.max(
                            minPaneWidth,
                            Math.min(
                                maxWidth,
                                dragStartWidth.current + (position === "end" ? -delta : delta),
                            ),
                        );

                        if (Math.round(next) !== Math.round(currentWidthRef.current)) {
                            setSidebarWidth(next);
                            updateAriaValues(handleRef.current, {
                                current: Math.round(next),
                                max: maxWidth,
                            });
                        }
                    }}
                    onDragEnd={() => saveWidth(currentWidthRef.current)}
                    onDoubleClick={() => {
                        const reset = getDefaultWidth();

                        setSidebarWidth(reset);
                        updateAriaValues(handleRef.current, { current: reset });
                        saveWidth(reset);
                    }}
                />
            ) : null}
        </PageLayoutVerticalDivider>
    );

    return (
        <div
            className={classNames(
                classes.wrapper,
                classes.hidden,
                classes.position,
                classes.sticky,
                classes.fullscreen,
                className,
            )}
            style={
                {
                    "--spacing-column": `var(--page-layout-spacing-${columnGap})`,
                    ...style,
                } as React.CSSProperties
            }
            data-position={position}
            data-sticky={sticky || undefined}
            data-responsive-variant={
                responsiveVariant === "default" ? undefined : responsiveVariant
            }
            {...getResponsiveAttributes("is-hidden", hidden)}
        >
            {/* The line always falls between the sidebar and the rest of the page */}
            {position === "end" ? line : null}
            <div
                ref={mergedSidebarRef}
                suppressHydrationWarning={resizable && Boolean(widthStorageKey) && !onResizeEnd}
                className={classNames(
                    classes.sidebar,
                    classes.sidebarResizable,
                    classes.sidebarFullscreen,
                    classes.dragging,
                )}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${padding})`,
                        "--pane-min-width": isCustomWidthOptions(width)
                            ? width.min
                            : `${minWidth}px`,
                        "--pane-max-width": isCustomWidthOptions(width)
                            ? width.max
                            : "calc(100vw - var(--sidebar-max-width-diff))",
                        "--pane-width-custom": isCustomWidthOptions(width)
                            ? width.default
                            : undefined,
                        "--pane-width-size": `var(--pane-width-${isPaneWidth(width) ? width : "custom"})`,
                        "--pane-width": `${currentWidth}px`,
                    } as React.CSSProperties
                }
                data-component="PageLayout.Sidebar"
                data-resizable={resizable || undefined}
                {...labelProps}
                {...(id ? { id: sidebarId } : {})}
                {...rest}
            >
                {children}
            </div>
            {position === "start" ? line : null}
        </div>
    );
}

PageLayoutSidebar.displayName = "PageLayout.Sidebar";

export default fixedForwardRef(PageLayoutSidebar);
