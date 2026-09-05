import * as React from "react";
import { AlertRegular, MailRegular, PhoneRegular } from "@gamecrafters/base-ui-icons";
import {
    CheckboxCard as CheckboxCardComponent,
    CheckboxGroup,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A card fills whatever it was put in, and the box is held to the far end of it, so the page
    // gives the cards a width to fill rather than running the words and the box to either edge of
    // the card they are shown in
    preview: "w-full max-w-[28rem]",
    // A run of cards standing on its own, where there is no group around them to space them
    stack: "w-full max-w-[28rem] flex flex-col gap-[var(--base-size-8)]",
    // Cards laid across rather than down, which is the caller's own container in place of the one
    // the group would lay them out in
    row: "grid grid-cols-3 gap-[var(--base-size-8)]",
};

// What the set on this page is choosing among. It is written once and read out into a card apiece,
// since a set of answers is come by as a list rather than typed out one card at a time
const channels = [
    { value: "email", label: "Email", description: "A message to the address on the account" },
    { value: "push", label: "Push", description: "A notification on every signed-in device" },
    { value: "sms", label: "SMS", description: "A text message to the number on the account" },
];

// What the examples have to have in hand before they can be drawn. It is written once and reached
// for by each of them rather than run out along a line that would then have to be read across
const channelsSetup = `const channels = [
    { value: "email", label: "Email", description: "A message to the address on the account" },
    { value: "push", label: "Push", description: "A notification on every signed-in device" },
    { value: "sms", label: "SMS", description: "A text message to the number on the account" },
];`;

// The plainest card there is: the name of the answer, a line saying more about it, and the box at
// the end of the row. The whole card is a label, so anywhere on it ticks the box, and each keeps
// hold of its own answer since nothing was handed one to hold.
//
// The group around them is part of what is being shown rather than the page's own furniture: a set
// of answers is named as a set, and a card standing alone with nothing saying what it is one of is
// an answer to a question nobody asked.
//
// The width they are held to is the page's own, as the card around them is, so the listing beneath
// is of the group alone: standing in an application it fills whatever it was put in.
//
// The page and the component it is about are both called CheckboxCard, so the component is brought
// in under a name saying which of the two it is. The listing beneath says CheckboxCard, as an
// application importing it would
const defaultPreview = (
    <Stack className={classes.preview}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCardComponent key={channel.value} value={channel.value}>
                    <CheckboxCardComponent.Label>{channel.label}</CheckboxCardComponent.Label>
                    <CheckboxCardComponent.Description>
                        {channel.description}
                    </CheckboxCardComponent.Description>
                </CheckboxCardComponent>
            ))}
        </CheckboxGroup>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<CheckboxGroup>
    <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
    {channels.map((channel) => (
        <CheckboxCard key={channel.value} value={channel.value}>
            <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
            <CheckboxCard.Description>{channel.description}</CheckboxCard.Description>
        </CheckboxCard>
    ))}
</CheckboxGroup>`;

// A mark leading the words rather than standing beside the box. The three are written out rather
// than read off the list the rest of the page uses, since what is being shown is the mark on each
// of them and a mark carried on the row would be handed over without ever being named here
const leadingVisualPreview = (
    <Stack className={classes.preview}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            <CheckboxCardComponent value="email">
                <CheckboxCardComponent.LeadingVisual>
                    <MailRegular />
                </CheckboxCardComponent.LeadingVisual>
                <CheckboxCardComponent.Label>Email</CheckboxCardComponent.Label>
                <CheckboxCardComponent.Description>
                    A message to the address on the account
                </CheckboxCardComponent.Description>
            </CheckboxCardComponent>
            <CheckboxCardComponent value="push">
                <CheckboxCardComponent.LeadingVisual>
                    <AlertRegular />
                </CheckboxCardComponent.LeadingVisual>
                <CheckboxCardComponent.Label>Push</CheckboxCardComponent.Label>
                <CheckboxCardComponent.Description>
                    A notification on every signed-in device
                </CheckboxCardComponent.Description>
            </CheckboxCardComponent>
            <CheckboxCardComponent value="sms">
                <CheckboxCardComponent.LeadingVisual>
                    <PhoneRegular />
                </CheckboxCardComponent.LeadingVisual>
                <CheckboxCardComponent.Label>SMS</CheckboxCardComponent.Label>
                <CheckboxCardComponent.Description>
                    A text message to the number on the account
                </CheckboxCardComponent.Description>
            </CheckboxCardComponent>
        </CheckboxGroup>
    </Stack>
);

const leadingVisualCode = `<CheckboxGroup>
    <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
    <CheckboxCard value="email">
        <CheckboxCard.LeadingVisual>
            <MailRegular />
        </CheckboxCard.LeadingVisual>
        <CheckboxCard.Label>Email</CheckboxCard.Label>
        <CheckboxCard.Description>A message to the address on the account</CheckboxCard.Description>
    </CheckboxCard>
    <CheckboxCard value="push">
        <CheckboxCard.LeadingVisual>
            <AlertRegular />
        </CheckboxCard.LeadingVisual>
        <CheckboxCard.Label>Push</CheckboxCard.Label>
        <CheckboxCard.Description>A notification on every signed-in device</CheckboxCard.Description>
    </CheckboxCard>
    <CheckboxCard value="sms">
        <CheckboxCard.LeadingVisual>
            <PhoneRegular />
        </CheckboxCard.LeadingVisual>
        <CheckboxCard.Label>SMS</CheckboxCard.Label>
        <CheckboxCard.Description>A text message to the number on the account</CheckboxCard.Description>
    </CheckboxCard>
</CheckboxGroup>`;

// The name alone, for a set of answers that need nothing said about them. The card comes down to
// the height of the one line it is left holding
const labelOnlyPreview = (
    <Stack className={classes.preview}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCardComponent key={channel.value} value={channel.value}>
                    <CheckboxCardComponent.Label>{channel.label}</CheckboxCardComponent.Label>
                </CheckboxCardComponent>
            ))}
        </CheckboxGroup>
    </Stack>
);

const labelOnlyCode = `<CheckboxGroup>
    <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
    {channels.map((channel) => (
        <CheckboxCard key={channel.value} value={channel.value}>
            <CheckboxCard.Label>{channel.label}</CheckboxCard.Label>
        </CheckboxCard>
    ))}
</CheckboxGroup>`;

// Cards ticked from the start, which the boxes keep hold of themselves. A card that has been
// ticked is drawn out from the rest in the colour the box inside it is filled with, so a reader
// running down the run finds the answers they have given without having to read the boxes
const defaultCheckedPreview = (
    <Stack className={classes.preview}>
        <CheckboxGroup>
            <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCardComponent
                    key={channel.value}
                    value={channel.value}
                    defaultChecked={channel.value !== "sms"}
                >
                    <CheckboxCardComponent.Label>{channel.label}</CheckboxCardComponent.Label>
                    <CheckboxCardComponent.Description>
                        {channel.description}
                    </CheckboxCardComponent.Description>
                </CheckboxCardComponent>
            ))}
        </CheckboxGroup>
    </Stack>
);

const defaultCheckedCode = `<CheckboxGroup>
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
</CheckboxGroup>`;

// A card standing over a set where some but not all of it has been answered. It is not a state a
// card is clicked into — nothing the browser does leaves a box part ticked — so it is worked out
// from the set and handed down, which makes the answers the caller's and this a component of its
// own rather than an element the page holds ready.
//
// The card over the set answers for the whole of it, and ticking it gives or takes back every
// answer under it at once
const IndeterminatePreview = () => {
    const [selected, setSelected] = React.useState(["email"]);

    const all = channels.map((channel) => channel.value);
    const isEverything = selected.length === all.length;

    return (
        <Stack className={classes.stack}>
            <CheckboxCardComponent
                value="all"
                checked={isEverything}
                indeterminate={selected.length > 0 && !isEverything}
                onChange={() => setSelected(isEverything ? [] : all)}
            >
                <CheckboxCardComponent.Label>Everything</CheckboxCardComponent.Label>
                <CheckboxCardComponent.Description>
                    Every way of being notified
                </CheckboxCardComponent.Description>
            </CheckboxCardComponent>
            {channels.map((channel) => (
                <CheckboxCardComponent
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
                    <CheckboxCardComponent.Label>{channel.label}</CheckboxCardComponent.Label>
                    <CheckboxCardComponent.Description>
                        {channel.description}
                    </CheckboxCardComponent.Description>
                </CheckboxCardComponent>
            ))}
        </Stack>
    );
};

// What the example has to have in hand. Which answers have been given is the caller's, since the
// card over the set is drawn from all of them at once, so it is got ready here
const indeterminateSetup = `${channelsSetup}

const [selected, setSelected] = React.useState(["email"]);

const all = channels.map((channel) => channel.value);
const isEverything = selected.length === all.length;`;

const indeterminateCode = `<Stack className="flex flex-col gap-[var(--base-size-8)]">
    <CheckboxCard
        value="all"
        checked={isEverything}
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
</Stack>`;

// A card that cannot be ticked, and a whole group that cannot. The two are drawn together since
// what is worth seeing is that the group speaks for every card in it: a card is turned off one at a
// time where there is a reason of its own, and the group is turned off where the reason is the
// question's rather than the answer's
const disabledPreview = (
    <Stack gap="spacious" className={classes.preview}>
        <CheckboxGroup>
            <CheckboxGroup.Label>One card turned off</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCardComponent
                    key={channel.value}
                    value={channel.value}
                    disabled={channel.value === "sms"}
                >
                    <CheckboxCardComponent.Label>{channel.label}</CheckboxCardComponent.Label>
                    <CheckboxCardComponent.Description>
                        {channel.description}
                    </CheckboxCardComponent.Description>
                </CheckboxCardComponent>
            ))}
        </CheckboxGroup>
        <CheckboxGroup disabled>
            <CheckboxGroup.Label>The whole group turned off</CheckboxGroup.Label>
            {channels.map((channel) => (
                <CheckboxCardComponent
                    key={channel.value}
                    value={channel.value}
                    defaultChecked={channel.value === "email"}
                >
                    <CheckboxCardComponent.Label>{channel.label}</CheckboxCardComponent.Label>
                    <CheckboxCardComponent.Description>
                        {channel.description}
                    </CheckboxCardComponent.Description>
                </CheckboxCardComponent>
            ))}
        </CheckboxGroup>
    </Stack>
);

// The stack holding the two apart is part of what is being shown rather than the page's own
// furniture, since what the example is about is the one group read against the other
const disabledCode = `<Stack gap="spacious">
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
</Stack>`;

// What the answer is worth, drawn on the border of the card. The two are drawn together rather than
// one to an example, since what a colour says is read against the other rather than on its own
const validationPreview = (
    <Stack className={classes.stack}>
        <CheckboxCardComponent value="sms" validationStatus="error">
            <CheckboxCardComponent.Label>SMS</CheckboxCardComponent.Label>
            <CheckboxCardComponent.Description>
                This account has no number to text
            </CheckboxCardComponent.Description>
        </CheckboxCardComponent>
        <CheckboxCardComponent value="email" validationStatus="success" defaultChecked>
            <CheckboxCardComponent.Label>Email</CheckboxCardComponent.Label>
            <CheckboxCardComponent.Description>
                This address has been confirmed
            </CheckboxCardComponent.Description>
        </CheckboxCardComponent>
    </Stack>
);

const validationCode = `<Stack className="flex flex-col gap-[var(--base-size-8)]">
    <CheckboxCard value="sms" validationStatus="error">
        <CheckboxCard.Label>SMS</CheckboxCard.Label>
        <CheckboxCard.Description>This account has no number to text</CheckboxCard.Description>
    </CheckboxCard>
    <CheckboxCard value="email" validationStatus="success" defaultChecked>
        <CheckboxCard.Label>Email</CheckboxCard.Label>
        <CheckboxCard.Description>This address has been confirmed</CheckboxCard.Description>
    </CheckboxCard>
</Stack>`;

// Cards laid across rather than down, which is what a short run of answers with little said about
// them wants. The group lays its cards out in a column, so a row is a container of the caller's own
// with the cards handed straight to it
const rowPreview = (
    <div className={classes.row}>
        <CheckboxCardComponent value="email">
            <CheckboxCardComponent.LeadingVisual>
                <MailRegular />
            </CheckboxCardComponent.LeadingVisual>
            <CheckboxCardComponent.Label>Email</CheckboxCardComponent.Label>
        </CheckboxCardComponent>
        <CheckboxCardComponent value="push">
            <CheckboxCardComponent.LeadingVisual>
                <AlertRegular />
            </CheckboxCardComponent.LeadingVisual>
            <CheckboxCardComponent.Label>Push</CheckboxCardComponent.Label>
        </CheckboxCardComponent>
        <CheckboxCardComponent value="sms">
            <CheckboxCardComponent.LeadingVisual>
                <PhoneRegular />
            </CheckboxCardComponent.LeadingVisual>
            <CheckboxCardComponent.Label>SMS</CheckboxCardComponent.Label>
        </CheckboxCardComponent>
    </div>
);

// The container is part of what is being shown rather than the page's own furniture, since laying
// the cards across is the whole of what the example is about. It is written out as the classes it
// stands for rather than as the name the page holds it under, since what is copied out of here has
// only itself to reach for
const rowCode = `<div className="grid grid-cols-3 gap-[var(--base-size-8)]">
    <CheckboxCard value="email">
        <CheckboxCard.LeadingVisual>
            <MailRegular />
        </CheckboxCard.LeadingVisual>
        <CheckboxCard.Label>Email</CheckboxCard.Label>
    </CheckboxCard>
    <CheckboxCard value="push">
        <CheckboxCard.LeadingVisual>
            <AlertRegular />
        </CheckboxCard.LeadingVisual>
        <CheckboxCard.Label>Push</CheckboxCard.Label>
    </CheckboxCard>
    <CheckboxCard value="sms">
        <CheckboxCard.LeadingVisual>
            <PhoneRegular />
        </CheckboxCard.LeadingVisual>
        <CheckboxCard.Label>SMS</CheckboxCard.Label>
    </CheckboxCard>
</div>`;

// The answers held by whoever is drawing the cards rather than by the boxes. The group reports
// every card that is ticked rather than the one that has just been pressed, so the cards take what
// they are from that one list rather than each keeping hold of its own.
//
// What the caller does with the answers is the reason for holding them at all, so they are put to
// use under the group rather than only stored
const ControlledPreview = () => {
    const [selected, setSelected] = React.useState<string[]>([]);

    return (
        <Stack gap="condensed" className={classes.preview}>
            <CheckboxGroup onChange={setSelected}>
                <CheckboxGroup.Label>Notify me by</CheckboxGroup.Label>
                {channels.map((channel) => (
                    <CheckboxCardComponent
                        key={channel.value}
                        value={channel.value}
                        checked={selected.includes(channel.value)}
                    >
                        <CheckboxCardComponent.Label>{channel.label}</CheckboxCardComponent.Label>
                        <CheckboxCardComponent.Description>
                            {channel.description}
                        </CheckboxCardComponent.Description>
                    </CheckboxCardComponent>
                ))}
            </CheckboxGroup>
            <Text size="small">Ticked: {selected.join(", ") || "nothing"}</Text>
        </Stack>
    );
};

const controlledSetup = `${channelsSetup}

const [selected, setSelected] = React.useState<string[]>([]);`;

const controlledCode = `<Stack gap="condensed">
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
    <Text size="small">Ticked: {selected.join(", ") || "nothing"}</Text>
</Stack>`;

// The card as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what a card can be made of, then what it can be left holding, and last who holds the
// answers
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: channelsSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A mark leading the words",
        description:
            "A mark standing before the name rather than beside the box, which is what a set of answers a reader picks out by kind wants. It is drawn at the size the card sets, so a run of cards is led by marks of one size, and an unlabelled one stays out of the accessibility tree — the name beside it already says what the answer is.",
        preview: leadingVisualPreview,
        code: leadingVisualCode,
    },
    {
        name: "The name alone",
        description:
            "A card with nothing said under the name, for a set of answers that need nothing said about them. The card comes down to the height of the one line it is left holding, and the box stays at the end of the row.",
        setup: channelsSetup,
        preview: labelOnlyPreview,
        code: labelOnlyCode,
    },
    {
        name: "Ticked from the start",
        description:
            "Answers already given when the reader arrives, which the boxes keep hold of themselves. A card that has been ticked is drawn out from the rest in the colour the box inside it is filled with, so what has been answered is found by running down the cards rather than by reading each box.",
        setup: channelsSetup,
        preview: defaultCheckedPreview,
        code: defaultCheckedCode,
    },
    {
        name: "Part ticked",
        description:
            "A card standing over a set where some but not all of it has been answered. It is not a state a card is clicked into — nothing the browser does leaves a box part ticked — so it is worked out from the set and handed down, which makes the answers the caller's. The card is drawn as though it were ticked, since a dash stands for an answer given rather than one still to give.",
        setup: indeterminateSetup,
        preview: <IndeterminatePreview />,
        code: indeterminateCode,
    },
    {
        name: "Disabled",
        description:
            "A card that cannot be ticked, and a whole group that cannot. A group speaks for every card in it, so a question that is not to be answered at all is turned off once rather than card by card; a card is turned off on its own where the reason belongs to that answer. A card that was ticked before it was turned off keeps the answer and still reads as unavailable.",
        setup: channelsSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Validation",
        description:
            "What the answer is worth, drawn on the border of the card. It is read after the colour a ticked card takes, so a card that is both ticked and wrong still reads as wrong, and it is carried to a screen reader through the box rather than by the colour alone.",
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Laid out in a row",
        description:
            "Cards laid across rather than down, which is what a short run of answers with little said about them wants. The group lays its cards out in a column, so a row is a container of the caller's own with the cards handed straight to it — which is also why this run is not named as a set; standing in a form it would be.",
        preview: rowPreview,
        code: rowCode,
    },
    {
        name: "Answers the caller holds",
        description:
            "The answers held by whoever is drawing the cards rather than by the boxes, which is what anything else on the page having a say over them wants. The group reports every card that is ticked rather than the one that has just been pressed, so the cards take what they are from that one list rather than each keeping hold of its own.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// What the answer is worth, which draws the card's border in the colour of it
const validationStatus = '"error" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the card and its parts take, under the one that takes it. What names the answer comes
// first, since a card cannot be drawn without it, then what the answer is, and last what the card
// is left in.
//
// The parts hold the words and the mark and nothing else, so what is said about each of them is how
// it is styled; what they carry is settled by the card, which points the box inside it at the name
// and the line under it rather than at everything the card holds
const groups: ComponentPropGroup[] = [
    {
        name: "CheckboxCard",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "Identifies the card on submission and in its group's selection. A checkbox stands on its own rather than against its siblings, so it is submitted under this name as well as by it",
            },
            {
                name: "checked",
                type: "boolean",
                description:
                    "Whether the card has been ticked, where the caller keeps hold of the answer",
            },
            {
                name: "defaultChecked",
                type: "boolean",
                description:
                    "Whether the card starts out ticked, where the box keeps hold of the answer itself",
            },
            {
                name: "indeterminate",
                type: "boolean",
                default: "false",
                description:
                    "Draws the card as neither ticked nor cleared, for one standing over a set of answers only some of which have been given. It is worked out from the set and handed down rather than clicked into",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the card being ticked. A card inside a disabled CheckboxGroup is stopped along with it, so a question that is not to be answered at all is turned off once rather than card by card",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description: "Requires the card to be ticked before the form can be submitted",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the answer is worth, drawn on the border of the card and carried to a screen reader through the box, so it is not said by the colour alone",
            },
            {
                name: "onChange",
                type: "React.ChangeEventHandler<HTMLInputElement>",
                description:
                    "Called when the card is ticked or cleared. It reports a change on the box inside the card rather than on the label around it, and a card standing in a CheckboxGroup calls the group's handler as well as this one",
            },
            styling,
        ],
    },
    {
        name: "CheckboxCard.LeadingVisual",
        props: [
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the mark, for one that says something the words do not. Left out, the mark is taken as decorative and stays out of the accessibility tree, which is what a mark standing beside a name that already says the answer should be",
            },
            styling,
        ],
    },
    {
        name: "CheckboxCard.Label",
        props: [styling],
    },
    {
        name: "CheckboxCard.Description",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the card is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const CheckboxCard = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                CheckboxCard
            </Heading>
            <Text as="p" size="large">
                An answer drawn as a card rather than as a box with a line of text beside it, for a
                set of answers that each need more said about them than their name and that are
                given in any number rather than one at a time. The whole card is a label, so
                anywhere on it ticks the box it holds, and the box stands at the end of the row —
                what a reader running down a stack of cards looks for is the ones that are ticked,
                and they find them in the same place on every card rather than at the front of lines
                of different lengths.
            </Text>
        </Stack>
        <ComponentExamples component="CheckboxCard" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default CheckboxCard;
