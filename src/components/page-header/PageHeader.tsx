import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { getResponsiveAttributes } from "../../utilities/responsive";
import PageHeaderNavigation from "./PageHeaderNavigation";
import PageHeaderTitleArea from "./PageHeaderTitleArea";
import { getHiddenViewports, getViewportClassName } from "./visibility";
import type {
    PageHeaderHidden,
    PageHeaderNavigationProps,
    PageHeaderProps,
    PageHeaderTitleAreaProps,
    PageHeaderTitleVariant,
    PageHeaderViewport,
} from "./PageHeader.types";

const classes = {
    // Five columns: the leading action, the breadcrumbs, the title, the trailing action, and
    // whatever room is left over for the actions at the end of the row
    root: "grid grid-cols-[auto_auto_auto_auto_1fr]",
    // The header carries the title's type, so that every part standing beside the title is
    // set against the same line
    title: "[font-size:var(--page-header-title-size)] [font-weight:var(--page-header-title-weight)] leading-[var(--page-header-title-line-height)]",
    titleVariant: {
        subtitle:
            "[--page-header-title-size:var(--text-title-size-medium)] [--page-header-title-weight:var(--base-text-weight-normal)] [--page-header-title-line-height:var(--text-title-line-height-medium)]",
        medium: "[--page-header-title-size:var(--text-title-size-medium)] [--page-header-title-weight:var(--base-text-weight-semibold)] [--page-header-title-line-height:var(--text-title-line-height-medium)]",
        large: "[--page-header-title-size:var(--text-title-size-large)] [--page-header-title-weight:var(--base-text-weight-normal)] [--page-header-title-line-height:var(--text-title-line-height-large)]",
    } satisfies Record<PageHeaderTitleVariant, string>,
    narrowTitleVariant: {
        subtitle:
            "max-medium:[--page-header-title-size:var(--text-title-size-medium)] max-medium:[--page-header-title-weight:var(--base-text-weight-normal)] max-medium:[--page-header-title-line-height:var(--text-title-line-height-medium)]",
        medium: "max-medium:[--page-header-title-size:var(--text-title-size-medium)] max-medium:[--page-header-title-weight:var(--base-text-weight-semibold)] max-medium:[--page-header-title-line-height:var(--text-title-line-height-medium)]",
        large: "max-medium:[--page-header-title-size:var(--text-title-size-large)] max-medium:[--page-header-title-weight:var(--base-text-weight-normal)] max-medium:[--page-header-title-line-height:var(--text-title-line-height-large)]",
    } satisfies Record<PageHeaderTitleVariant, string>,
    regularTitleVariant: {
        subtitle:
            "medium:max-xxlarge:[--page-header-title-size:var(--text-title-size-medium)] medium:max-xxlarge:[--page-header-title-weight:var(--base-text-weight-normal)] medium:max-xxlarge:[--page-header-title-line-height:var(--text-title-line-height-medium)]",
        medium: "medium:max-xxlarge:[--page-header-title-size:var(--text-title-size-medium)] medium:max-xxlarge:[--page-header-title-weight:var(--base-text-weight-semibold)] medium:max-xxlarge:[--page-header-title-line-height:var(--text-title-line-height-medium)]",
        large: "medium:max-xxlarge:[--page-header-title-size:var(--text-title-size-large)] medium:max-xxlarge:[--page-header-title-weight:var(--base-text-weight-normal)] medium:max-xxlarge:[--page-header-title-line-height:var(--text-title-line-height-large)]",
    } satisfies Record<PageHeaderTitleVariant, string>,
    wideTitleVariant: {
        subtitle:
            "xxlarge:[--page-header-title-size:var(--text-title-size-medium)] xxlarge:[--page-header-title-weight:var(--base-text-weight-normal)] xxlarge:[--page-header-title-line-height:var(--text-title-line-height-medium)]",
        medium: "xxlarge:[--page-header-title-size:var(--text-title-size-medium)] xxlarge:[--page-header-title-weight:var(--base-text-weight-semibold)] xxlarge:[--page-header-title-line-height:var(--text-title-line-height-medium)]",
        large: "xxlarge:[--page-header-title-size:var(--text-title-size-large)] xxlarge:[--page-header-title-weight:var(--base-text-weight-normal)] xxlarge:[--page-header-title-line-height:var(--text-title-line-height-large)]",
    } satisfies Record<PageHeaderTitleVariant, string>,
    border: "border-solid border-b-[length:var(--border-width-thin)] border-b-[color:var(--border-color-default)] pb-[var(--base-size-8)]",
    borderWhen: {
        narrow: "max-medium:border-solid max-medium:border-b-[length:var(--border-width-thin)] max-medium:border-b-[color:var(--border-color-default)] max-medium:pb-[var(--base-size-8)]",
        regular:
            "medium:max-xxlarge:border-solid medium:max-xxlarge:border-b-[length:var(--border-width-thin)] medium:max-xxlarge:border-b-[color:var(--border-color-default)] medium:max-xxlarge:pb-[var(--base-size-8)]",
        wide: "xxlarge:border-solid xxlarge:border-b-[length:var(--border-width-thin)] xxlarge:border-b-[color:var(--border-color-default)] xxlarge:pb-[var(--base-size-8)]",
    } satisfies Record<PageHeaderViewport, string>,
};

type HoistedChildState = {
    titleVariant?: PageHeaderTitleAreaProps["variant"];
    hasNavigation: boolean;
    navigationHidden?: PageHeaderHidden;
};

// The header is set against the size its title is drawn in, and the line it draws under
// itself follows from whether a navigation is showing, so both are read off the children.
// Only the children themselves and whatever a fragment holds are looked at: a part wrapped in
// anything else is not laid out by the grid either, so there would be nothing to read
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

            if (nested.titleVariant !== undefined) {
                state.titleVariant = nested.titleVariant;
            }

            if (nested.hasNavigation) {
                state.hasNavigation = true;
                state.navigationHidden = nested.navigationHidden;
            }

            continue;
        }

        if (child.type === PageHeaderTitleArea) {
            state.titleVariant = (child.props as PageHeaderTitleAreaProps).variant ?? "medium";
            continue;
        }

        if (child.type === PageHeaderNavigation) {
            state.hasNavigation = true;
            state.navigationHidden = (child.props as PageHeaderNavigationProps).hidden ?? false;
        }
    }

    return state;
};

// Which title type to set, for a variant that is one thing at one viewport range and another
// at the next
const getTitleVariantClassName = (variant: PageHeaderTitleAreaProps["variant"]) => {
    if (typeof variant === "string") {
        return classes.titleVariant[variant];
    }

    return [
        variant?.narrow && classes.narrowTitleVariant[variant.narrow],
        variant?.regular && classes.regularTitleVariant[variant.regular],
        variant?.wide && classes.wideTitleVariant[variant.wide],
    ];
};

// The head of a page: what it is about, what can be done to it, and where the reader can go
// from here. The parts are laid out on a grid of their own, so they can be written in
// whatever order reads best rather than in the order they are drawn
function PageHeader<As extends React.ElementType = "div">(
    props: PageHeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        children,
        hasBorder,
        ...rest
    } = props as PageHeaderProps<"div">;

    const { titleVariant, hasNavigation, navigationHidden } = hoistChildState(children);

    // A navigation of its own already sets the header apart from the page, so the line is
    // only drawn at the viewport ranges where there is none showing
    const borderViewports = getHiddenViewports(hasNavigation ? navigationHidden : true);

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                titleVariant && classes.title,
                titleVariant && getTitleVariantClassName(titleVariant),
                hasBorder &&
                    getViewportClassName(borderViewports, classes.border, classes.borderWhen),
                className,
            )}
            data-component="PageHeader"
            data-has-border={hasBorder ? "" : undefined}
            data-has-navigation={hasNavigation ? "" : undefined}
            {...getResponsiveAttributes("title-size-variant", titleVariant)}
            {...rest}
        >
            {children}
        </Component>
    );
}

PageHeader.displayName = "PageHeader";

export default fixedForwardRef(PageHeader);
