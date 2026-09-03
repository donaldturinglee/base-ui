import * as React from "react";
import {
    Button,
    Collapsible as CollapsibleComponent,
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
    // A disclosure runs to the width of whatever it was put in, and across the whole of the card
    // its trigger would be a button the width of the page. It is given a width to be read at
    // instead
    preview: "w-[20rem]",
    // What sets a disclosure inside another apart from one standing beside it. It is part of what
    // the nesting example is showing rather than the page's own furniture, since nothing else says
    // which of them holds which
    nested: "ps-[var(--base-size-8)]",
};

// What every example is a disclosure of. It is written once and read out into each of them, since
// what the examples are about is the disclosure rather than the words inside it, and words that
// changed between them would be read as though they were the point
const content =
    "A disclosure standing on its own: something to press, and content that is only there once it has been pressed.";

// What the examples have to have in hand before they can be drawn. Each is written once and
// reached for by the examples that need it, rather than run out along a line that would then have
// to be read across
const contentSetup = `const content =
    "A disclosure standing on its own: something to press, and content that is only there once it has been pressed.";`;

// The plainest disclosure there is: something to press, and what it holds, which is only there once
// it has been pressed. It keeps its own state, since nothing was handed one to hold.
//
// The trigger says what it controls and whether that is open, so a reader is told what pressing it
// did without having to go looking for what changed.
//
// The width it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the disclosure alone: standing in an application, it fills whatever it was put in.
//
// The page and the component it is about are both called Collapsible, so the component is brought
// in under a name saying which of the two it is. The listing beneath says Collapsible, as an
// application importing it would
const defaultPreview = (
    <CollapsibleComponent className={classes.preview}>
        <CollapsibleComponent.Trigger>What is a collapsible?</CollapsibleComponent.Trigger>
        <CollapsibleComponent.Panel>
            <Text>{content}</Text>
        </CollapsibleComponent.Panel>
    </CollapsibleComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Collapsible>
    <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
    <Collapsible.Panel>
        <Text>{content}</Text>
    </Collapsible.Panel>
</Collapsible>`;

// A disclosure that starts out open, for content a reader is more likely to want than not. It is
// still keeping its own state, so it is closed from the trigger rather than from outside
const openPreview = (
    <CollapsibleComponent defaultOpen className={classes.preview}>
        <CollapsibleComponent.Trigger>What is a collapsible?</CollapsibleComponent.Trigger>
        <CollapsibleComponent.Panel>
            <Text>{content}</Text>
        </CollapsibleComponent.Panel>
    </CollapsibleComponent>
);

const openCode = `<Collapsible defaultOpen>
    <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
    <Collapsible.Panel>
        <Text>{content}</Text>
    </Collapsible.Panel>
</Collapsible>`;

// Where the chevron stands against the label. The three are drawn together rather than one to an
// example, since where the mark is put is read against the others rather than on its own: apart
// they are three triggers, and beside each other they are the choice being made.
//
// Each is named for the value it was given, so what is read off the trigger is what drew it. The
// stack is part of what is being shown rather than the page's own furniture, since what the example
// is about is the three read beside one another
const indicatorPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <CollapsibleComponent>
            <CollapsibleComponent.Trigger>After the label</CollapsibleComponent.Trigger>
            <CollapsibleComponent.Panel>
                <Text>{content}</Text>
            </CollapsibleComponent.Panel>
        </CollapsibleComponent>
        <CollapsibleComponent>
            <CollapsibleComponent.Trigger indicator="start">
                Before the label
            </CollapsibleComponent.Trigger>
            <CollapsibleComponent.Panel>
                <Text>{content}</Text>
            </CollapsibleComponent.Panel>
        </CollapsibleComponent>
        <CollapsibleComponent>
            <CollapsibleComponent.Trigger indicator="none">
                No chevron at all
            </CollapsibleComponent.Trigger>
            <CollapsibleComponent.Panel>
                <Text>{content}</Text>
            </CollapsibleComponent.Panel>
        </CollapsibleComponent>
    </Stack>
);

const indicatorCode = `<Stack gap="condensed">
    <Collapsible>
        <Collapsible.Trigger>After the label</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{content}</Text>
        </Collapsible.Panel>
    </Collapsible>
    <Collapsible>
        <Collapsible.Trigger indicator="start">Before the label</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{content}</Text>
        </Collapsible.Panel>
    </Collapsible>
    <Collapsible>
        <Collapsible.Trigger indicator="none">No chevron at all</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{content}</Text>
        </Collapsible.Panel>
    </Collapsible>
</Stack>`;

// A disclosure that cannot be worked. The two are drawn together because what disabling does
// depends on where the disclosure was left: one closed stays shut and one open stays open, and only
// the pair says that it is left as it stands rather than put away
const disabledPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <CollapsibleComponent disabled>
            <CollapsibleComponent.Trigger>
                Closed, and cannot be opened
            </CollapsibleComponent.Trigger>
            <CollapsibleComponent.Panel>
                <Text>{content}</Text>
            </CollapsibleComponent.Panel>
        </CollapsibleComponent>
        <CollapsibleComponent disabled defaultOpen>
            <CollapsibleComponent.Trigger>Open, and cannot be closed</CollapsibleComponent.Trigger>
            <CollapsibleComponent.Panel>
                <Text>{content}</Text>
            </CollapsibleComponent.Panel>
        </CollapsibleComponent>
    </Stack>
);

const disabledCode = `<Stack gap="condensed">
    <Collapsible disabled>
        <Collapsible.Trigger>Closed, and cannot be opened</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{content}</Text>
        </Collapsible.Panel>
    </Collapsible>
    <Collapsible disabled defaultOpen>
        <Collapsible.Trigger>Open, and cannot be closed</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{content}</Text>
        </Collapsible.Panel>
    </Collapsible>
</Stack>`;

// The disclosure with whether it is open held by whoever is drawing it rather than by the
// disclosure. It is a component of its own rather than an element the page holds ready, since the
// state has to be kept somewhere for it to be handed back down.
//
// What the caller does with the state is the reason for holding it at all, so it is put to use
// beside the disclosure rather than only stored: the button opens and closes it from outside, and
// says which of the two pressing it would do
const ControlledPreview = () => {
    const [open, setOpen] = React.useState(false);

    return (
        <Stack gap="condensed" className={classes.preview}>
            <Button onClick={() => setOpen(!open)}>{open ? "Hide" : "Show"} the answer</Button>
            <CollapsibleComponent open={open} onChange={setOpen}>
                <CollapsibleComponent.Trigger>What is a collapsible?</CollapsibleComponent.Trigger>
                <CollapsibleComponent.Panel>
                    <Text>{content}</Text>
                </CollapsibleComponent.Panel>
            </CollapsibleComponent>
        </Stack>
    );
};

// The disclosure is told whether it is open rather than keeping it, so the state is the caller's
// and is got ready here, beside the words every example is a disclosure of
const controlledSetup = `${contentSetup}

const [open, setOpen] = React.useState(false);`;

const controlledCode = `<Stack gap="condensed">
    <Button onClick={() => setOpen(!open)}>{open ? "Hide" : "Show"} the answer</Button>
    <Collapsible open={open} onChange={setOpen}>
        <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
        <Collapsible.Panel>
            <Text>{content}</Text>
        </Collapsible.Panel>
    </Collapsible>
</Stack>`;

// One disclosure holding another. Nothing is asked for to allow it: a panel holds whatever it was
// given, and a disclosure is one of the things it can be given, so the two nest by being what they
// already are.
//
// The chevrons are put before the labels, which reads as a row of a tree rather than as a button,
// and the inner two are set in from the edge, since nothing else on the page says which of them
// holds which
const nestedPreview = (
    <CollapsibleComponent defaultOpen className={classes.preview}>
        <CollapsibleComponent.Trigger indicator="start">Components</CollapsibleComponent.Trigger>
        <CollapsibleComponent.Panel>
            <CollapsibleComponent className={classes.nested}>
                <CollapsibleComponent.Trigger indicator="start">Forms</CollapsibleComponent.Trigger>
                <CollapsibleComponent.Panel>
                    <Text>Checkbox, Radio, Select, TextInput, Textarea</Text>
                </CollapsibleComponent.Panel>
            </CollapsibleComponent>
            <CollapsibleComponent className={classes.nested}>
                <CollapsibleComponent.Trigger indicator="start">
                    Overlays
                </CollapsibleComponent.Trigger>
                <CollapsibleComponent.Panel>
                    <Text>Dialog, Popover, SelectPanel, Tooltip</Text>
                </CollapsibleComponent.Panel>
            </CollapsibleComponent>
        </CollapsibleComponent.Panel>
    </CollapsibleComponent>
);

// The inset is part of what is being shown rather than the page's own furniture, so it is got ready
// with the example rather than left out of it
const nestedSetup = `const nested = "ps-[var(--base-size-8)]";`;

const nestedCode = `<Collapsible defaultOpen>
    <Collapsible.Trigger indicator="start">Components</Collapsible.Trigger>
    <Collapsible.Panel>
        <Collapsible className={nested}>
            <Collapsible.Trigger indicator="start">Forms</Collapsible.Trigger>
            <Collapsible.Panel>
                <Text>Checkbox, Radio, Select, TextInput, Textarea</Text>
            </Collapsible.Panel>
        </Collapsible>
        <Collapsible className={nested}>
            <Collapsible.Trigger indicator="start">Overlays</Collapsible.Trigger>
            <Collapsible.Panel>
                <Text>Dialog, Popover, SelectPanel, Tooltip</Text>
            </Collapsible.Panel>
        </Collapsible>
    </Collapsible.Panel>
</Collapsible>`;

// A panel taken off the page while it is closed rather than left there hidden, for content that is
// dear to draw. The trigger stops pointing at it while it is gone, since a name with nothing at the
// other end of it is worse than saying nothing
const keepMountedPreview = (
    <CollapsibleComponent className={classes.preview}>
        <CollapsibleComponent.Trigger>What is a collapsible?</CollapsibleComponent.Trigger>
        <CollapsibleComponent.Panel keepMounted={false}>
            <Text>{content}</Text>
        </CollapsibleComponent.Panel>
    </CollapsibleComponent>
);

const keepMountedCode = `<Collapsible>
    <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
    <Collapsible.Panel keepMounted={false}>
        <Text>{content}</Text>
    </Collapsible.Panel>
</Collapsible>`;

// A closed panel the browser's own find-in-page can still reach, where what it turns up opens the
// disclosure rather than being passed over. The panel has to be on the page to be found in, so
// asking for this keeps it there whatever it was told about being kept
const hiddenUntilFoundPreview = (
    <CollapsibleComponent className={classes.preview}>
        <CollapsibleComponent.Trigger>What is a collapsible?</CollapsibleComponent.Trigger>
        <CollapsibleComponent.Panel hiddenUntilFound>
            <Text>{content}</Text>
        </CollapsibleComponent.Panel>
    </CollapsibleComponent>
);

const hiddenUntilFoundCode = `<Collapsible>
    <Collapsible.Trigger>What is a collapsible?</Collapsible.Trigger>
    <Collapsible.Panel hiddenUntilFound>
        <Text>{content}</Text>
    </Collapsible.Panel>
</Collapsible>`;

// The disclosure as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: contentSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Open to start",
        description:
            "A disclosure that starts out open, for content a reader is more likely to want than not. It is read once, so a disclosure started this way is closed by whoever is using it rather than from outside.",
        setup: contentSetup,
        preview: openPreview,
        code: openCode,
    },
    {
        name: "Where the chevron stands",
        description:
            "Where the mark saying whether the disclosure is open is put against the label. After the label reads as a button, which is what a disclosure standing on its own is; before it reads as a row of a tree, which is what one holding others is. A trigger that says it is open some other way takes none and draws no chevron at all.",
        setup: contentSetup,
        preview: indicatorPreview,
        code: indicatorCode,
    },
    {
        name: "Disabled",
        description:
            "A disclosure that cannot be worked. It is left as it stands rather than put away, so one that was open stays open and one that was closed stays closed, and the trigger is taken out of the tab order the way a disabled button is.",
        setup: contentSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Controlled",
        description:
            "Whether the disclosure is open held by whoever is drawing it rather than by the disclosure. It is told where it stands and says where it has been put, which is what a disclosure standing beside anything else that has to agree with it is given. A disclosure keeping its own state still reports through onChange, so a caller who only wants to hear about it need not take it over.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Nested",
        description:
            "One disclosure holding another. Nothing is asked for to allow it: a panel holds whatever it was given, and a disclosure is one of the things it can be given. Each keeps its own state, so opening the outer one says nothing about what the inner ones were left at. A set of disclosures that open and close together is an Accordion instead.",
        setup: nestedSetup,
        preview: nestedPreview,
        code: nestedCode,
    },
    {
        name: "Drawn only once it is asked for",
        description:
            "The panel taken off the page while it is closed rather than left there hidden, for content dear enough to draw that it is worth not drawing until it is wanted. The trigger stops pointing at it while it is gone, since naming something that is not in the document is worse than saying nothing about it.",
        setup: contentSetup,
        preview: keepMountedPreview,
        code: keepMountedCode,
    },
    {
        name: "Found by the browser",
        description:
            "A closed panel the browser's own find-in-page can still reach, where what it turns up opens the disclosure rather than being passed over. The panel has to be on the page to be found in, so this keeps it there whatever keepMounted says.",
        setup: contentSetup,
        preview: hiddenUntilFoundPreview,
        code: hiddenUntilFoundCode,
    },
];

// Where the chevron stands against the label
const indicator = '"start" | "end" | "none"';

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
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the disclosure and its parts take, under the part that takes it.
//
// The disclosure comes first, since whether it is open is settled there and the parts read it; the
// trigger follows, with the one prop that is its own; and the panel last, with the two that say how
// much of it is on the page while it is closed
const groups: ComponentPropGroup[] = [
    {
        name: "Collapsible",
        props: [
            {
                name: "defaultOpen",
                type: "boolean",
                default: "false",
                description:
                    "Whether the disclosure starts out open, for one that keeps hold of the state itself. It is read once, so a disclosure started this way is closed from the trigger rather than from outside",
            },
            {
                name: "open",
                type: "boolean",
                description:
                    "Whether the disclosure is open, where the state is held by whoever is drawing it rather than by the disclosure. Given this, the disclosure stops keeping its own and takes where it stands from the prop",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the disclosure being opened or closed, and takes the trigger out of the tab order. It is left as it stands rather than put away, so one that was open stays open",
            },
            {
                name: "onChange",
                type: "(open: boolean) => void",
                description:
                    "Called with whether the disclosure is open whenever it opens or closes. It is called whether or not the caller holds the state, so one that only wants to hear about it need not take it over. It takes the place of the element's own onChange, which says only that something happened rather than what it now is",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "CollapsibleTrigger",
        props: [
            {
                name: "indicator",
                type: indicator,
                default: '"end"',
                description:
                    "Where the chevron stands against the label. After the label it is pushed to the far end by the label itself and turns over as the panel opens; before it, it points at what it opens and turns down onto it. A trigger that says it is open some other way takes none and draws no chevron",
            },
            styling,
        ],
    },
    {
        name: "CollapsiblePanel",
        props: [
            {
                name: "keepMounted",
                type: "boolean",
                default: "true",
                description:
                    "Whether the panel stays on the page while it is closed. It does by default, so the trigger always has something to point at; a panel that is dear to draw can be taken off instead, and the trigger stops pointing at it while it is gone",
            },
            {
                name: "hiddenUntilFound",
                type: "boolean",
                default: "false",
                description:
                    "Lets the browser's own find-in-page reach the closed panel: what it finds opens the disclosure rather than being passed over. The panel has to be on the page to be found in, so this keeps it there whatever keepMounted says",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the disclosure is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Collapsible = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Collapsible
            </Heading>
            <Text as="p" size="large">
                A disclosure standing on its own: something to press, and content that is only there
                once it has been pressed. The trigger says what it controls and whether that is
                open, so a reader is told what pressing it did rather than left to find what
                changed. A set of these that open and close together is an Accordion instead.
            </Text>
        </Stack>
        <ComponentExamples component="Collapsible" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Collapsible;
