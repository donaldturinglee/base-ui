import * as React from "react";
import {
    CheckmarkCircleRegular,
    ErrorCircleRegular,
    InfoRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { isValidElementType } from "react-is";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    InlineMessageProps,
    InlineMessageSize,
    InlineMessageVariant,
    InlineMessageVisual,
} from "./InlineMessage.types";

const classes = {
    // The icon stands in a column of its own, so a message running onto a second line keeps
    // clear of it rather than wrapping underneath it
    root: "grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-[var(--base-size-8)] [font-size:var(--inline-message-font-size)] [line-height:var(--inline-message-line-height)] [color:var(--inline-message-foreground-color)] [--inline-message-foreground-color:var(--foreground-color-default)]",
    size: {
        small: "[--inline-message-font-size:var(--text-body-size-small)] [--inline-message-line-height:var(--text-body-line-height-small)] [--inline-message-icon-size:var(--base-size-12)]",
        medium: "[--inline-message-font-size:var(--text-body-size-medium)] [--inline-message-line-height:var(--text-body-line-height-medium)] [--inline-message-icon-size:var(--base-size-16)]",
    } satisfies Record<InlineMessageSize, string>,
    variant: {
        critical: "[--inline-message-foreground-color:var(--foreground-color-danger)]",
        success: "[--inline-message-foreground-color:var(--foreground-color-success)]",
        unavailable: "[--inline-message-foreground-color:var(--foreground-color-muted)]",
        warning: "[--inline-message-foreground-color:var(--foreground-color-attention)]",
    } satisfies Record<InlineMessageVariant, string>,
    // The icon is held to the height of a line of the text beside it, so it stands against the
    // first line rather than above or below it
    icon: "grid place-items-center min-h-[calc(var(--inline-message-line-height)_*_var(--inline-message-font-size))] [&>svg]:size-[var(--inline-message-icon-size)]",
};

const iconForVariant = {
    critical: ErrorCircleRegular,
    success: CheckmarkCircleRegular,
    unavailable: WarningRegular,
    warning: WarningRegular,
} satisfies Record<InlineMessageVariant, React.ElementType>;

// Anything that can stand as a component is called with no props of its own, which covers a
// plain function, a memo and a forwarded ref alike; everything else is already built
const renderVisual = (visual: InlineMessageVisual): React.ReactNode => {
    if (typeof visual === "string" || !isValidElementType(visual)) {
        return visual as React.ReactNode;
    }

    const Visual = visual;

    return <Visual />;
};

// A line of text saying how one thing stands, standing beside that thing rather than over the
// page as a banner does
function InlineMessage(
    props: InlineMessageProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, size = "medium", variant, leadingVisual, ...rest } = props;

    // A message that says nothing of how something stands is only telling the reader of it
    const Icon = variant ? iconForVariant[variant] : InfoRegular;

    return (
        <div
            ref={ref}
            className={classNames(
                classes.root,
                classes.size[size],
                variant && classes.variant[variant],
                className,
            )}
            data-component="InlineMessage"
            data-size={size}
            data-variant={variant}
            {...rest}
        >
            <span className={classes.icon} data-component="InlineMessage.Icon">
                {leadingVisual === undefined ? <Icon /> : renderVisual(leadingVisual)}
            </span>
            {/* Held together as one so that a message made of more than one thing still keeps
                to the column beside the icon */}
            <span data-component="InlineMessage.Content">{children}</span>
        </div>
    );
}

InlineMessage.displayName = "InlineMessage";

export default fixedForwardRef(InlineMessage);
