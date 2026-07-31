import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getHiddenAttribute, getHiddenClassName, getHiddenViewports } from "./visibility";
import type { PageContentSectionProps } from "./PageContent.types";

const classes = {
    // A run cannot be pushed wider than the page by anything inside it that overflows
    root: "min-w-0",
};

// A run of the content, which can be taken off the screen at whichever viewport ranges it
// names. Rendered as a `section` it is a region of its own where it is named, so what heads
// it is the caller's: only the caller knows what the run is about
function PageContentSection<As extends React.ElementType = "section">(
    props: PageContentSectionProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "section",
        className,
        hidden,
        ...rest
    } = props as PageContentSectionProps<"section">;

    const hiddenViewports = getHiddenViewports(hidden);

    return (
        <Component
            ref={ref}
            // The hiding comes last, so that it stands over whatever the run was laid out
            // with rather than the other way round
            className={classNames(classes.root, className, getHiddenClassName(hiddenViewports))}
            data-component="PageContent.Section"
            data-hidden={getHiddenAttribute(hiddenViewports)}
            {...rest}
        />
    );
}

PageContentSection.displayName = "PageContent.Section";

export default fixedForwardRef(PageContentSection);
