import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { AlertRegular, MailRegular, PhoneRegular } from "@gamecrafters/base-ui-icons";
import { Text } from "../text";
import { CheckboxGroup } from "../checkbox-group";
import { CheckboxCard } from ".";

const classes = {
    // Gives the cards a container to lay themselves out against
    container: "w-[28rem]",
    // Sets one run of cards apart from the next where several are shown together
    group: "flex flex-col gap-[var(--base-size-24)]",
    // Stands a run of cards on its own, where there is no group around them to space them
    stack: "flex flex-col gap-[var(--base-size-8)]",
    row: "grid grid-cols-3 gap-[var(--base-size-8)]",
};

const channels = [
    {
        value: "email",
        label: "Email",
        description: "A message to the address on the account",
        icon: MailRegular,
    },
    {
        value: "push",
        label: "Push",
        description: "A notification on every signed-in device",
        icon: AlertRegular,
    },
    {
        value: "sms",
        label: "SMS",
        description: "A text message to the number on the account",
        icon: PhoneRegular,
    },
];

export default {
    title: "Components/CheckboxCard/Features",
};

// With Cards Ticked From The Start, which the checkboxes keep hold of themselves
export const WithDefaultChoices: StoryFn<typeof CheckboxCard> = () => (
    <div className={classes.container}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCard
                    key={channel.value}
                    value={channel.value}
                    defaultChecked={channel.value !== "sms"}
                >
                    <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                    <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
                </CheckboxCard>
            ))}
        </CheckboxGroup>
    </div>
);

// With A Leading Visual, which leads the words rather than standing beside the checkbox
export const WithLeadingVisuals: StoryFn<typeof CheckboxCard> = () => (
    <div className={classes.container}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCard key={channel.value} value={channel.value}>
                    <CheckboxCard.LeadingVisual>
                        <channel.icon />
                    </CheckboxCard.LeadingVisual>
                    <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                    <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
                </CheckboxCard>
            ))}
        </CheckboxGroup>
    </div>
);

// With The Name Alone, for a set of answers that need nothing said about them
export const WithoutDescriptions: StoryFn<typeof CheckboxCard> = () => (
    <div className={classes.container}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCard key={channel.value} value={channel.value}>
                    <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                </CheckboxCard>
            ))}
        </CheckboxGroup>
    </div>
);

// Part Ticked, where one card stands for a set of answers only some of which have been given
export const Indeterminate: StoryFn<typeof CheckboxCard> = () => {
    const [selected, setSelected] = React.useState(["email"]);

    const all = channels.map((channel) => channel.value);
    const isEverything = selected.length === all.length;

    return (
        <div className={`${classes.container} ${classes.stack}`}>
            <CheckboxCard
                value="all"
                checked={isEverything}
                // The card is neither ticked nor cleared while only some of the cards under it
                // have been ticked, and ticking it answers for all of them at once
                indeterminate={selected.length > 0 && !isEverything}
                onChange={() => setSelected(isEverything ? [] : all)}
            >
                <CheckboxCard.Label>Everything</CheckboxCard.Label>
                <CheckboxCard.Description>Every way of being notified</CheckboxCard.Description>
            </CheckboxCard>

            {channels.map((channel) => (
                <CheckboxCard
                    key={channel.value}
                    value={channel.value}
                    checked={selected.includes(channel.value)}
                    onChange={(event) =>
                        setSelected((current) =>
                            event.currentTarget.checked
                                ? [...current, channel.value]
                                : current.filter((value) => value !== channel.value),
                        )
                    }
                >
                    <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                    <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
                </CheckboxCard>
            ))}
        </div>
    );
};

// Disabled, one card at a time and then the whole group at once
export const Disabled: StoryFn<typeof CheckboxCard> = () => (
    <div className={`${classes.container} ${classes.group}`}>
        <CheckboxGroup>
            <CheckboxGroup.Label>One card turned off</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCard
                    key={channel.value}
                    value={channel.value}
                    disabled={channel.value === "sms"}
                >
                    <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                    <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
                </CheckboxCard>
            ))}
        </CheckboxGroup>

        <CheckboxGroup disabled>
            <CheckboxGroup.Label>The whole group turned off</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCard
                    key={channel.value}
                    value={channel.value}
                    defaultChecked={channel.value === "email"}
                >
                    <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                    <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
                </CheckboxCard>
            ))}
        </CheckboxGroup>
    </div>
);

// Validation Statuses, drawn on the border of the card
export const ValidationStatuses: StoryFn<typeof CheckboxCard> = () => (
    <div className={`${classes.container} ${classes.stack}`}>
        <CheckboxCard value="sms" validationStatus="error">
            <CheckboxCard.Label>SMS</CheckboxCard.Label>
            <CheckboxCard.Description>This account has no number to text</CheckboxCard.Description>
        </CheckboxCard>
        <CheckboxCard value="email" validationStatus="success" defaultChecked>
            <CheckboxCard.Label>Email</CheckboxCard.Label>
            <CheckboxCard.Description>This address has been confirmed</CheckboxCard.Description>
        </CheckboxCard>
    </div>
);

// Laid Out In A Row, where the group hands the cards to a container of the caller's own
export const InARow: StoryFn<typeof CheckboxCard> = () => (
    <div className={classes.row}>
        {channels.map((channel) => (
            <CheckboxCard key={channel.value} value={channel.value}>
                <CheckboxCard.LeadingVisual>
                    <channel.icon />
                </CheckboxCard.LeadingVisual>
                <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
            </CheckboxCard>
        ))}
    </div>
);

// Controlled, where the caller keeps hold of the answers. The group reports every card that is
// ticked rather than the one that has just been clicked, so the cards take their state from that
// one list rather than each keeping hold of its own
export const Controlled: StoryFn<typeof CheckboxCard> = () => {
    const [selected, setSelected] = React.useState<string[]>([]);

    return (
        <div className={classes.container}>
            <CheckboxGroup onChange={setSelected}>
                <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
                {channels.map((channel) => (
                    <CheckboxCard
                        key={channel.value}
                        value={channel.value}
                        checked={selected.includes(channel.value)}
                    >
                        <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
                        <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
                    </CheckboxCard>
                ))}
            </CheckboxGroup>
            <Text>Ticked: {selected.join(", ") || "nothing"}</Text>
        </div>
    );
};
