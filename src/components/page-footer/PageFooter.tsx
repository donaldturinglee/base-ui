import * as React from "react";
import { classNames } from "../../utilities/classnames";
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
    // Three columns: the mark, whatever room is left over for the closing line, and the
    // actions at the end of the row
    root: "grid grid-cols-[auto_1fr_auto] [color:var(--foreground-color-muted)]",
    // The footer carries its own type, so that every part standing in it is set against the
    // same line
    text: "[font-size:var(--page-footer-text-size)] [font-weight:var(--base-text-weight-normal)] leading-[var(--page-footer-text-line-height)]",
    variant: {
        normal: "[--page-footer-text-size:var(--text-body-size-medium)] [--page-footer-text-line-height:var(--text-body-line-height-medium)]",
        condensed:
            "[--page-footer-text-size:var(--text-body-size-small)] [--page-footer-text-line-height:var(--text-body-line-height-small)]",
    } satisfies Record<PageFooterVariant, string>,
    narrowVariant: {
        normal: "max-medium:[--page-footer-text-size:var(--text-body-size-medium)] max-medium:[--page-footer-text-line-height:var(--text-body-line-height-medium)]",
        condensed:
            "max-medium:[--page-footer-text-size:var(--text-body-size-small)] max-medium:[--page-footer-text-line-height:var(--text-body-line-height-small)]",
    } satisfies Record<PageFooterVariant, string>,
    regularVariant: {
        normal: "medium:max-xxlarge:[--page-footer-text-size:var(--text-body-size-medium)] medium:max-xxlarge:[--page-footer-text-line-height:var(--text-body-line-height-medium)]",
        condensed:
            "medium:max-xxlarge:[--page-footer-text-size:var(--text-body-size-small)] medium:max-xxlarge:[--page-footer-text-line-height:var(--text-body-line-height-small)]",
    } satisfies Record<PageFooterVariant, string>,
    wideVariant: {
        normal: "xxlarge:[--page-footer-text-size:var(--text-body-size-medium)] xxlarge:[--page-footer-text-line-height:var(--text-body-line-height-medium)]",
        condensed:
            "xxlarge:[--page-footer-text-size:var(--text-body-size-small)] xxlarge:[--page-footer-text-line-height:var(--text-body-line-height-small)]",
    } satisfies Record<PageFooterVariant, string>,
    border: "border-solid border-t-[length:var(--border-width-thin)] border-t-[color:var(--border-color-default)] pt-[var(--base-size-8)]",
    borderWhen: {
        narrow: "max-medium:border-solid max-medium:border-t-[length:var(--border-width-thin)] max-medium:border-t-[color:var(--border-color-default)] max-medium:pt-[var(--base-size-8)]",
        regular:
            "medium:max-xxlarge:border-solid medium:max-xxlarge:border-t-[length:var(--border-width-thin)] medium:max-xxlarge:border-t-[color:var(--border-color-default)] medium:max-xxlarge:pt-[var(--base-size-8)]",
        wide: "xxlarge:border-solid xxlarge:border-t-[length:var(--border-width-thin)] xxlarge:border-t-[color:var(--border-color-default)] xxlarge:pt-[var(--base-size-8)]",
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
