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
    // The group lets the visuals follow the button through hover and press
    base: "group/button flex items-center justify-between min-w-max h-[var(--control-medium-size)] px-[var(--control-medium-padding-inline-normal)] py-0 gap-[var(--base-size-8)] [font-family:inherit] [font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-medium)] [color:var(--button-default-foreground-color-rest)] text-center no-underline cursor-pointer select-none appearance-none bg-transparent border-solid border-[length:var(--border-width-thin)] border-[color:var(--button-default-border-color-rest)] rounded-[var(--border-radius-medium)] [transition-property:color,fill,background-color,border-color] [transition-duration:80ms] [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] active:[transition-property:none] [&[href]]:inline-flex",
    focus: "focus-visible:outline-solid focus-visible:outline-[length:var(--focus-outline-width)] focus-visible:outline-[color:var(--focus-outline-color)] focus-visible:outline-offset-[var(--focus-outline-offset)] forced-colors:focus:outline-solid forced-colors:focus:outline-[length:var(--border-width-thin)] forced-colors:focus:outline-[color:transparent]",
    disabled: "cursor-not-allowed [box-shadow:none]",
    block: "w-full",
    size: {
        small: "h-[var(--control-small-size)] px-[var(--control-small-padding-inline-condensed)] gap-[var(--control-small-gap)] [font-size:var(--text-body-size-small)]",
        medium: "",
        large: "h-[var(--control-large-size)] px-[var(--control-large-padding-inline-spacious)] gap-[var(--control-large-gap)]",
    } satisfies Record<ButtonSize, string>,
    variant: {
        default: {
            rest: "[color:var(--button-default-foreground-color-rest)] bg-[var(--button-default-background-color-rest)] [box-shadow:var(--button-default-shadow-resting)] aria-expanded:bg-[var(--button-default-background-color-active)] aria-expanded:border-[color:var(--button-default-border-color-active)] hover:bg-[var(--button-default-background-color-hover)] hover:border-[color:var(--button-default-border-color-hover)] active:bg-[var(--button-default-background-color-active)] active:border-[color:var(--button-default-border-color-active)]",
            disabled:
                "[color:var(--control-foreground-color-disabled)] bg-[var(--button-default-background-color-disabled)] border-[color:var(--button-default-border-color-disabled)]",
        },
        primary: {
            rest: "[color:var(--button-primary-foreground-color-rest)] bg-[var(--button-primary-background-color-rest)] border-[color:var(--button-primary-border-color-rest)] [box-shadow:var(--shadow-resting-small)] focus-visible:outline-foreground-on-emphasis aria-expanded:bg-[var(--button-primary-background-color-active)] aria-expanded:[box-shadow:var(--button-primary-shadow-selected)] hover:bg-[var(--button-primary-background-color-hover)] hover:border-[color:var(--button-primary-border-color-hover)] active:bg-[var(--button-primary-background-color-active)] active:[box-shadow:var(--button-primary-shadow-selected)]",
            disabled:
                "[color:var(--button-primary-foreground-color-disabled)] bg-[var(--button-primary-background-color-disabled)] border-[color:var(--button-primary-border-color-disabled)]",
        },
        danger: {
            rest: "[color:var(--button-danger-foreground-color-rest)] bg-[var(--button-danger-background-color-rest)] [box-shadow:var(--button-default-shadow-resting)] aria-expanded:[color:var(--button-danger-foreground-color-active)] aria-expanded:bg-[var(--button-danger-background-color-active)] aria-expanded:border-[color:var(--button-danger-border-color-active)] aria-expanded:[box-shadow:var(--button-danger-shadow-selected)] hover:[color:var(--button-danger-foreground-color-hover)] hover:bg-[var(--button-danger-background-color-hover)] hover:border-[color:var(--button-danger-border-color-hover)] hover:[box-shadow:var(--shadow-resting-small)] active:[color:var(--button-danger-foreground-color-active)] active:bg-[var(--button-danger-background-color-active)] active:border-[color:var(--button-danger-border-color-active)] active:[box-shadow:var(--button-danger-shadow-selected)]",
            disabled:
                "[color:var(--button-danger-foreground-color-disabled)] bg-[var(--button-danger-background-color-disabled)] border-[color:var(--button-default-border-color-disabled)]",
        },
        invisible: {
            rest: "[color:var(--button-default-foreground-color-rest)] border-[color:var(--button-invisible-border-color-rest)] [box-shadow:none] aria-expanded:bg-[var(--button-invisible-background-color-active)] hover:bg-[var(--button-invisible-background-color-hover)] hover:border-[color:var(--button-invisible-border-color-hover)] active:bg-[var(--button-invisible-background-color-active)]",
            disabled:
                "[color:var(--button-invisible-foreground-color-disabled)] bg-[var(--button-invisible-background-color-disabled)] border-[color:var(--button-invisible-border-color-disabled)]",
        },
        link: {
            rest: "text-foreground-accent hover:underline",
            disabled:
                "[color:var(--control-foreground-color-disabled)] bg-transparent border-transparent",
        },
    } satisfies Record<ButtonVariant, { rest: string; disabled: string }>,
    // The link variant drops the shape of a button and reads as text
    link: "inline-flex min-w-fit h-[unset] p-0 [font-size:inherit] text-left border-0 rounded-none focus-visible:outline-offset-[var(--base-size-2)]",
    linkUnderlines:
        "[[data-a11y-link-underlines='true']_&]:underline [[data-a11y-link-underlines='true']_&]:hover:no-underline",
    inactive:
        "[color:var(--button-inactive-foreground-color)] cursor-auto bg-[var(--button-inactive-background-color)] border-[color:var(--button-inactive-background-color)] [box-shadow:none]",
    inactiveLink:
        "[color:var(--button-inactive-foreground-color)] cursor-auto bg-transparent border-transparent [box-shadow:none]",
    // An icon-only button has no visual wrapper to colour, so the icon follows the button itself
    iconTone: {
        default: "text-foreground-muted",
        primary: "",
        danger: "",
        invisible: "[color:var(--button-invisible-icon-color-rest)]",
        link: "",
    } satisfies Record<ButtonVariant, string>,
    labelWrapRoot: "min-w-fit h-[unset]",
    labelWrapHeight: {
        small: "min-h-[var(--control-small-size)]",
        medium: "min-h-[var(--control-medium-size)]",
        large: "min-h-[var(--control-large-size)]",
    } satisfies Record<ButtonSize, string>,
    labelWrapContent: {
        small: "flex-[1_1_auto] self-stretch py-[calc(var(--control-small-padding-block)_-_var(--base-size-2))]",
        medium: "flex-[1_1_auto] self-stretch py-[calc(var(--control-medium-padding-block)_-_var(--base-size-2))]",
        large: "flex-[1_1_auto] self-stretch py-[calc(var(--control-large-padding-block)_-_var(--base-size-2))]",
    } satisfies Record<ButtonSize, string>,
    labelWrapLabel: "[word-break:break-word] whitespace-normal",
    // A count sitting beside an icon has no label to pad around
    iconOnlyCounter: {
        small: "px-[var(--control-xsmall-padding-inline-condensed)]",
        medium: "px-[var(--control-medium-padding-inline-condensed)]",
        large: "px-[var(--control-large-padding-inline-normal)]",
    } satisfies Record<ButtonSize, string>,
    // The content sits on its own grid so the label keeps its place as visuals come and go
    content:
        "flex-[1_0_auto] grid items-center content-center [grid-template-areas:'leadingVisual_text_trailingVisual'] [grid-template-columns:min-content_minmax(0,auto)_min-content]",
    contentGap: {
        small: "[&>*:not(:last-child)]:mr-[var(--control-small-gap)]",
        medium: "[&>*:not(:last-child)]:mr-[var(--base-size-8)]",
        large: "[&>*:not(:last-child)]:mr-[var(--control-large-gap)]",
    } satisfies Record<ButtonSize, string>,
    align: {
        start: "justify-start",
        center: "justify-center",
    } satisfies Record<ButtonAlignContent, string>,
    label: "[grid-area:text] whitespace-nowrap",
    labelLineHeight: {
        small: "leading-[var(--text-body-line-height-small)]",
        medium: "leading-[var(--text-body-line-height-medium)]",
        large: "leading-[var(--text-body-line-height-medium)]",
    } satisfies Record<ButtonSize, string>,
    labelHidden: "invisible",
    visualBase: "flex shrink-0 pointer-events-none",
    // Visuals take their colour from the variant, and fall back to the button's own colour once
    // it can no longer be used
    visual: {
        default: "text-foreground-muted",
        primary: "[color:var(--button-primary-foreground-color-rest)]",
        danger: "[color:var(--button-danger-icon-color-rest)] group-hover/button:[color:var(--button-danger-icon-color-hover)] group-active/button:[color:var(--button-danger-icon-color-hover)]",
        invisible: "[color:var(--button-invisible-icon-color-rest)]",
        link: "text-foreground-accent",
    } satisfies Record<ButtonVariant, string>,
    visualMuted: "[color:inherit]",
    counter: {
        default: "bg-[var(--button-counter-default-background-color-rest)]",
        primary:
            "[color:var(--button-primary-foreground-color-rest)] bg-[var(--button-counter-primary-background-color-rest)]",
        danger: "[color:var(--button-counter-danger-foreground-color-rest)] bg-[var(--button-counter-danger-background-color-rest)] group-hover/button:[color:var(--button-counter-danger-foreground-color-hover)] group-hover/button:bg-[var(--button-counter-danger-background-color-hover)] group-active/button:[color:var(--button-counter-danger-foreground-color-hover)] group-active/button:bg-[var(--button-counter-danger-background-color-hover)]",
        invisible: "bg-[var(--button-counter-invisible-background-color-rest)]",
        link: "",
    } satisfies Record<ButtonVariant, string>,
    counterMuted: "[color:inherit]",
    counterMutedDanger:
        "[color:var(--button-counter-danger-foreground-color-disabled)] bg-[var(--button-counter-danger-background-color-disabled)]",
    leadingVisual: "[grid-area:leadingVisual]",
    trailingVisual: "[grid-area:trailingVisual]",
    trailingAction: "-mr-[var(--base-size-4)]",
    loadingSpinner: "items-center justify-center",
    // With nothing to swap out, the spinner takes the label's place on the grid
    standaloneSpinner: "[grid-area:text] place-self-center",
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
                classes.focus,
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
