import * as React from "react";
import {
    CheckmarkCircleRegular,
    DismissRegular,
    ErrorCircleRegular,
    InfoRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { useId } from "../../hooks/useId";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { IconButton } from "../icon-button";
import { BannerContext } from "./BannerContext";
import BannerDescription from "./BannerDescription";
import BannerTitle from "./BannerTitle";
import type { BannerLayout, BannerProps, BannerVariant } from "./Banner.types";

const classes = {
    container: "banner-container",
    actions: "banner-actions",
    actionsInline: "banner-actions-inline",
    actionsStacked: "banner-actions-stacked",
    order: {
        shown: "banner-actions-shown",
        hidden: "banner-actions-hidden",
        inlineLeading: "banner-actions-inline-leading",
        inlineTrailing: "banner-actions-inline-trailing",
        responsiveLeading: "banner-actions-responsive-leading",
        responsiveTrailing: "banner-actions-responsive-trailing",
    },
    hidden: "sr-only",
};

const bannerVariants = cva("banner", {
    variants: {
        layout: {
            default: "banner-default",
            compact: "banner-compact",
        } satisfies Record<BannerLayout, string>,
        variant: {
            critical: "banner-critical",
            info: "banner-info",
            success: "banner-success",
            upsell: "banner-upsell",
            warning: "banner-warning",
        } satisfies Record<BannerVariant, string>,
        flush: {
            true: "banner-flush",
            false: "",
        },
    },
});

const bannerIconVariants = cva("banner-icon", {
    variants: {
        tight: {
            true: "banner-icon-tight",
            false: "",
        },
    },
});

const bannerBodyVariants = cva("banner-body", {
    variants: {
        actions: {
            stacked: "banner-body-stacked",
            inline: "banner-body-inline",
            responsive: "banner-body-responsive",
        },
    },
});

const bannerContentVariants = cva("banner-content", {
    variants: {
        tight: {
            true: "banner-content-tight",
            false: "",
        },
    },
});

const bannerDismissVariants = cva("banner-dismiss", {
    variants: {
        withActions: {
            true: "banner-dismiss-with-actions",
            false: "",
        },
    },
});

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
                    className={classNames(bannerVariants({ layout, variant, flush }), className)}
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
                        className={classNames(bannerIconVariants({ tight: isTight }))}
                        data-component="Banner.Icon"
                    >
                        {visual}
                    </div>

                    <div
                        className={classNames(
                            bannerBodyVariants({
                                actions: isStacked
                                    ? "stacked"
                                    : actionsLayout === "inline"
                                      ? "inline"
                                      : "responsive",
                            }),
                        )}
                    >
                        <div
                            className={classNames(bannerContentVariants({ tight: isTight }))}
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
                                bannerDismissVariants({ withActions: hasActions }),
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
