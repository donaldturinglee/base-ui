import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOverflow } from "../../hooks/useOverflow";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import DragHandle from "./DragHandle";
import { PageLayoutContext } from "./PageLayoutContext";
import PageLayoutHorizontalDivider from "./PageLayoutHorizontalDivider";
import PageLayoutVerticalDivider from "./PageLayoutVerticalDivider";
import { isCustomWidthOptions, isPaneWidth, updateAriaValues } from "./paneUtils";
import { usePaneWidth } from "./usePaneWidth";
import type { PageLayoutPaneProps } from "./PageLayout.types";

const classes = {
    wrapper: "page-layout-pane-wrapper",
    hidden: "page-layout-hidden",
    position: "page-layout-pane-position",
    sticky: "page-layout-pane-sticky",
    pane: "page-layout-pane",
    paneResizable: "page-layout-pane-resizable",
    dragging: "page-layout-dragging",
    horizontalDivider: "page-layout-pane-horizontal-divider",
    verticalDivider: "page-layout-pane-vertical-divider",
};

function PageLayoutPane(
    props: PageLayoutPaneProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        style,
        children,
        id,
        position: responsivePosition = "end",
        width = "medium",
        minWidth = 256,
        currentWidth: controlledWidth,
        onResizeEnd,
        widthStorageKey = "paneWidth",
        padding = "none",
        divider: responsiveDivider = "none",
        resizable = false,
        sticky = false,
        offsetHeader = 0,
        hidden = false,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    // The layout of a responsive value is left to CSS; the JavaScript below only needs one
    // of them to work the drag out from
    const position = isResponsiveValue(responsivePosition) ? "end" : responsivePosition;
    const dividerVariant = isResponsiveValue(responsiveDivider) ? "none" : responsiveDivider;

    const { rowGap, columnGap, paneRef, contentWrapperRef } = React.useContext(PageLayoutContext);

    const handleRef = React.useRef<HTMLDivElement>(null);
    // Where the drag began, so every move is worked out as a distance from it. That is
    // steady even where the page shifts underneath, as it does when a scrollbar appears
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
        paneRef,
        handleRef,
        contentWrapperRef,
        onResizeEnd,
        currentWidth: controlledWidth,
    });

    const mergedPaneRef = useMergedRefs(ref, paneRef);
    const hasOverflow = useOverflow(paneRef);
    const paneId = useId(id);

    // A pane that scrolls becomes a landmark, so it is only named where it has one
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

    const setPaneWidth = (value: number) => {
        paneRef.current?.style.setProperty("--pane-width", `${value}px`);
        currentWidthRef.current = value;
    };

    return (
        <div
            className={classNames(
                classes.wrapper,
                classes.hidden,
                classes.position,
                classes.sticky,
                className,
            )}
            style={
                {
                    "--offset-header":
                        typeof offsetHeader === "number" ? `${offsetHeader}px` : offsetHeader,
                    "--spacing-row": `var(--page-layout-spacing-${rowGap})`,
                    "--spacing-column": `var(--page-layout-spacing-${columnGap})`,
                    ...style,
                } as React.CSSProperties
            }
            data-sticky={sticky || undefined}
            {...getResponsiveAttributes("is-hidden", hidden)}
            {...getResponsiveAttributes("position", responsivePosition)}
        >
            {/* A stacked pane is divided from the content across the page; a pane standing
                beside it is divided down the page */}
            <PageLayoutHorizontalDivider
                variant={
                    isResponsiveValue(responsiveDivider)
                        ? responsiveDivider
                        : { narrow: dividerVariant, regular: "none" }
                }
                position={responsivePosition}
                className={classes.horizontalDivider}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${rowGap})`,
                    } as React.CSSProperties
                }
            />

            <div
                ref={mergedPaneRef}
                // A width read back from storage will not match the one rendered on the
                // server, and that is expected rather than a mistake
                suppressHydrationWarning={resizable && !onResizeEnd}
                className={classNames(classes.pane, classes.paneResizable, classes.dragging)}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${padding})`,
                        "--pane-min-width": isCustomWidthOptions(width)
                            ? width.min
                            : `${minWidth}px`,
                        "--pane-max-width": isCustomWidthOptions(width)
                            ? width.max
                            : "calc(100vw - var(--pane-max-width-diff))",
                        "--pane-width-custom": isCustomWidthOptions(width)
                            ? width.default
                            : undefined,
                        "--pane-width-size": `var(--pane-width-${isPaneWidth(width) ? width : "custom"})`,
                        "--pane-width": `${currentWidth}px`,
                    } as React.CSSProperties
                }
                data-component="PageLayout.Pane"
                data-resizable={resizable || undefined}
                {...labelProps}
                {...(id ? { id: paneId } : {})}
                {...rest}
            >
                {children}
            </div>

            <PageLayoutVerticalDivider
                variant={
                    isResponsiveValue(responsiveDivider)
                        ? {
                              narrow: "none",
                              regular: resizable ? "line" : (responsiveDivider.regular ?? "none"),
                              wide: resizable
                                  ? "line"
                                  : (responsiveDivider.wide ?? responsiveDivider.regular ?? "none"),
                          }
                        : // A pane that can be resized always shows the line the reader takes
                          // hold of
                          { narrow: "none", regular: resizable ? "line" : dividerVariant }
                }
                position={responsivePosition}
                className={classes.verticalDivider}
                style={
                    {
                        "--spacing": `var(--page-layout-spacing-${columnGap})`,
                    } as React.CSSProperties
                }
            >
                {resizable ? (
                    <DragHandle
                        handleRef={handleRef}
                        dragTargetRef={paneRef}
                        contentWrapperRef={contentWrapperRef}
                        aria-valuemin={minPaneWidth}
                        aria-valuemax={maxPaneWidth}
                        aria-valuenow={currentWidth}
                        onDragStart={(clientX) => {
                            dragStartClientX.current = clientX;
                            dragStartWidth.current =
                                paneRef.current?.getBoundingClientRect().width ??
                                currentWidthRef.current;
                            dragMaxWidth.current = getMaxPaneWidth();
                        }}
                        onDrag={(value, isKeyboard) => {
                            const maxWidth = isKeyboard ? getMaxPaneWidth() : dragMaxWidth.current;

                            if (isKeyboard) {
                                const next = Math.max(
                                    minPaneWidth,
                                    Math.min(maxWidth, currentWidthRef.current + value),
                                );

                                if (next !== currentWidthRef.current) {
                                    setPaneWidth(next);
                                    updateAriaValues(handleRef.current, {
                                        current: next,
                                        max: maxWidth,
                                    });
                                }

                                return;
                            }

                            if (!paneRef.current) {
                                return;
                            }

                            // A pane at the end grows as the pointer moves towards the
                            // start, and the other way round for a pane at the start
                            const delta = value - dragStartClientX.current;
                            const next = Math.max(
                                minPaneWidth,
                                Math.min(
                                    maxWidth,
                                    dragStartWidth.current + (position === "end" ? -delta : delta),
                                ),
                            );

                            if (Math.round(next) !== Math.round(currentWidthRef.current)) {
                                setPaneWidth(next);
                                updateAriaValues(handleRef.current, {
                                    current: Math.round(next),
                                    max: maxWidth,
                                });
                            }
                        }}
                        onDragEnd={() => saveWidth(currentWidthRef.current)}
                        onDoubleClick={() => {
                            const reset = getDefaultWidth();

                            setPaneWidth(reset);
                            updateAriaValues(handleRef.current, { current: reset });
                            saveWidth(reset);
                        }}
                    />
                ) : null}
            </PageLayoutVerticalDivider>
        </div>
    );
}

PageLayoutPane.displayName = "PageLayout.Pane";

export default fixedForwardRef(PageLayoutPane);
