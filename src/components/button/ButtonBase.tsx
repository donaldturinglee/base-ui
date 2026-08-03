import * as React from "react";
import { useId } from "../../hooks/useId";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CounterLabel } from "../counter-label";
import { Spinner } from "../spinner";
import type {
    ButtonAlignContent,
    ButtonBaseProps,
    ButtonSize,
    ButtonVariant,
    ButtonVisual,
} from "./Button.types";

// The shared renderer behind Button, IconButton and LinkButton. It is typed for the button it
// usually renders; a link button hands over its own attributes through a cast
export type ButtonBaseRenderProps = Omit<React.ComponentPropsWithoutRef<"button">, "type"> &
    ButtonBaseProps & {
        as?: React.ElementType;
        type?: string;
        href?: string;
        alignContent?: ButtonAlignContent;
        icon?: ButtonVisual;
        leadingVisual?: ButtonVisual;
        trailingVisual?: ButtonVisual;
        trailingAction?: ButtonVisual;
        count?: number | string;
    };

const classes = {
    base: "button",
    disabled: "button-disabled",
    block: "button-block",
    size: {
        small: "button-small",
        // A medium button takes the size the button is already drawn at
        medium: "",
        large: "button-large",
    } satisfies Record<ButtonSize, string>,
    variant: {
        default: {
            rest: "button-default",
            disabled: "button-default-disabled",
        },
        primary: {
            rest: "button-primary",
            disabled: "button-primary-disabled",
        },
        danger: {
            rest: "button-danger",
            disabled: "button-danger-disabled",
        },
        invisible: {
            rest: "button-invisible",
            disabled: "button-invisible-disabled",
        },
        link: {
            rest: "button-link",
            disabled: "button-link-disabled",
        },
    } satisfies Record<ButtonVariant, { rest: string; disabled: string }>,
    link: "button-link-shape",
    linkUnderlines: "button-link-underlines",
    inactive: "button-inactive",
    inactiveLink: "button-inactive-link",
    iconTone: {
        default: "button-icon-tone-default",
        primary: "",
        danger: "",
        invisible: "button-icon-tone-invisible",
        link: "",
    } satisfies Record<ButtonVariant, string>,
    labelWrapRoot: "button-label-wrap",
    labelWrapHeight: {
        small: "button-label-wrap-small",
        medium: "button-label-wrap-medium",
        large: "button-label-wrap-large",
    } satisfies Record<ButtonSize, string>,
    labelWrapContent: {
        small: "button-label-wrap-content-small",
        medium: "button-label-wrap-content-medium",
        large: "button-label-wrap-content-large",
    } satisfies Record<ButtonSize, string>,
    labelWrapLabel: "button-label-wrap-label",
    iconOnlyCounter: {
        small: "button-icon-only-counter-small",
        medium: "button-icon-only-counter-medium",
        large: "button-icon-only-counter-large",
    } satisfies Record<ButtonSize, string>,
    content: "button-content",
    contentGap: {
        small: "button-content-gap-small",
        medium: "button-content-gap-medium",
        large: "button-content-gap-large",
    } satisfies Record<ButtonSize, string>,
    align: {
        start: "justify-start",
        center: "justify-center",
    } satisfies Record<ButtonAlignContent, string>,
    label: "button-label",
    labelLineHeight: {
        small: "button-label-small",
        medium: "button-label-medium",
        large: "button-label-large",
    } satisfies Record<ButtonSize, string>,
    labelHidden: "invisible",
    visualBase: "button-visual",
    visual: {
        default: "button-visual-default",
        primary: "button-visual-primary",
        danger: "button-visual-danger",
        invisible: "button-visual-invisible",
        link: "button-visual-link",
    } satisfies Record<ButtonVariant, string>,
    visualMuted: "button-visual-muted",
    counter: {
        default: "button-counter-default",
        primary: "button-counter-primary",
        danger: "button-counter-danger",
        invisible: "button-counter-invisible",
        link: "",
    } satisfies Record<ButtonVariant, string>,
    counterMuted: "button-counter-muted",
    counterMutedDanger: "button-counter-muted-danger",
    leadingVisual: "button-leading-visual",
    trailingVisual: "button-trailing-visual",
    trailingAction: "button-trailing-action",
    loadingSpinner: "items-center justify-center",
    standaloneSpinner: "button-standalone-spinner",
    loadingWrapper: "inline-flex",
    loadingWrapperBlock: "block",
    srOnly: "sr-only",
};

const renderVisual = (
    visual: NonNullable<ButtonVisual>,
    name: string,
    loading: boolean,
    className: string,
) => {
    const Visual = visual as React.ElementType;

    return (
        <span
            data-component={name}
            className={classNames(classes.visualBase, loading && classes.loadingSpinner, className)}
        >
            {/* The button announces the wait through its own live region, so the spinner is
                left as decoration rather than adding a second one */}
            {loading ? (
                <Spinner size="small" srText={null} role="presentation" />
            ) : React.isValidElement(visual) ? (
                visual
            ) : (
                <Visual />
            )}
        </span>
    );
};

function ButtonBase(
    props: ButtonBaseRenderProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "button",
        className,
        children,
        icon,
        leadingVisual,
        trailingVisual,
        trailingAction,
        count,
        variant = "default",
        size = "medium",
        alignContent = "center",
        block = false,
        loading,
        loadingAnnouncement = "Loading",
        inactive,
        labelWrap,
        disabled,
        id,
        onClick,
        "aria-describedby": ariaDescribedBy,
        "aria-labelledby": ariaLabelledBy,
        "aria-disabled": ariaDisabled,
        ...rest
    } = props;

    const uuid = useId(id);
    const labelId = `${uuid}-label`;
    const announcementId = `${uuid}-loading-announcement`;

    const isLoading = Boolean(loading);
    // A loading button is marked unavailable so it cannot be pressed again, but it keeps the look
    // of a working button while it waits
    const isAriaDisabled = ariaDisabled === true || ariaDisabled === "true";
    const isDisabled = Boolean(disabled) || (isAriaDisabled && !isLoading);
    // Hover and press styling is only worth emitting while the button can still be used
    const interactive = !isDisabled && !inactive;

    const hasVisuals = Boolean(leadingVisual || trailingVisual || trailingAction);
    // With no visual to swap for a spinner, the spinner stands in for the label instead
    const standaloneSpinner = isLoading && !hasVisuals && count === undefined;
    const iconOnlyCounter = count !== undefined && Boolean(leadingVisual) && !children;

    const tone = inactive
        ? variant === "link"
            ? classes.inactiveLink
            : classes.inactive
        : classes.variant[variant][isDisabled ? "disabled" : "rest"];

    const visualTone = interactive ? classes.visual[variant] : classes.visualMuted;
    // Danger keeps a palette of its own once the button is out of use; the rest simply take the
    // button's colour and hold on to their background
    const counterTone = interactive
        ? classes.counter[variant]
        : variant === "danger"
          ? classes.counterMutedDanger
          : classNames(classes.counter[variant], classes.counterMuted);

    const button = (
        <Component
            ref={ref}
            className={classNames(
                classes.base,
                classes.size[size],
                variant === "link" && classes.link,
                variant === "link" && !hasVisuals && classes.linkUnderlines,
                tone,
                icon && interactive && classes.iconTone[variant],
                isDisabled && classes.disabled,
                block && classes.block,
                labelWrap && classes.labelWrapRoot,
                labelWrap && classes.labelWrapHeight[size],
                iconOnlyCounter && classes.iconOnlyCounter[size],
                className,
            )}
            data-component="Button"
            data-block={block ? "block" : undefined}
            data-inactive={inactive ? "" : undefined}
            data-loading={isLoading ? "true" : undefined}
            data-no-visuals={hasVisuals ? undefined : ""}
            data-size={size}
            data-variant={variant}
            data-label-wrap={labelWrap ? "true" : undefined}
            data-has-count={count !== undefined ? "true" : undefined}
            data-icon-only-counter={iconOnlyCounter ? "true" : undefined}
            disabled={disabled}
            id={id}
            aria-disabled={isLoading ? true : ariaDisabled}
            aria-describedby={
                isLoading
                    ? [announcementId, ariaDescribedBy].filter(Boolean).join(" ")
                    : ariaDescribedBy
            }
            // The spinner takes the label's place while loading, so the name is pinned to the
            // label that is still there behind it
            aria-labelledby={
                isLoading && children
                    ? [labelId, ariaLabelledBy].filter(Boolean).join(" ")
                    : ariaLabelledBy
            }
            onClick={isLoading ? undefined : onClick}
            {...rest}
        >
            {icon ? (
                renderVisual(icon, "icon", isLoading, "")
            ) : (
                <>
                    <span
                        data-component="buttonContent"
                        data-align={alignContent}
                        className={classNames(
                            classes.content,
                            // A sibling margin would knock the standalone spinner off centre
                            !standaloneSpinner && classes.contentGap[size],
                            classes.align[alignContent],
                            labelWrap && classes.labelWrapContent[size],
                        )}
                    >
                        {standaloneSpinner
                            ? renderVisual(
                                  Spinner,
                                  "loadingSpinner",
                                  true,
                                  classNames(visualTone, classes.standaloneSpinner),
                              )
                            : null}
                        {leadingVisual
                            ? renderVisual(
                                  leadingVisual,
                                  "leadingVisual",
                                  isLoading,
                                  classNames(visualTone, classes.leadingVisual),
                              )
                            : null}
                        {children ? (
                            <span
                                data-component="text"
                                id={isLoading ? labelId : undefined}
                                className={classNames(
                                    classes.label,
                                    classes.labelLineHeight[size],
                                    labelWrap && classes.labelWrapLabel,
                                    standaloneSpinner && classes.labelHidden,
                                )}
                            >
                                {children}
                            </span>
                        ) : null}
                        {count !== undefined && !trailingVisual
                            ? renderVisual(
                                  <CounterLabel
                                      className={counterTone}
                                      data-component="ButtonCounter"
                                  >
                                      {count}
                                  </CounterLabel>,
                                  "trailingVisual",
                                  isLoading && !leadingVisual,
                                  classes.trailingVisual,
                              )
                            : trailingVisual
                              ? renderVisual(
                                    trailingVisual,
                                    "trailingVisual",
                                    isLoading && !leadingVisual,
                                    classNames(visualTone, classes.trailingVisual),
                                )
                              : null}
                    </span>
                    {trailingAction
                        ? renderVisual(
                              trailingAction,
                              "trailingAction",
                              isLoading && !leadingVisual && !trailingVisual,
                              classNames(visualTone, classes.trailingAction),
                          )
                        : null}
                </>
            )}
        </Component>
    );

    if (loading === undefined) {
        return button;
    }

    // Wrapping for as long as the button can load stops it being torn down, and losing focus, as
    // it moves in and out of the loading state. The announcement lives beside it so that it is
    // already there to be read from when the wait begins
    return (
        <span
            className={block ? classes.loadingWrapperBlock : classes.loadingWrapper}
            data-loading-wrapper=""
        >
            {button}
            <span id={announcementId} role="status" className={classes.srOnly}>
                {isLoading ? loadingAnnouncement : ""}
            </span>
        </span>
    );
}

ButtonBase.displayName = "ButtonBase";

export default fixedForwardRef(ButtonBase);
