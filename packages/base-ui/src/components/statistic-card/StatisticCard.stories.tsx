import type { StoryFn, Meta } from "@storybook/react-vite";
import { StatisticCard } from ".";
import type { StatisticCardProps } from "./StatisticCard.types";

const classes = {
    // Gives the card a container to lay itself out against
    container: "w-[20rem]",
};

export default {
    title: "Components/StatisticCard",
    component: StatisticCard,
} as Meta<typeof StatisticCard>;

export const Default: StoryFn<typeof StatisticCard> = () => (
    <div className={classes.container}>
        <StatisticCard>
            <StatisticCard.Label>Sessions</StatisticCard.Label>
            <StatisticCard.Value>12.9K</StatisticCard.Value>
            <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
            <StatisticCard.Description>vs the four weeks before</StatisticCard.Description>
        </StatisticCard>
    </div>
);

export const Playground: StoryFn<StatisticCardProps> = (args) => (
    <div className={classes.container}>
        <StatisticCard {...args}>
            <StatisticCard.Label>Sessions</StatisticCard.Label>
            <StatisticCard.Value>12.9K</StatisticCard.Value>
            <StatisticCard.Trend direction="increase">8.2%</StatisticCard.Trend>
            <StatisticCard.Description>vs the four weeks before</StatisticCard.Description>
        </StatisticCard>
    </div>
);

Playground.argTypes = {
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
