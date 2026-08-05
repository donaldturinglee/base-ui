import type { StoryFn } from "@storybook/react-vite";
import { MoneyRegular, PeopleRegular, WarningRegular } from "@gamecrafters/base-ui-icons";
import { StatisticCard } from ".";

const classes = {
    // Gives the cards a container to lay themselves out against
    container: "w-[20rem]",
    // Stands a run of cards one above the other
    stack: "flex flex-col gap-[var(--base-size-8)]",
    // A run of headline figures shown side by side, which is what a set of them wants rather
    // than a chart with one bar to each
    row: "grid grid-cols-3 gap-[var(--base-size-16)]",
};

export default {
    title: "Components/StatisticCard/Features",
};

// With A Trailing Visual, which closes the row rather than leading it, so a run of cards carries
// its marks down one edge
export const WithATrailingVisual: StoryFn<typeof StatisticCard> = () => (
    <div className={classes.container}>
        <StatisticCard>
            <StatisticCard.Label>Sessions</StatisticCard.Label>
            <StatisticCard.Value>12.9K</StatisticCard.Value>
            <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
            <StatisticCard.Description>vs the four weeks before</StatisticCard.Description>
            <StatisticCard.TrailingVisual>
                <PeopleRegular />
            </StatisticCard.TrailingVisual>
        </StatisticCard>
    </div>
);

// Which Way The Figure Has Moved, drawn with an arrow as well as a colour so that the move is
// still there to be read where the colour is not
export const TrendDirections: StoryFn<typeof StatisticCard> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <StatisticCard>
            <StatisticCard.Label>Sessions</StatisticCard.Label>
            <StatisticCard.Value>12.9K</StatisticCard.Value>
            <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
        </StatisticCard>
        <StatisticCard>
            <StatisticCard.Label>Signups</StatisticCard.Label>
            <StatisticCard.Value>482</StatisticCard.Value>
            <StatisticCard.Trend direction="decrease">3.1%</StatisticCard.Trend>
        </StatisticCard>
        <StatisticCard>
            <StatisticCard.Label>Open issues</StatisticCard.Label>
            <StatisticCard.Value>76</StatisticCard.Value>
            <StatisticCard.Trend direction="neutral">0%</StatisticCard.Trend>
        </StatisticCard>
    </div>
);

// Where A Rise Is The Bad News, which is any figure that is better off falling. The arrow still
// points the way the figure went; only what the move is taken to mean is turned around
export const WhereARiseIsBadNews: StoryFn<typeof StatisticCard> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <StatisticCard>
            <StatisticCard.Label>Failed builds</StatisticCard.Label>
            <StatisticCard.Value>34</StatisticCard.Value>
            <StatisticCard.Trend direction="increase" sentiment="negative">
                12.5%
            </StatisticCard.Trend>
            <StatisticCard.Description>vs the week before</StatisticCard.Description>
            <StatisticCard.TrailingVisual>
                <WarningRegular />
            </StatisticCard.TrailingVisual>
        </StatisticCard>
        <StatisticCard>
            <StatisticCard.Label>Median build time</StatisticCard.Label>
            <StatisticCard.Value>4m 12s</StatisticCard.Value>
            <StatisticCard.Trend direction="decrease" sentiment="positive">
                18.0%
            </StatisticCard.Trend>
            <StatisticCard.Description>vs the week before</StatisticCard.Description>
            <StatisticCard.TrailingVisual>
                <WarningRegular />
            </StatisticCard.TrailingVisual>
        </StatisticCard>
    </div>
);

// The Figure On Its Own, where there is nothing yet to compare it with
export const WithoutATrend: StoryFn<typeof StatisticCard> = () => (
    <div className={classes.container}>
        <StatisticCard>
            <StatisticCard.Label>Repositories</StatisticCard.Label>
            <StatisticCard.Value>128</StatisticCard.Value>
            <StatisticCard.Description>Counted this morning</StatisticCard.Description>
        </StatisticCard>
    </div>
);

// A Row Of Headline Figures, which is how a set of them is shown
export const InARow: StoryFn<typeof StatisticCard> = () => (
    <div className={classes.row}>
        <StatisticCard>
            <StatisticCard.Label>Sessions</StatisticCard.Label>
            <StatisticCard.Value>12.9K</StatisticCard.Value>
            <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
            <StatisticCard.TrailingVisual>
                <PeopleRegular />
            </StatisticCard.TrailingVisual>
        </StatisticCard>
        <StatisticCard>
            <StatisticCard.Label>Revenue</StatisticCard.Label>
            <StatisticCard.Value>$4.2M</StatisticCard.Value>
            <StatisticCard.Trend direction="increase">2.4%</StatisticCard.Trend>
            <StatisticCard.TrailingVisual>
                <MoneyRegular />
            </StatisticCard.TrailingVisual>
        </StatisticCard>
        <StatisticCard>
            <StatisticCard.Label>Failed builds</StatisticCard.Label>
            <StatisticCard.Value>34</StatisticCard.Value>
            <StatisticCard.Trend direction="increase" sentiment="negative">
                12.5%
            </StatisticCard.Trend>
            <StatisticCard.TrailingVisual>
                <WarningRegular />
            </StatisticCard.TrailingVisual>
        </StatisticCard>
    </div>
);
