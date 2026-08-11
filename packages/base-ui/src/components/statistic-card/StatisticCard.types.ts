import type * as React from "react";

// Which way the figure has moved, drawn as the arrow beside it
export type StatisticCardTrendDirection = "increase" | "decrease" | "neutral";

// What the move means, which is not always what way it points
export type StatisticCardTrendSentiment = "positive" | "negative" | "neutral";

export type StatisticCardProps = React.ComponentPropsWithoutRef<"div"> & {
    className?: string;
};

export type StatisticCardLabelProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type StatisticCardValueProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type StatisticCardTrendProps = React.ComponentPropsWithoutRef<"span"> & {
    direction: StatisticCardTrendDirection;
    // A rise is not always the good news: more errors is a worse week rather than a better one.
    // The move means what its direction means unless the caller says otherwise
    sentiment?: StatisticCardTrendSentiment;
    className?: string;
};

export type StatisticCardDescriptionProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

export type StatisticCardTrailingVisualProps = React.ComponentPropsWithoutRef<"span"> & {
    className?: string;
};

// The id the card is already named by, so that the line naming the figure takes it rather than
// naming one of its own
export type StatisticCardContextValue = {
    labelId?: string;
};
