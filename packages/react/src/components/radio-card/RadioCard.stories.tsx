import type { StoryFn, Meta } from "@storybook/react-vite";
import { RadioGroup } from "../radio-group";
import { RadioCard } from ".";
import type { RadioCardProps } from "./RadioCard.types";

const classes = {
    // Gives the cards a container to lay themselves out against
    container: "w-[28rem]",
};

const plans = [
    { value: "free", label: "Free", description: "For personal projects and trying things out" },
    { value: "team", label: "Team", description: "For a small group working on the same code" },
    { value: "enterprise", label: "Enterprise", description: "For an organisation of any size" },
];

export default {
    title: "Components/RadioCard",
    component: RadioCard,
} as Meta<typeof RadioCard>;

export const Default: StoryFn<typeof RadioCard> = () => (
    <div className={classes.container}>
        <RadioGroup name="plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCard key={plan.value} value={plan.value}>
                    <RadioCard.Label>{plan.label}</RadioCard.Label>
                    <RadioCard.Description>{plan.description}</RadioCard.Description>
                </RadioCard>
            ))}
        </RadioGroup>
    </div>
);

export const Playground: StoryFn<RadioCardProps> = (args) => (
    <div className={classes.container}>
        <RadioCard {...args}>
            <RadioCard.Label>Team</RadioCard.Label>
            <RadioCard.Description>
                For a small group working on the same code
            </RadioCard.Description>
        </RadioCard>
    </div>
);

Playground.args = {
    name: "plan",
    value: "team",
    disabled: false,
    required: false,
};

Playground.argTypes = {
    value: {
        control: {
            type: "text",
        },
        description: "Identifies the card on submission and as its group's selection",
    },
    name: {
        control: {
            type: "text",
        },
        description: "Ties the card to its siblings; taken from the group when it is left out",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the card being picked",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires a choice before the form can be submitted",
    },
    validationStatus: {
        control: {
            type: "radio",
        },
        options: [undefined, "error", "success"],
        description: "Draws the card's border in the colour of the answer",
    },
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
