import * as React from "react";
import { ArrowDownRegular, ArrowUpRegular, SubtractRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    StatisticCardTrendDirection,
    StatisticCardTrendProps,
    StatisticCardTrendSentiment,
} from "./StatisticCard.types";

const classes = {
    hidden: "sr-only",
};

const icons = {
    increase: ArrowUpRegular,
    decrease: ArrowDownRegular,
    neutral: SubtractRegular,
} satisfies Record<StatisticCardTrendDirection, React.ElementType>;

// The arrow is a shape rather than a word, so the way it points is also said in words that only
// a screen reader hears
const directionLabels = {
    increase: "Up",
    decrease: "Down",
    neutral: "No change",
} satisfies Record<StatisticCardTrendDirection, string>;

// A move means what its direction means until the caller says otherwise, which they have to do
// wherever the figure is one that is better off falling
const sentiments = {
    increase: "positive",
    decrease: "negative",
    neutral: "neutral",
} satisfies Record<StatisticCardTrendDirection, StatisticCardTrendSentiment>;

const statisticCardTrendVariants = cva("statistic-card-trend", {
    variants: {
        sentiment: {
            positive: "statistic-card-trend-positive",
            negative: "statistic-card-trend-negative",
            neutral: "statistic-card-trend-neutral",
        } satisfies Record<StatisticCardTrendSentiment, string>,
    },
});

// How far the figure has moved and over what. It is drawn in the colour of what the move means
// rather than of the way it points, so a fall in the figures that are better off falling is
// still the good news
function StatisticCardTrend(
    props: StatisticCardTrendProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children, direction, sentiment: sentimentProp, ...rest } = props;

    const Icon = icons[direction];
    const sentiment = sentimentProp ?? sentiments[direction];

    return (
        <span
            ref={ref}
            className={classNames(statisticCardTrendVariants({ sentiment }), className)}
            data-component="StatisticCard.Trend"
            data-direction={direction}
            data-sentiment={sentiment}
            {...rest}
        >
            <Icon aria-hidden />
            <span className={classes.hidden}>{directionLabels[direction]}</span>
            {children}
        </span>
    );
}

StatisticCardTrend.displayName = "StatisticCard.Trend";

export default fixedForwardRef(StatisticCardTrend);
