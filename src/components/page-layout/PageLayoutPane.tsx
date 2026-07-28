import * as React from "react";
import { isResponsiveValue } from "../../hooks/useResponsive";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOverflow } from "../../hooks/useOverflow";
import { classNames } from "../../utilities/classnames";
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
    wrapper: "flex w-full mx-0",
    hidden: "data-[is-hidden=true]:hidden max-medium:data-[is-hidden-narrow=true]:hidden medium:data-[is-hidden-regular=true]:hidden xxlarge:data-[is-hidden-wide=true]:hidden",
    // Below the regular range the pane stacks with the content rather than standing beside
    // it, so the position decides which side of the fold it falls on
    narrowPosition:
        "max-medium:data-[position=end]:mt-[var(--spacing-row)] max-medium:data-[position=end]:flex-col max-medium:data-[position=end]:[order:var(--region-order-pane-end)] max-medium:data-[position=start]:mb-[var(--spacing-row)] max-medium:data-[position=start]:flex-col-reverse max-medium:data-[position=start]:[order:var(--region-order-pane-start)] max-medium:data-[position-narrow=end]:mt-[var(--spacing-row)] max-medium:data-[position-narrow=end]:flex-col max-medium:data-[position-narrow=end]:[order:var(--region-order-pane-end)] max-medium:data-[position-narrow=start]:mb-[var(--spacing-row)] max-medium:data-[position-narrow=start]:flex-col-reverse max-medium:data-[position-narrow=start]:[order:var(--region-order-pane-start)]",
    // From the regular range up it takes only the width it needs, and stands beside the
    // content on whichever side it was given
    regular: "medium:w-auto medium:my-0",
    regularPosition:
        "medium:data-[position=end]:ms-[var(--spacing-column)] medium:data-[position=end]:flex-row-reverse medium:data-[position=end]:[order:var(--region-order-pane-end)] medium:data-[position=start]:me-[var(--spacing-column)] medium:data-[position=start]:flex-row medium:data-[position=start]:[order:var(--region-order-pane-start)] medium:data-[position-regular=end]:ms-[var(--spacing-column)] medium:data-[position-regular=end]:flex-row-reverse medium:data-[position-regular=end]:[order:var(--region-order-pane-end)] medium:data-[position-regular=start]:me-[var(--spacing-column)] medium:data-[position-regular=start]:flex-row medium:data-[position-regular=start]:[order:var(--region-order-pane-start)]",
    widePosition:
        "xxlarge:data-[position-wide=end]:ms-[var(--spacing-column)] xxlarge:data-[position-wide=end]:flex-row-reverse xxlarge:data-[position-wide=end]:[order:var(--region-order-pane-end)] xxlarge:data-[position-wide=start]:me-[var(--spacing-column)] xxlarge:data-[position-wide=start]:flex-row xxlarge:data-[position-wide=start]:[order:var(--region-order-pane-start)]",
    sticky: "medium:data-[sticky]:sticky medium:data-[sticky]:top-[var(--offset-header)] medium:data-[sticky]:max-h-screen",
    // The pane scrolls on its own only once it stands beside the content
    pane: "w-[var(--pane-width-size)] p-[var(--spacing)] medium:overflow-auto",
    // A pane the reader can resize is held between its bounds, which JavaScript keeps up to
    // date as the viewport changes
    paneResizable:
        "data-[resizable]:w-full medium:data-[resizable]:w-[clamp(var(--pane-min-width),var(--pane-width),var(--pane-max-width))]",
    dragging:
        "data-[dragging=true]:[contain:layout_style_paint] data-[dragging=true]:pointer-events-none",
    // The horizontal divider only shows where the pane has stacked, so its spacing follows
    // the side it stacked on
    horizontalDivider:
        "data-[position=start]:mt-[var(--spacing)] data-[position=end]:mb-[var(--spacing)] max-medium:data-[position-narrow=start]:mt-[var(--spacing)] max-medium:data-[position-narrow=start]:mb-0 max-medium:data-[position-narrow=end]:mb-[var(--spacing)] max-medium:data-[position-narrow=end]:mt-0 medium:data-[position-regular=start]:mt-[var(--spacing)] medium:data-[position-regular=start]:mb-0 medium:data-[position-regular=end]:mb-[var(--spacing)] medium:data-[position-regular=end]:mt-0 xxlarge:data-[position-wide=start]:mt-[var(--spacing)] xxlarge:data-[position-wide=start]:mb-0 xxlarge:data-[position-wide=end]:mb-[var(--spacing)] xxlarge:data-[position-wide=end]:mt-0",
    verticalDivider:
        "data-[position=start]:ms-[var(--spacing)] data-[position=end]:me-[var(--spacing)] max-medium:data-[position-narrow=start]:ms-[var(--spacing)] max-medium:data-[position-narrow=start]:me-0 max-medium:data-[position-narrow=end]:me-[var(--spacing)] max-medium:data-[position-narrow=end]:ms-0 medium:data-[position-regular=start]:ms-[var(--spacing)] medium:data-[position-regular=start]:me-0 medium:data-[position-regular=end]:me-[var(--spacing)] medium:data-[position-regular=end]:ms-0 xxlarge:data-[position-wide=start]:ms-[var(--spacing)] xxlarge:data-[position-wide=start]:me-0 xxlarge:data-[position-wide=end]:me-[var(--spacing)] xxlarge:data-[position-wide=end]:ms-0",
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
                classes.narrowPosition,
                classes.regular,
                classes.regularPosition,
                classes.widePosition,
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
