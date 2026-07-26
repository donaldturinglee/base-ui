import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOverflow } from "../../hooks/useOverflow";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ScrollableRegionProps } from "./ScrollableRegion.types";

const classes = {
    // `relative` goes with the overflow so that absolutely positioned descendants, such as
    // anything using `sr-only`, cannot escape and put scrollbars on the page
    root: "relative overflow-auto",
};

function ScrollableRegion<As extends React.ElementType = "div">(
    props: ScrollableRegionProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
        // One of the two labels is required, so the resolved props do not overlap with the
        // generic ones
    } = props as unknown as ScrollableRegionProps<"div">;

    const scrollableRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, scrollableRef);
    const hasOverflow = useOverflow(scrollableRef);

    // Only content that actually scrolls becomes a landmark, so a keyboard user is not sent
    // to a region they cannot move within
    const regionProps = hasOverflow
        ? {
              role: "region",
              tabIndex: 0,
              "aria-label": ariaLabel,
              "aria-labelledby": ariaLabelledBy,
          }
        : {};

    return (
        <Component
            ref={mergedRef}
            className={classNames(classes.root, className)}
            data-component="ScrollableRegion"
            {...regionProps}
            {...rest}
        />
    );
}

ScrollableRegion.displayName = "ScrollableRegion";

export default fixedForwardRef(ScrollableRegion);
