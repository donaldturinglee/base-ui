import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    PageSidebarPosition,
    PageSidebarProps,
    PageSidebarSpacing,
    PageSidebarWidth,
} from "./PageSidebar.types";

const pageSidebarVariants = cva(
    [
        // The runs of the sidebar stand one under the next. It is kept from being squeezed by
        // whatever it stands beside, since its width is the whole point of it
        "flex flex-col shrink-0 min-w-0",
        // The sidebar carries the room between its runs, so that the runs held by the content
        // are spaced the same as the parts standing either side of it
        "gap-[var(--page-sidebar-gap)]",
    ],
    {
        variants: {
            width: {
                small: "w-full medium:w-[240px] large:w-[256px]",
                medium: "w-full medium:w-[256px] large:w-[296px]",
                large: "w-full medium:w-[256px] large:w-[320px]",
            } satisfies Record<PageSidebarWidth, string>,
            position: {
                start: "[order:-1]",
                end: "[order:1]",
            } satisfies Record<PageSidebarPosition, string>,
            padding: {
                none: "p-0",
                condensed: "p-[var(--base-size-8)]",
                normal: "p-[var(--base-size-16)]",
                spacious: "p-[var(--base-size-24)]",
            } satisfies Record<PageSidebarSpacing, string>,
            gap: {
                none: "[--page-sidebar-gap:0px]",
                condensed: "[--page-sidebar-gap:var(--stack-gap-condensed)]",
                normal: "[--page-sidebar-gap:var(--stack-gap-normal)]",
                spacious: "[--page-sidebar-gap:var(--stack-gap-spacious)]",
            } satisfies Record<PageSidebarSpacing, string>,
            // A sidebar that stays put is as tall as the viewport, so anything past that has to
            // scroll within it. Where the content of a sidebar runs long enough to matter, wrap
            // it in a ScrollableRegion, which only becomes a landmark once it really does scroll
            sticky: {
                true: "sticky top-0 h-screen overflow-auto",
                false: "",
            },
            hasBorder: {
                true: "",
                false: "",
            },
        },
        // The line falls on whichever edge faces the content, so it always reads as the join
        // between the sidebar and the page rather than as an edge of the viewport
        compoundVariants: [
            {
                hasBorder: true,
                position: "start",
                class: "border-solid border-e-[length:var(--border-width-thin)] border-e-border-default",
            },
            {
                hasBorder: true,
                position: "end",
                class: "border-solid border-s-[length:var(--border-width-thin)] border-s-border-default",
            },
        ],
    },
);

// The side column of a page: what stands beside the content rather than in it. A narrow
// viewport has no room alongside, so it runs the whole width there and takes its turn in the
// order instead
function PageSidebar<As extends React.ElementType = "aside">(
    props: PageSidebarProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "aside",
        className,
        position = "start",
        width = "medium",
        padding = "normal",
        gap = "normal",
        sticky,
        hasBorder,
        ...rest
    } = props as PageSidebarProps<"aside">;

    return (
        <Component
            ref={ref}
            className={classNames(
                pageSidebarVariants({ width, position, padding, gap, sticky, hasBorder }),
                className,
            )}
            data-component="PageSidebar"
            data-position={position}
            data-width={width}
            data-padding={padding}
            data-gap={gap}
            data-sticky={sticky ? "" : undefined}
            data-has-border={hasBorder ? "" : undefined}
            {...rest}
        />
    );
}

PageSidebar.displayName = "PageSidebar";

export default fixedForwardRef(PageSidebar);
