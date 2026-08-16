import type { StoryFn, Meta } from "@storybook/react-vite";
import { LayerCard } from ".";

const classes = {
    // A plain surface holds no padding of its own, so a story putting words straight onto one
    // gives it some
    surface: "p-[var(--stack-padding-normal)]",
    width: "w-[320px]",
};

export default {
    title: "Components/LayerCard",
    component: LayerCard,
} as Meta<typeof LayerCard>;

export const Default: StoryFn<typeof LayerCard> = () => (
    <LayerCard className={`${classes.surface} ${classes.width}`}>
        Get started with Base UI
    </LayerCard>
);

Default.parameters = {
    layout: "centered",
};

// The card settles its treatment from the children it was handed rather than from a prop, so what
// there is to play with is what it is given. Default is handed content; this one is handed layers
export const Playground: StoryFn<typeof LayerCard> = () => (
    <LayerCard className={classes.width}>
        <LayerCard.Secondary>Next steps</LayerCard.Secondary>
        <LayerCard.Primary>Get started with Base UI</LayerCard.Primary>
    </LayerCard>
);

Playground.parameters = {
    layout: "centered",
};
