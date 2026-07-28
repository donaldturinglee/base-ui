import * as React from "react";
import {
    CheckmarkCircleRegular,
    DismissRegular,
    ErrorCircleRegular,
    InfoRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { BannerContext } from "./BannerContext";
import BannerDescription from "./BannerDescription";
import BannerTitle from "./BannerTitle";
import type { BannerLayout, BannerProps, BannerVariant } from "./Banner.types";

const classes = {
    // The banner responds to the room it is given rather than to the viewport, so it is its
    // own query container. The three columns hold the icon, the content and the dismiss
    // button
    container: "@container/banner",
    root: "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] bg-[var(--banner-background-color)] border-[color:var(--banner-border-color)]",
    layout: {
        default: "p-[var(--base-size-8)]",
        compact: "p-[var(--base-size-4)]",
    } satisfies Record<BannerLayout, string>,
    // A flush banner spans whatever holds it, so the edges it meets are given up
    flush: "border-x-0 rounded-none",
    variant: {
        critical:
            "[--banner-background-color:var(--background-color-danger-muted)] [--banner-border-color:var(--border-color-danger-muted)] [--banner-icon-color:var(--foreground-color-danger)]",
        info: "[--banner-background-color:var(--background-color-accent-muted)] [--banner-border-color:var(--border-color-accent-muted)] [--banner-icon-color:var(--foreground-color-accent)]",
        success:
            "[--banner-background-color:var(--background-color-success-muted)] [--banner-border-color:var(--border-color-success-muted)] [--banner-icon-color:var(--foreground-color-success)]",
        upsell: "[--banner-background-color:var(--background-color-upsell-muted)] [--banner-border-color:var(--border-color-upsell-muted)] [--banner-icon-color:var(--foreground-color-upsell)]",
        warning:
            "[--banner-background-color:var(--background-color-attention-muted)] [--banner-border-color:var(--border-color-attention-muted)] [--banner-icon-color:var(--foreground-color-attention)]",
    } satisfies Record<BannerVariant, string>,
    // The icon stands as tall as the line box of the action buttons beside it
    icon: "grid place-items-center p-[var(--base-size-8)] [&_svg]:h-[var(--base-size-20)] [&_svg]:[color:var(--banner-icon-color)]",
    // With nothing but a description to sit beside, the icon comes down to the height of a
    // line of text
    iconTight: "[&_svg]:h-[var(--base-size-16)]",
    body: "flex flex-wrap items-start justify-between gap-[var(--base-size-4)] [font-size:var(--text-body-size-medium)] [line-height:var(--text-body-line-height-medium)]",
    // Where the actions drop below the content there is only ever one column
    bodyStacked: "flex-col flex-nowrap",
    // An inline banner keeps its actions beside the content until the viewport is narrow
    bodyInline: "flex-nowrap max-medium:flex-col",
    // Otherwise it is the banner's own width that decides
    bodyResponsive: "@max-[500px]/banner:flex-col @max-[500px]/banner:flex-nowrap",
    content: "grid gap-y-[var(--base-size-4)] col-start-1 my-[var(--base-size-8)] small:flex-1",
    // A banner with no visible title and nothing to act on is only a line of text, so it
    // sits closer to its edges
    contentTight: "my-[var(--base-size-6)]",
    actions: "flex items-center gap-x-[var(--base-size-12)] my-[var(--base-size-2)]",
    actionsInline: "flex-none",
    // Where the actions drop below the content they are given room beneath them
    actionsStacked: "mb-[var(--base-size-6)]",
    order: {
        shown: "flex",
        hidden: "hidden",
        inlineLeading: "hidden max-medium:flex",
        inlineTrailing: "flex max-medium:hidden",
        responsiveLeading: "hidden @max-[500px]/banner:flex",
        responsiveTrailing: "flex @max-[500px]/banner:hidden",
    },
    dismiss:
        "grid place-items-center p-[var(--base-size-8)] ms-[var(--base-size-4)] [&_svg]:[color:var(--banner-icon-color)]",
    dismissWithActions: "my-[var(--base-size-2)]",
    hidden: "sr-only",
};

const iconForVariant = {
    critical: ErrorCircleRegular,
    info: InfoRegular,
    success: CheckmarkCircleRegular,
    upsell: InfoRegular,
    warning: WarningRegular,
} satisfies Record<BannerVariant, React.ElementType>;

// Only the variants whose icon carries no meaning of its own leave room for another
const variantsWithCustomVisual: BannerVariant[] = ["info", "upsell"];

// Both orders are laid out and one of them is taken away, because which one reads correctly
// depends on the room the banner is given, which is not known while rendering. Only the one
// that is left standing is in the accessibility tree or the tab order
const BannerActions = ({
    primaryAction,
    secondaryAction,
    className,
    leadingClassName,
    trailingClassName,
}: {
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
    className?: string;
    leadingClassName: string;
    trailingClassName: string;
}) => (
    <div data-component="Banner.Actions">
        <div
            className={classNames(classes.actions, className, trailingClassName)}
            data-primary-action="trailing"
        >
            {secondaryAction}
            {primaryAction}
        </div>
        <div
            className={classNames(classes.actions, className, leadingClassName)}
            data-primary-action="leading"
        >
            {primaryAction}
            {secondaryAction}
        </div>
    </div>
);

function Banner(
    props: BannerProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        title,
        description,
        hideTitle,
        leadingVisual,
        variant = "info",
        layout = "default",
        actionsLayout = "default",
        flush = false,
        onDismiss,
        primaryAction,
        secondaryAction,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    const titleId = useId();

    const dismissible = Boolean(onDismiss);
    const hasActions = Boolean(primaryAction || secondaryAction);
    const isTight = Boolean(hideTitle) && !hasActions;

    const Icon = iconForVariant[variant];
    const visual =
        leadingVisual && variantsWithCustomVisual.includes(variant) ? leadingVisual : <Icon />;

    // A dismissible banner with a visible title always drops its actions below the content,
    // since the dismiss button takes the room they would otherwise sit in
    const isStacked =
        actionsLayout === "stacked" || (dismissible && !hideTitle && actionsLayout !== "inline");

    const order = isStacked
        ? { leading: classes.order.shown, trailing: classes.order.hidden }
        : actionsLayout === "inline"
          ? { leading: classes.order.inlineLeading, trailing: classes.order.inlineTrailing }
          : {
                leading: classes.order.responsiveLeading,
                trailing: classes.order.responsiveTrailing,
            };

    const heading = title ? <BannerTitle>{title}</BannerTitle> : null;

    return (
        <BannerContext.Provider value={{ titleId }}>
            <div className={classes.container}>
                <section
                    ref={ref}
                    // A label of its own wins over the title, and an element named by the
                    // caller wins over both. Only ever one of the two is set
                    aria-labelledby={ariaLabelledBy ?? (ariaLabel ? undefined : titleId)}
                    aria-label={ariaLabelledBy ? undefined : ariaLabel}
                    tabIndex={-1}
                    className={classNames(
                        classes.root,
                        classes.layout[layout],
                        classes.variant[variant],
                        flush && classes.flush,
                        className,
                    )}
                    data-component="Banner"
                    data-variant={variant}
                    data-layout={layout}
                    data-actions-layout={actionsLayout}
                    data-dismissible={dismissible || undefined}
                    data-has-actions={hasActions || undefined}
                    data-title-hidden={hideTitle || undefined}
                    data-flush={flush || undefined}
                    {...rest}
                >
                    <div
                        className={classNames(classes.icon, isTight && classes.iconTight)}
                        data-component="Banner.Icon"
                    >
                        {visual}
                    </div>

                    <div
                        className={classNames(
                            classes.body,
                            isStacked
                                ? classes.bodyStacked
                                : actionsLayout === "inline"
                                  ? classes.bodyInline
                                  : classes.bodyResponsive,
                        )}
                    >
                        <div
                            className={classNames(classes.content, isTight && classes.contentTight)}
                            data-component="Banner.Content"
                        >
                            {heading ? (
                                hideTitle ? (
                                    <span className={classes.hidden}>{heading}</span>
                                ) : (
                                    heading
                                )
                            ) : null}
                            {description ? (
                                <BannerDescription>{description}</BannerDescription>
                            ) : null}
                            {children}
                        </div>

                        {hasActions ? (
                            <BannerActions
                                primaryAction={primaryAction}
                                secondaryAction={secondaryAction}
                                className={classNames(
                                    actionsLayout === "inline" && classes.actionsInline,
                                    isStacked && classes.actionsStacked,
                                )}
                                leadingClassName={order.leading}
                                trailingClassName={order.trailing}
                            />
                        ) : null}
                    </div>

                    {dismissible ? (
                        <IconButton
                            icon={DismissRegular}
                            aria-label="Dismiss banner"
                            variant="invisible"
                            onClick={onDismiss}
                            className={classNames(
                                classes.dismiss,
                                hasActions && classes.dismissWithActions,
                            )}
                            data-component="Banner.Dismiss"
                        />
                    ) : null}
                </section>
            </div>
        </BannerContext.Provider>
    );
}

Banner.displayName = "Banner";

export default fixedForwardRef(Banner);
