import * as React from "react";
import { WarningRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SelectPanelMessageProps, SelectPanelMessageVariant } from "./SelectPanel.types";

const classes = {
    // A full message stands in place of the list, so it is given the room the list would
    // have had rather than letting the panel close up around a line of text
    full: "flex grow flex-col items-center justify-center h-full min-h-[var(--select-panel-body-min-height)] px-[var(--base-size-24)] gap-[var(--base-size-4)] text-center [&_a]:[color:inherit] [&_a]:underline",
    fullIcon: "mb-[var(--base-size-8)] size-[var(--base-size-24)]",
    fullTitle:
        "[font-size:var(--text-body-size-medium)] [font-weight:var(--base-text-weight-medium)]",
    fullContent:
        "flex flex-col items-center gap-[var(--stack-gap-condensed)] [font-size:var(--text-body-size-medium)] text-foreground-muted",
    // An inline message stands above the list rather than in place of it
    inline: "flex gap-[var(--stack-gap-condensed)] px-[var(--base-size-16)] py-[var(--base-size-12)] [font-size:var(--text-body-size-small)] border-solid border-b-[length:var(--border-width-thin)] [&_a]:[color:inherit] [&_a]:underline",
    inlineIcon: "shrink-0 mt-[var(--base-size-2)] size-[var(--base-size-16)]",
    variant: {
        warning: "text-foreground-attention",
        error: "text-foreground-danger",
        empty: "",
    } satisfies Record<SelectPanelMessageVariant, string>,
    inlineVariant: {
        warning: "bg-background-attention-muted border-b-border-attention-muted",
        error: "bg-background-danger-muted border-b-border-danger-muted",
        empty: "",
    } satisfies Record<SelectPanelMessageVariant, string>,
};

// Says something about the list rather than showing it: that it came back empty, or that
// what is showing is not the whole of it
function SelectPanelMessage(
    props: SelectPanelMessageProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, variant, size, title, ...rest } = props;

    // An empty list is only ever reported in full, since there is no list left for a line to
    // stand above
    const messageSize = size ?? (variant === "empty" ? "full" : "inline");
    // An empty list is what was asked for rather than something going wrong, so it is not
    // announced
    const isLive = variant !== "empty";

    const liveProps = isLive ? { role: "status", "aria-live": "polite" as const } : undefined;

    if (messageSize === "full") {
        return (
            <div
                ref={ref}
                className={classNames(classes.full, className)}
                data-component="SelectPanel.Message"
                data-variant={variant}
                data-size="full"
                {...liveProps}
                {...rest}
            >
                {variant === "empty" ? null : (
                    <WarningRegular
                        className={classNames(classes.fullIcon, classes.variant[variant])}
                        aria-hidden="true"
                    />
                )}
                <span className={classes.fullTitle}>{title}</span>
                <span className={classes.fullContent}>{children}</span>
            </div>
        );
    }

    return (
        <div
            ref={ref}
            className={classNames(
                classes.inline,
                classes.variant[variant],
                classes.inlineVariant[variant],
                className,
            )}
            data-component="SelectPanel.Message"
            data-variant={variant}
            data-size="inline"
            {...liveProps}
            {...rest}
        >
            <WarningRegular className={classes.inlineIcon} aria-hidden="true" />
            <div>{children}</div>
        </div>
    );
}

SelectPanelMessage.displayName = "SelectPanel.Message";

export default fixedForwardRef(SelectPanelMessage);
