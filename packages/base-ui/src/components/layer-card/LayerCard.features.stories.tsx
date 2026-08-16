import type { StoryFn } from "@storybook/react-vite";
import { ArrowRightRegular, RocketRegular } from "@gamecrafters/base-ui-icons";
import { Stack } from "../stack";
import { Text } from "../text";
import { LayerCard } from ".";

const classes = {
    surface: "p-[var(--stack-padding-normal)]",
    width: "w-[320px]",
    heading: "font-[var(--base-text-weight-semibold)]",
    row: "flex items-center justify-between gap-[var(--stack-gap-condensed)]",
};

const steps = [
    { title: "Install the package", detail: "Add it to the app you are building" },
    { title: "Bring in the styles", detail: "One import, and the tokens are there" },
];

export default {
    title: "Components/LayerCard/Features",
    parameters: {
        layout: "centered",
    },
};

// Surface, where the card is handed content rather than layers and is one plain surface
export const Surface: StoryFn<typeof LayerCard> = () => (
    <LayerCard className={`${classes.surface} ${classes.width}`}>
        Handed content rather than layers, the card is a surface and nothing more.
    </LayerCard>
);

// With An Icon, which the layer behind stands beside its words
export const WithAnIcon: StoryFn<typeof LayerCard> = () => (
    <LayerCard className={classes.width}>
        <LayerCard.Secondary>
            <RocketRegular aria-hidden="true" />
            Getting started
        </LayerCard.Secondary>
        <LayerCard.Primary>
            <Text className={classes.heading}>Draw your first screen</Text>
            <Text>The components, the tokens and the themes are already there.</Text>
        </LayerCard.Primary>
    </LayerCard>
);

// As A Link, where the layer in front is the thing the card leads to. It carries neither colour
// nor underline of its own, so it still reads as a card rather than as a line of link text
export const AsALink: StoryFn<typeof LayerCard> = () => (
    <LayerCard className={classes.width}>
        <LayerCard.Secondary>Documentation</LayerCard.Secondary>
        <LayerCard.Primary as="a" href="#layer-card">
            <span className={classes.row}>
                <Text className={classes.heading}>Read the guide</Text>
                <ArrowRightRegular aria-hidden="true" />
            </span>
            <Text>Every component, written out with the props it takes.</Text>
        </LayerCard.Primary>
    </LayerCard>
);

// Several, standing one after another so the layers read as a set
export const Several: StoryFn<typeof LayerCard> = () => (
    <Stack gap="normal">
        {steps.map((step) => (
            <LayerCard key={step.title} className={classes.width}>
                <LayerCard.Secondary>Next steps</LayerCard.Secondary>
                <LayerCard.Primary>
                    <Text className={classes.heading}>{step.title}</Text>
                    <Text>{step.detail}</Text>
                </LayerCard.Primary>
            </LayerCard>
        ))}
    </Stack>
);
