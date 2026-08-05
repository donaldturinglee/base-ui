import type { StoryFn, Meta } from "@storybook/react-vite";
import { CheckboxGroup } from "../checkbox-group";
import { CheckboxCard } from ".";
import type { CheckboxCardProps } from "./CheckboxCard.types";

const classes = {
    // Gives the cards a container to lay themselves out against
    container: "w-[28rem]",
};

const channels = [
    { value: "email", label: "Email", description: "A message to the address on the account" },
    { value: "push", label: "Push", description: "A notification on every signed-in device" },
    { value: "sms", label: "SMS", description: "A text message to the number on the account" },
];

export default {
    title: "Components/CheckboxCard",
    component: CheckboxCard,
} as Meta<typeof CheckboxCard>;

export const Default: StoryFn<typeof CheckboxCard> = () => (
    <div className={classes.container}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCard key={channel.value} value={channel.value}>
                    <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                    <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
                </CheckboxCard>
            ))}
        </CheckboxGroup>
    </div>
);

export const Playground: StoryFn<CheckboxCardProps> = (args) => (
    <div className={classes.container}>
        <CheckboxCard {...args}>
            <CheckboxCard.Label>Email</CheckboxCard.Label>
            <CheckboxCard.Description>
                A message to the address on the account
            </CheckboxCard.Description>
        </CheckboxCard>
    </div>
);

Playground.args = {
    value: "email",
    indeterminate: false,
    disabled: false,
    required: false,
};

Playground.argTypes = {
    value: {
        control: {
            type: "text",
        },
        description: "Identifies the card on submission and in its group's selection",
    },
    indeterminate: {
        control: {
            type: "boolean",
        },
        description: "Draws the card as neither ticked nor cleared",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the card being ticked",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires the card to be ticked before the form can be submitted",
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
