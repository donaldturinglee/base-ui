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
    // Which way round the row is drawn where it has the room to stand beside the content, named
    // for what settles that: the window for a row laid out inline, and the banner's own width for
    // one following the room it was given. A stacked row is read down the banner rather than
    // across the end of a line, so it is never turned and names neither
    reversed: {
        inline: "banner-actions-reversed-inline",
        responsive: "banner-actions-reversed-responsive",
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

// An action is held in a wrapper keyed for the part it is rather than being set down as it
// arrived. The two stand together as a pair, which React reads as a list, and an action handed
// over as a prop was written by the caller as one element rather than as one of several, so it
// carries nothing to tell it from the other. The wrapper draws nothing of its own, so the buttons
// are still the row's own children
const keyed = (name: string, action: React.ReactNode) => (
    <React.Fragment key={name}>{action}</React.Fragment>
);

// The row is written the once, primary first, which is the order it is read out and tabbed
// through however much room the banner turns out to have. Where there is room for it to stand
// beside the content the drawing is turned round, so the primary action falls at the end of the
// line, which is where the last button on a line is looked for. Only the drawing turns: what a
// reader is told and what a key moves through is the order it was written in
const BannerActions = ({
    primaryAction,
    secondaryAction,
    className,
}: {
    primaryAction?: React.ReactNode;
    secondaryAction?: React.ReactNode;
    className?: string;
}) => (
    <div className={classNames(classes.actions, className)} data-component="Banner.Actions">
        {keyed("primary", primaryAction)}
        {keyed("secondary", secondaryAction)}
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

    // A stacked row stands below the content whatever the room, so it is left the way round it
    // was written. The rest are turned where there is room to stand beside it, which the window
    // settles for an inline row and the banner's own width for one following the room it has
    const reversed = isStacked
        ? undefined
        : actionsLayout === "inline"
          ? classes.reversed.inline
          : classes.reversed.responsive;

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
                                    reversed,
                                )}
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
