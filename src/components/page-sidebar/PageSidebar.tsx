import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    PageSidebarPosition,
    PageSidebarProps,
    PageSidebarSpacing,
    PageSidebarWidth,
} from "./PageSidebar.types";

const pageSidebarVariants = cva("page-sidebar", {
    variants: {
        width: {
            small: "page-sidebar-width-small",
            medium: "page-sidebar-width-medium",
            large: "page-sidebar-width-large",
        } satisfies Record<PageSidebarWidth, string>,
        position: {
            start: "page-sidebar-start",
            end: "page-sidebar-end",
        } satisfies Record<PageSidebarPosition, string>,
        padding: {
            none: "page-sidebar-padding-none",
            condensed: "page-sidebar-padding-condensed",
            normal: "page-sidebar-padding-normal",
            spacious: "page-sidebar-padding-spacious",
        } satisfies Record<PageSidebarSpacing, string>,
        gap: {
            none: "page-sidebar-gap-none",
            condensed: "page-sidebar-gap-condensed",
            normal: "page-sidebar-gap-normal",
            spacious: "page-sidebar-gap-spacious",
        } satisfies Record<PageSidebarSpacing, string>,
        sticky: {
            true: "page-sidebar-sticky",
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
        { hasBorder: true, position: "start", class: "page-sidebar-border-start" },
        { hasBorder: true, position: "end", class: "page-sidebar-border-end" },
    ],
});

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
