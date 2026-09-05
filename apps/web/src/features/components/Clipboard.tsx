import * as React from "react";
import { CheckmarkCircleRegular, LinkRegular } from "@gamecrafters/base-ui-icons";
import {
    Button,
    Clipboard as ClipboardComponent,
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
    // A row laid out to fill whatever it is put in would run the whole width of the card, and the
    // field in it with it. It is given a width to be read at instead
    preview: "w-[26rem]",
};

// What every example is a copy of. It is the library's own clone URL, which is what a row like this
// is most often standing under, and it is written once and read out into each of them since what
// the examples are about is the row rather than the value in it
const value = "https://github.com/gamecrafters-io/base-ui.git";

// What the examples have to have in hand before they can be drawn. It is written once and reached
// for by each of them, rather than run out along a line that would then have to be read across
const valueSetup = `const value = "https://github.com/gamecrafters-io/base-ui.git";`;

// The plainest clipboard there is: the value it is given, and something to press to take it. There
// is nowhere showing what will be copied, which is what a row standing beside something that
// already says it comes to.
//
// The value is named on the clipboard rather than on the parts, so what is shown and what is copied
// cannot drift apart, and a trigger standing on its own can still copy something with nothing to
// show it in.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the clipboard alone.
//
// The page and the component it is about are both called Clipboard, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Clipboard, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <ClipboardComponent value={value}>
            <ClipboardComponent.Control>
                <ClipboardComponent.Trigger />
            </ClipboardComponent.Control>
        </ClipboardComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Clipboard value={value}>
    <Clipboard.Control>
        <Clipboard.Trigger />
    </Clipboard.Control>
</Clipboard>`;

// The row as it is usually reached for: what the value is called above it, the value itself in a
// field, and the trigger beside it. The name points at the field rather than at the row, since the
// field is the thing it names, and the field says which id it settled on rather than being told
const labelPreview = (
    <ClipboardComponent value={value} className={classes.preview}>
        <ClipboardComponent.Label>Repository URL</ClipboardComponent.Label>
        <ClipboardComponent.Control>
            <ClipboardComponent.Input />
            <ClipboardComponent.Trigger />
        </ClipboardComponent.Control>
    </ClipboardComponent>
);

const labelCode = `<Clipboard value={value}>
    <Clipboard.Label>Repository URL</Clipboard.Label>
    <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger />
    </Clipboard.Control>
</Clipboard>`;

// The value as words rather than in a field, for one that is there to be recognised rather than
// read to the end or taken by hand. The whole of it still reaches the clipboard however much of it
// is drawn
const valueTextPreview = (
    <ClipboardComponent value={value} className={classes.preview}>
        <ClipboardComponent.Control>
            <ClipboardComponent.ValueText />
            <ClipboardComponent.Trigger />
        </ClipboardComponent.Control>
    </ClipboardComponent>
);

const valueTextCode = `<Clipboard value={value}>
    <Clipboard.Control>
        <Clipboard.ValueText />
        <Clipboard.Trigger />
    </Clipboard.Control>
</Clipboard>`;

// A trigger given words to carry, which names it without an icon having to stand in for the name.
// It is drawn as an ordinary button rather than an icon button once there is something in it, with
// the indicator standing before the words.
//
// The field is named here rather than by a label over the row, since what is being shown is the
// trigger and a name above it would be read as part of that
const labelledTriggerPreview = (
    <ClipboardComponent value={value} className={classes.preview}>
        <ClipboardComponent.Control>
            <ClipboardComponent.Input aria-label="Repository URL" />
            <ClipboardComponent.Trigger variant="primary">Copy</ClipboardComponent.Trigger>
        </ClipboardComponent.Control>
    </ClipboardComponent>
);

const labelledTriggerCode = `<Clipboard value={value}>
    <Clipboard.Control>
        <Clipboard.Input aria-label="Repository URL" />
        <Clipboard.Trigger variant="primary">Copy</Clipboard.Trigger>
    </Clipboard.Control>
</Clipboard>`;

// A trigger whose words say what it did rather than leaving the tick to say it. The clipboard's own
// announcement is turned off, since these words are read out as the button's name and a row is only
// to report a copy once
const copyTextPreview = (
    <Stack align="start">
        <ClipboardComponent value={value} copiedAnnouncement={null}>
            <ClipboardComponent.Trigger>
                <ClipboardComponent.Indicator />
                <ClipboardComponent.CopyText />
            </ClipboardComponent.Trigger>
        </ClipboardComponent>
    </Stack>
);

const copyTextCode = `<Clipboard value={value} copiedAnnouncement={null}>
    <Clipboard.Trigger>
        <Clipboard.Indicator />
        <Clipboard.CopyText />
    </Clipboard.Trigger>
</Clipboard>`;

// Marks of the caller's own in place of the sheets and the tick. The one that stands while there is
// something to copy is written in as children, and the one that stands after it is handed to
// `copied`, so the pair is written where it is read
const indicatorPreview = (
    <ClipboardComponent value={value} className={classes.preview}>
        <ClipboardComponent.Control>
            <ClipboardComponent.Input aria-label="Repository URL" />
            <ClipboardComponent.Trigger label="Copy the clone URL">
                <ClipboardComponent.Indicator copied={<CheckmarkCircleRegular />}>
                    <LinkRegular />
                </ClipboardComponent.Indicator>
            </ClipboardComponent.Trigger>
        </ClipboardComponent.Control>
    </ClipboardComponent>
);

const indicatorCode = `<Clipboard value={value}>
    <Clipboard.Control>
        <Clipboard.Input aria-label="Repository URL" />
        <Clipboard.Trigger label="Copy the clone URL">
            <Clipboard.Indicator copied={<CheckmarkCircleRegular />}>
                <LinkRegular />
            </Clipboard.Indicator>
        </Clipboard.Trigger>
    </Clipboard.Control>
</Clipboard>`;

// A value left showing but not to be taken. The field stays readable, since a value that cannot be
// copied is still a value worth reading, and only the trigger is stopped
const disabledPreview = (
    <ClipboardComponent value={value} disabled className={classes.preview}>
        <ClipboardComponent.Label>Repository URL</ClipboardComponent.Label>
        <ClipboardComponent.Control>
            <ClipboardComponent.Input />
            <ClipboardComponent.Trigger />
        </ClipboardComponent.Control>
    </ClipboardComponent>
);

const disabledCode = `<Clipboard value={value} disabled>
    <Clipboard.Label>Repository URL</Clipboard.Label>
    <Clipboard.Control>
        <Clipboard.Input />
        <Clipboard.Trigger />
    </Clipboard.Control>
</Clipboard>`;

// The value held by whoever is drawing the row rather than by the clipboard. It is a component of
// its own rather than an element the page holds ready, since the value has to be kept somewhere for
// it to be handed back down.
//
// What the caller does with it is the reason for holding it at all, so it is put to use beside the
// row rather than only stored: the button swaps the value out, and what the field shows and what
// the trigger would copy follow it together
const ControlledPreview = () => {
    const [url, setUrl] = React.useState(value);

    return (
        <Stack gap="normal" align="start" className={classes.preview}>
            <ClipboardComponent value={url} onValueChange={setUrl}>
                <ClipboardComponent.Label>Repository URL</ClipboardComponent.Label>
                <ClipboardComponent.Control>
                    <ClipboardComponent.Input />
                    <ClipboardComponent.Trigger />
                </ClipboardComponent.Control>
            </ClipboardComponent>
            <Button onClick={() => setUrl("git@github.com:gamecrafters-io/base-ui.git")}>
                Switch to SSH
            </Button>
        </Stack>
    );
};

// The clipboard is told what it holds rather than keeping it, so the value is the caller's and is
// got ready here
const controlledSetup = `${valueSetup}

const [url, setUrl] = React.useState(value);`;

const controlledCode = `<Stack gap="normal" align="start">
    <Clipboard value={url} onValueChange={setUrl}>
        <Clipboard.Label>Repository URL</Clipboard.Label>
        <Clipboard.Control>
            <Clipboard.Input />
            <Clipboard.Trigger />
        </Clipboard.Control>
    </Clipboard>
    <Button onClick={() => setUrl("git@github.com:gamecrafters-io/base-ui.git")}>
        Switch to SSH
    </Button>
</Stack>`;

// The clipboard as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: valueSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A name over the row",
        description:
            "The row as it is usually reached for: what the value is called above it, the value itself in a field, and the trigger beside it. The field is read-only rather than disabled, so the value is not the reader's to change but is still theirs to select and read out, and arriving at it selects the whole of it.",
        setup: valueSetup,
        preview: labelPreview,
        code: labelCode,
    },
    {
        name: "As text rather than a field",
        description:
            "The value shown as words, for one that is there to be recognised rather than read to the end or taken by hand. A caller who would rather show something shorter puts that in as children, and the whole of the value goes on being what is copied.",
        setup: valueSetup,
        preview: valueTextPreview,
        code: valueTextCode,
    },
    {
        name: "Words on the trigger",
        description:
            "A trigger given words to carry, which names it without an icon having to stand in for the name. It is drawn as an ordinary button once there is something in it, with the indicator standing before the words, and as an icon button when there is not.",
        setup: valueSetup,
        preview: labelledTriggerPreview,
        code: labelledTriggerCode,
    },
    {
        name: "Words that report the copy",
        description:
            "A trigger whose words say what it did rather than leaving the tick to say it. Unlike the indicator these are read out, so they name the button and that name follows what has just happened. A row is only to report a copy once, so a trigger saying it in words is the one that turns the clipboard's own announcement off.",
        setup: valueSetup,
        preview: copyTextPreview,
        code: copyTextCode,
    },
    {
        name: "Marks of your own",
        description:
            "The sheets and the tick swapped for something else. The mark that stands while there is something to copy is written in as children and the one that stands after it is handed to copied, so the pair is written where it is read. The trigger is still named outright, since a mark says nothing to a reader who cannot see it.",
        setup: valueSetup,
        preview: indicatorPreview,
        code: indicatorCode,
    },
    {
        name: "Disabled",
        description:
            "A value left showing but not to be taken. The field stays readable, since a value that cannot be copied is still one worth reading, and only the trigger is stopped.",
        setup: valueSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Where the caller keeps the value",
        description:
            "The value held by whoever is drawing the row rather than by the clipboard, so that what is copied follows the page. What the field shows and what the trigger would take are the same value, named once on the clipboard, so swapping it changes both together.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
];

// How much weight the trigger carries against the page, and how tall it is drawn. They are the
// button's own, since the trigger is a button underneath
const variant = '"default" | "primary" | "danger" | "invisible" | "link"';

const size = '"small" | "medium" | "large"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = (element: string) => ({
    name: "as",
    type: "React.ElementType",
    default: `"${element}"`,
    description: "The element or component this is drawn as, in place of its default",
});

// Every prop the clipboard and its parts take, under the part that takes it.
//
// The clipboard comes first, since the value and everything about how long the tick stands are
// settled there and the parts read them; the parts follow in the order they are written in, which
// is the order they are read in
const groups: ComponentPropGroup[] = [
    {
        name: "Clipboard",
        props: [
            {
                name: "value",
                type: "string",
                description:
                    "The text the clipboard is given, where the caller keeps hold of it. It is named here rather than on the parts, so what is shown and what is copied cannot drift apart",
            },
            {
                name: "defaultValue",
                type: "string",
                description:
                    "The text it starts out holding, where the clipboard keeps hold of it itself",
            },
            {
                name: "timeout",
                type: "number",
                default: "3000",
                description:
                    "How long the tick stands, in milliseconds, before the trigger goes back to offering a copy. Nought leaves it standing until the value is copied again. Copying while the tick is still up starts the wait over rather than being timed out by the copy before it",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the value being copied. The field goes on showing it, since a value that cannot be copied is still one worth reading",
            },
            {
                name: "copiedAnnouncement",
                type: "string | null",
                default: '"Copied to clipboard"',
                description:
                    "What a screen reader is told once the value has been copied. The trigger is named for what pressing it does rather than for what it did, so this is what reports it; null where something else on the row already does, a Clipboard.CopyText say",
            },
            {
                name: "onValueChange",
                type: "(value: string) => void",
                description: "Called with the text the clipboard now holds",
            },
            {
                name: "onStatusChange",
                type: "(copied: boolean) => void",
                description:
                    "Called with whether the value has just been copied: true as it is taken, and false again once the tick has stood long enough",
            },
            {
                name: "onCopyError",
                type: "(error: unknown) => void",
                description:
                    "Called where the clipboard could not be reached: a page that was refused it, or a reader who turned the prompt down. The older way of copying is tried before this is called, so it is only reached once neither worked",
            },
            styling,
            polymorphic("div"),
        ],
    },
    {
        name: "Clipboard.Label",
        props: [styling, polymorphic("label")],
    },
    {
        name: "Clipboard.Control",
        props: [styling, polymorphic("div")],
    },
    {
        name: "Clipboard.Input",
        props: [
            styling,
            {
                name: "...TextInputProps",
                type: "TextInputProps",
                description:
                    "It is a text input underneath, so it takes what one takes and is sized and coloured the way every other field on the page is. What it shows and whether it can be typed in are the clipboard's to say, so value, defaultValue, onChange, readOnly and type are not taken",
            },
        ],
    },
    {
        name: "Clipboard.Trigger",
        props: [
            {
                name: "label",
                type: "string",
                default: '"Copy"',
                description:
                    "What an icon-only trigger is called. A trigger given words takes its name from those, the way any other button does, and there is nothing left for this to do",
            },
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description: "How much weight the trigger carries against the page",
            },
            {
                name: "size",
                type: size,
                default: '"medium"',
                description: "How tall the trigger is drawn",
            },
            styling,
        ],
    },
    {
        name: "Clipboard.Indicator",
        props: [
            {
                name: "copied",
                type: "React.ReactNode",
                description:
                    "What stands there once the value has been copied. Given nothing, a tick. What stands there while there is something to copy is written in as children, and is two sheets where nothing was written",
            },
            styling,
            polymorphic("span"),
        ],
    },
    {
        name: "Clipboard.CopyText",
        props: [
            {
                name: "copied",
                type: "React.ReactNode",
                description: 'What it says once the value has been copied. Given nothing, "Copied"',
            },
            {
                name: "visuallyHidden",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the words to a screen reader alone, for a trigger drawn as an icon that still has to carry a name",
            },
            styling,
            polymorphic("span"),
        ],
    },
    {
        name: "Clipboard.ValueText",
        props: [styling, polymorphic("span")],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the clipboard is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Clipboard = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Clipboard
            </Heading>
            <Text as="p" size="large">
                A value laid out to be taken away: a name for it, something showing what will be
                copied, and something to press to copy it. The value is named on the clipboard
                rather than on the parts, so what is shown and what is copied cannot drift apart.
                The trigger says what pressing it does rather than what it has just done — that is
                said by the tick, and again through a live region for a reader who cannot see one. A
                caller who wants a copy control of their own rather than these parts works from the
                same state through the useClipboard hook.
            </Text>
        </Stack>
        <ComponentExamples component="Clipboard" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Clipboard;
