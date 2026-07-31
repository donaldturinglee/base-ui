import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { PageContentProps, PageContentSpacing, PageContentWidth } from "./PageContent.types";

const classes = {
    // The runs of content stand one under the next. The minimum width keeps anything inside
    // that overflows from pushing the page wider than the room it was given
    root: "flex flex-col w-full min-w-0 mx-auto",
    width: {
        full: "max-w-full",
        medium: "max-w-[768px]",
        large: "max-w-[1012px]",
        xlarge: "max-w-[1280px]",
    } satisfies Record<PageContentWidth, string>,
    padding: {
        none: "p-0",
        condensed: "p-[var(--base-size-8)]",
        normal: "p-[var(--base-size-16)]",
        spacious: "p-[var(--base-size-24)]",
    } satisfies Record<PageContentSpacing, string>,
    gap: {
        none: "gap-0",
        condensed: "gap-[var(--stack-gap-condensed)]",
        normal: "gap-[var(--stack-gap-normal)]",
        spacious: "gap-[var(--stack-gap-spacious)]",
    } satisfies Record<PageContentSpacing, string>,
};

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
            className={classNames(
                classes.root,
                classes.width[width],
                classes.padding[padding],
                classes.gap[gap],
                className,
            )}
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
