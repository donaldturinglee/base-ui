import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getHiddenAttribute, getHiddenClassName, getHiddenViewports } from "./visibility";
import type { PageContainerRegionProps } from "./PageContainer.types";

const pageContainerRegionVariants = cva("page-container-region", {
    variants: {
        grow: {
            true: "page-container-region-grow",
            false: "",
        },
    },
});

// A region of the page, which can be taken off the screen at whichever viewport ranges it
// names. It is drawn as a plain box, so whatever stands in it keeps whatever it already means:
// only the caller knows whether the region heads the page, carries it or foots it
function PageContainerRegion<As extends React.ElementType = "div">(
    props: PageContainerRegionProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        hidden,
        grow,
        ...rest
    } = props as PageContainerRegionProps<"div">;

    const hiddenViewports = getHiddenViewports(hidden);

    return (
        <Component
            ref={ref}
            // The hiding comes last, so that it stands over whatever the region was laid out
            // with rather than the other way round
            className={classNames(
                pageContainerRegionVariants({ grow }),
                className,
                getHiddenClassName(hiddenViewports),
            )}
            data-component="PageContainer.Region"
            data-grow={grow ? "" : undefined}
            data-hidden={getHiddenAttribute(hiddenViewports)}
            {...rest}
        />
    );
}

PageContainerRegion.displayName = "PageContainer.Region";

export default fixedForwardRef(PageContainerRegion);
