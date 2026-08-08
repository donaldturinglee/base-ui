import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    PageContainerProps,
    PageContainerSpacing,
    PageContainerWidth,
} from "./PageContainer.types";

const pageContainerVariants = cva("page-container", {
    variants: {
        width: {
            full: "page-container-width-full",
            medium: "page-container-width-medium",
            large: "page-container-width-large",
            xlarge: "page-container-width-xlarge",
        } satisfies Record<PageContainerWidth, string>,
        padding: {
            none: "page-container-padding-none",
            condensed: "page-container-padding-condensed",
            normal: "page-container-padding-normal",
            spacious: "page-container-padding-spacious",
        } satisfies Record<PageContainerSpacing, string>,
        gap: {
            none: "page-container-gap-none",
            condensed: "page-container-gap-condensed",
            normal: "page-container-gap-normal",
            spacious: "page-container-gap-spacious",
        } satisfies Record<PageContainerSpacing, string>,
        fullHeight: {
            true: "page-container-full-height",
            false: "",
        },
    },
});

// The outermost box of a page: what the header, the content and the footer all stand in. It
// holds the page to a width that can be read across and centres it in the viewport, so the
// regions inside it only have to say what they hold
function PageContainer<As extends React.ElementType = "div">(
    props: PageContainerProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        width = "xlarge",
        padding = "normal",
        gap = "normal",
        fullHeight,
        ...rest
    } = props as PageContainerProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(
                pageContainerVariants({ width, padding, gap, fullHeight }),
                className,
            )}
            data-component="PageContainer"
            data-width={width}
            data-padding={padding}
            data-gap={gap}
            data-full-height={fullHeight ? "" : undefined}
            {...rest}
        />
    );
}

PageContainer.displayName = "PageContainer";

export default fixedForwardRef(PageContainer);
