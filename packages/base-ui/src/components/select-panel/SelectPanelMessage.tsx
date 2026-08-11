import * as React from "react";
import { WarningRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { SelectPanelMessageProps, SelectPanelMessageVariant } from "./SelectPanel.types";

const classes = {
    full: "select-panel-message-full",
    fullIcon: "select-panel-message-full-icon",
    fullTitle: "select-panel-message-full-title",
    fullContent: "select-panel-message-full-content",
    inline: "select-panel-message-inline",
    inlineIcon: "select-panel-message-inline-icon",
    variant: {
        warning: "select-panel-message-warning",
        error: "select-panel-message-error",
        empty: "",
    } satisfies Record<SelectPanelMessageVariant, string>,
    inlineVariant: {
        warning: "select-panel-message-inline-warning",
        error: "select-panel-message-inline-error",
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
