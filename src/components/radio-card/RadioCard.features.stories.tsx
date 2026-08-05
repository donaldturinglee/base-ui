import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { BuildingRegular, PersonRegular, PeopleRegular } from "@gamecrafters/base-ui-icons";
import { Text } from "../text";
import { RadioGroup } from "../radio-group";
import { RadioCard } from ".";

const classes = {
    // Gives the cards a container to lay themselves out against
    container: "w-[28rem]",
    // Sets one run of cards apart from the next where several are shown together
    group: "flex flex-col gap-[var(--base-size-24)]",
    // Stands a run of cards on its own, where there is no group around them to space them
    stack: "flex flex-col gap-[var(--base-size-8)]",
    row: "grid grid-cols-3 gap-[var(--base-size-8)]",
};

const plans = [
    {
        value: "free",
        label: "Free",
        description: "For personal projects and trying things out",
        icon: PersonRegular,
    },
    {
        value: "team",
        label: "Team",
        description: "For a small group working on the same code",
        icon: PeopleRegular,
    },
    {
        value: "enterprise",
        label: "Enterprise",
        description: "For an organisation of any size",
        icon: BuildingRegular,
    },
];

export default {
    title: "Components/RadioCard/Features",
};

// With A Card Picked From The Start, which the radio keeps hold of itself
export const WithADefaultChoice: StoryFn<typeof RadioCard> = () => (
    <div className={classes.container}>
        <RadioGroup name="default-plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCard
                    key={plan.value}
                    value={plan.value}
                    defaultChecked={plan.value === "team"}
                >
                    <RadioCard.Label>{plan.label}</RadioCard.Label>
                    <RadioCard.Description>{plan.description}</RadioCard.Description>
                </RadioCard>
            ))}
        </RadioGroup>
    </div>
);

// With A Leading Visual, which leads the words rather than standing beside the radio
export const WithLeadingVisuals: StoryFn<typeof RadioCard> = () => (
    <div className={classes.container}>
        <RadioGroup name="visual-plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCard key={plan.value} value={plan.value}>
                    <RadioCard.LeadingVisual>
                        <plan.icon />
                    </RadioCard.LeadingVisual>
                    <RadioCard.Label>{plan.label}</RadioCard.Label>
                    <RadioCard.Description>{plan.description}</RadioCard.Description>
                </RadioCard>
            ))}
        </RadioGroup>
    </div>
);

// With The Name Alone, for a set of answers that need nothing said about them
export const WithoutDescriptions: StoryFn<typeof RadioCard> = () => (
    <div className={classes.container}>
        <RadioGroup name="short-plan">
            <RadioGroup.Label>Plan</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCard key={plan.value} value={plan.value}>
                    <RadioCard.Label>{plan.label}</RadioCard.Label>
                </RadioCard>
            ))}
        </RadioGroup>
    </div>
);

// Disabled, one card at a time and then the whole group at once
export const Disabled: StoryFn<typeof RadioCard> = () => (
    <div className={`${classes.container} ${classes.group}`}>
        <RadioGroup name="disabled-card-plan">
            <RadioGroup.Label>One card turned off</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCard
                    key={plan.value}
                    value={plan.value}
                    disabled={plan.value === "enterprise"}
                >
                    <RadioCard.Label>{plan.label}</RadioCard.Label>
                    <RadioCard.Description>{plan.description}</RadioCard.Description>
                </RadioCard>
            ))}
        </RadioGroup>

        <RadioGroup name="disabled-group-plan" disabled>
            <RadioGroup.Label>The whole group turned off</RadioGroup.Label>
            {plans.map((plan) => (
                <RadioCard
                    key={plan.value}
                    value={plan.value}
                    defaultChecked={plan.value === "team"}
                >
                    <RadioCard.Label>{plan.label}</RadioCard.Label>
                    <RadioCard.Description>{plan.description}</RadioCard.Description>
                </RadioCard>
            ))}
        </RadioGroup>
    </div>
);

// Validation Statuses, drawn on the border of the card
export const ValidationStatuses: StoryFn<typeof RadioCard> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <RadioCard name="error-plan" value="team" validationStatus="error">
            <RadioCard.Label>Team</RadioCard.Label>
            <RadioCard.Description>This plan is no longer available</RadioCard.Description>
        </RadioCard>
        <RadioCard name="success-plan" value="team" validationStatus="success" defaultChecked>
            <RadioCard.Label>Team</RadioCard.Label>
            <RadioCard.Description>This plan is ready to go</RadioCard.Description>
        </RadioCard>
    </div>
);

// Laid Out In A Row, where the group hands the cards to a container of the caller's own
export const InARow: StoryFn<typeof RadioCard> = () => (
    <div className={classes.row}>
        {plans.map((plan) => (
            <RadioCard key={plan.value} name="row-plan" value={plan.value}>
                <RadioCard.LeadingVisual>
                    <plan.icon />
                </RadioCard.LeadingVisual>
                <RadioCard.Label>{plan.label}</RadioCard.Label>
            </RadioCard>
        ))}
    </div>
);

// Controlled, where the caller keeps hold of the choice
export const Controlled: StoryFn<typeof RadioCard> = () => {
    const [selected, setSelected] = React.useState("team");

    return (
        <div className={classes.container}>
            <RadioGroup name="controlled-plan" onChange={setSelected}>
                <RadioGroup.Label>Plan</RadioGroup.Label>
                {plans.map((plan) => (
                    <RadioCard
                        key={plan.value}
                        value={plan.value}
                        checked={selected === plan.value}
                        onChange={() => setSelected(plan.value)}
                    >
                        <RadioCard.Label>{plan.label}</RadioCard.Label>
                        <RadioCard.Description>{plan.description}</RadioCard.Description>
                    </RadioCard>
                ))}
            </RadioGroup>
            <Text>Picked: {selected}</Text>
        </div>
    );
};
