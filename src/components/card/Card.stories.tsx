import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { PeopleRegular, RocketRegular } from "@gamecrafters/base-ui-icons";
import { Card } from ".";
import type { CardBorderRadius, CardLayout, CardPadding } from "./Card.types";

const classes = {
    // Cards fill their container, so the stories give them one to fill
    container: "max-w-[25rem]",
    icon: "size-[var(--base-size-16)] shrink-0",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Card",
    component: Card,
    decorators: [withContainer],
} as Meta<typeof Card>;

export const Default: StoryFn<typeof Card> = () => (
    <Card>
        <Card.Icon icon={RocketRegular} />
        <Card.Heading>Card Heading</Card.Heading>
        <Card.Description>
            This is a description of the card providing supplemental information.
        </Card.Description>
        <Card.Metadata>
            <PeopleRegular className={classes.icon} />3 contributors
        </Card.Metadata>
    </Card>
);

type PlaygroundArgs = {
    showIcon?: boolean;
    showMetadata?: boolean;
    layout?: CardLayout;
    padding?: CardPadding;
    borderRadius?: CardBorderRadius;
};

export const Playground: StoryFn<PlaygroundArgs> = ({
    showIcon,
    showMetadata,
    layout,
    padding,
    borderRadius,
}) => (
    <Card layout={layout} padding={padding} borderRadius={borderRadius}>
        {showIcon ? <Card.Icon icon={RocketRegular} /> : null}
        <Card.Heading>Playground Card</Card.Heading>
        <Card.Description>Experiment with the card and its subcomponents.</Card.Description>
        {showMetadata ? <Card.Metadata>Just now</Card.Metadata> : null}
    </Card>
);

Playground.args = {
    showIcon: true,
    showMetadata: true,
    layout: "default",
    padding: "normal",
    borderRadius: "large",
};

Playground.argTypes = {
    showIcon: {
        control: {
            type: "boolean",
        },
        description: "Shows or hides the Card.Icon subcomponent",
    },
    showMetadata: {
        control: {
            type: "boolean",
        },
        description: "Shows or hides the Card.Metadata subcomponent",
    },
    layout: {
        control: {
            type: "radio",
        },
        options: ["default", "compact"],
        description: "Stacks the parts of the card, or lays them out in a row",
    },
    padding: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal"],
        description: "Internal padding of the card",
    },
    borderRadius: {
        control: {
            type: "radio",
        },
        options: ["medium", "large"],
        description: "Corner radius of the card",
    },
};
