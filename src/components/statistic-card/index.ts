import StatisticCardBase from "./StatisticCard";
import StatisticCardDescription from "./StatisticCardDescription";
import StatisticCardLabel from "./StatisticCardLabel";
import StatisticCardTrailingVisual from "./StatisticCardTrailingVisual";
import StatisticCardTrend from "./StatisticCardTrend";
import StatisticCardValue from "./StatisticCardValue";

export const StatisticCard = Object.assign(StatisticCardBase, {
    Label: StatisticCardLabel,
    Value: StatisticCardValue,
    Trend: StatisticCardTrend,
    Description: StatisticCardDescription,
    TrailingVisual: StatisticCardTrailingVisual,
});

export {
    StatisticCardLabel,
    StatisticCardValue,
    StatisticCardTrend,
    StatisticCardDescription,
    StatisticCardTrailingVisual,
};
export { StatisticCardContext } from "./StatisticCardContext";
export * from "./StatisticCard.types";
