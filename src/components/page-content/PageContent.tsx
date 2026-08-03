import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { PageContentProps, PageContentSpacing, PageContentWidth } from "./PageContent.types";

const pageContentVariants = cva("page-content", {
    variants: {
        width: {
            full: "page-content-width-full",
            medium: "page-content-width-medium",
            large: "page-content-width-large",
            xlarge: "page-content-width-xlarge",
        } satisfies Record<PageContentWidth, string>,
        padding: {
            none: "page-content-padding-none",
            condensed: "page-content-padding-condensed",
            normal: "page-content-padding-normal",
            spacious: "page-content-padding-spacious",
        } satisfies Record<PageContentSpacing, string>,
        gap: {
            none: "page-content-gap-none",
            condensed: "page-content-gap-condensed",
            normal: "page-content-gap-normal",
            spacious: "page-content-gap-spacious",
        } satisfies Record<PageContentSpacing, string>,
    },
});

// The body of a page: what the reader came for, standing between the header and the footer.
// It holds the content to a width that can be read across and centres it in whatever room
// the page leaves, so the runs inside it only have to say what they hold
function PageContent<As extends React.ElementType = "main">(
    props: PageContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "main",
        className,
        width = "full",
        padding = "none",
        gap = "normal",
        ...rest
    } = props as PageContentProps<"main">;

    return (
        <Component
            ref={ref}
            className={classNames(pageContentVariants({ width, padding, gap }), className)}
            data-component="PageContent"
            data-width={width}
            data-padding={padding}
            data-gap={gap}
            {...rest}
        />
    );
}

PageContent.displayName = "PageContent";

export default fixedForwardRef(PageContent);
