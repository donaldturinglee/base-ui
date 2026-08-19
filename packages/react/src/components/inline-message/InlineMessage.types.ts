import type * as React from "react";

// What the message says of how something stands, which is what it is read in the colour of
export type InlineMessageVariant = "critical" | "success" | "unavailable" | "warning";

export type InlineMessageSize = "small" | "medium";

// A visual is given either as the component to render, or as something already built
export type InlineMessageVisual = React.ElementType | React.ReactNode;

export type InlineMessageProps = React.ComponentPropsWithoutRef<"div"> & {
    size?: InlineMessageSize;
    // Left out where the message only tells the reader something rather than saying how it
    // stands, which leaves it in the colour of the text around it
    variant?: InlineMessageVariant;
    // Stands in place of the icon the variant would otherwise carry
    leadingVisual?: InlineMessageVisual;
    className?: string;
};
