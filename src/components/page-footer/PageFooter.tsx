import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import PageFooterNavigation from "./PageFooterNavigation";
import { getHiddenViewports, getViewportClassName } from "./visibility";
import type {
    PageFooterHidden,
    PageFooterNavigationProps,
    PageFooterProps,
    PageFooterVariant,
    PageFooterViewport,
} from "./PageFooter.types";

const classes = {
    root: "page-footer",
    text: "page-footer-text",
    variant: {
        normal: "page-footer-normal",
        condensed: "page-footer-condensed",
    } satisfies Record<PageFooterVariant, string>,
    narrowVariant: {
        normal: "page-footer-narrow-normal",
        condensed: "page-footer-narrow-condensed",
    } satisfies Record<PageFooterVariant, string>,
    regularVariant: {
        normal: "page-footer-regular-normal",
        condensed: "page-footer-regular-condensed",
    } satisfies Record<PageFooterVariant, string>,
    wideVariant: {
        normal: "page-footer-wide-normal",
        condensed: "page-footer-wide-condensed",
    } satisfies Record<PageFooterVariant, string>,
    border: "page-footer-border",
    borderWhen: {
        narrow: "page-footer-border-narrow",
        regular: "page-footer-border-regular",
        wide: "page-footer-border-wide",
    } satisfies Record<PageFooterViewport, string>,
};

type HoistedChildState = {
    hasNavigation: boolean;
    navigationHidden?: PageFooterHidden;
};

// The line the footer draws above itself follows from whether a navigation is showing, so it
// is read off the children. Only the children themselves and whatever a fragment holds are
// looked at: a part wrapped in anything else is not laid out by the grid either, so there
// would be nothing to read
const hoistChildState = (children: React.ReactNode): HoistedChildState => {
    const state: HoistedChildState = { hasNavigation: false };

    for (const child of React.Children.toArray(children)) {
        if (!React.isValidElement(child)) {
            continue;
        }

        if (child.type === React.Fragment) {
            const nested = hoistChildState(
                (child.props as { children?: React.ReactNode }).children,
            );

            if (nested.hasNavigation) {
                state.hasNavigation = true;
                state.navigationHidden = nested.navigationHidden;
            }

            continue;
        }

        if (child.type === PageFooterNavigation) {
            state.hasNavigation = true;
            state.navigationHidden = (child.props as PageFooterNavigationProps).hidden ?? false;
        }
    }

    return state;
};

// Which size to set the footer in, for a variant that is one thing at one viewport range and
// another at the next
const getVariantClassName = (variant: PageFooterProps["variant"]) => {
    if (typeof variant === "string") {
        return classes.variant[variant];
    }

    return [
        variant?.narrow && classes.narrowVariant[variant.narrow],
        variant?.regular && classes.regularVariant[variant.regular],
        variant?.wide && classes.wideVariant[variant.wide],
    ];
};

// The foot of a page: who it belongs to, where else the reader can go, and whatever has to be
// said and belongs nowhere else. The parts are laid out on a grid of their own, so they can
// be written in whatever order reads best rather than in the order they are drawn
function PageFooter<As extends React.ElementType = "footer">(
    props: PageFooterProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "footer",
        className,
        children,
        variant = "normal",
        hasBorder,
        ...rest
    } = props as PageFooterProps<"footer">;

    const { hasNavigation, navigationHidden } = hoistChildState(children);

    // A navigation of its own already sets the footer apart from the page, so the line is
    // only drawn at the viewport ranges where there is none showing
    const borderViewports = getHiddenViewports(hasNavigation ? navigationHidden : true);

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                classes.text,
                getVariantClassName(variant),
                hasBorder &&
                    getViewportClassName(borderViewports, classes.border, classes.borderWhen),
                className,
            )}
            data-component="PageFooter"
            data-has-border={hasBorder ? "" : undefined}
            data-has-navigation={hasNavigation ? "" : undefined}
            {...getResponsiveAttributes("size-variant", variant)}
            {...rest}
        >
            {children}
        </Component>
    );
}

PageFooter.displayName = "PageFooter";

export default fixedForwardRef(PageFooter);
