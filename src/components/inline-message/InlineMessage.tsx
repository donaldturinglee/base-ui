import * as React from "react";
import {
    CheckmarkCircleRegular,
    ErrorCircleRegular,
    InfoRegular,
    WarningRegular,
} from "@gamecrafters/base-ui-icons";
import { isValidElementType } from "react-is";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    InlineMessageProps,
    InlineMessageSize,
    InlineMessageVariant,
    InlineMessageVisual,
} from "./InlineMessage.types";

const classes = {
    icon: "inline-message-icon",
};

const inlineMessageVariants = cva("inline-message", {
    variants: {
        size: {
            small: "inline-message-small",
            medium: "inline-message-medium",
        } satisfies Record<InlineMessageSize, string>,
        variant: {
            critical: "inline-message-critical",
            success: "inline-message-success",
            unavailable: "inline-message-unavailable",
            warning: "inline-message-warning",
        } satisfies Record<InlineMessageVariant, string>,
    },
});

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
            className={classNames(inlineMessageVariants({ size, variant }), className)}
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
