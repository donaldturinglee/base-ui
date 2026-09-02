import * as React from "react";
import {
    FormControl,
    Heading,
    Stack,
    Switch as SwitchComponent,
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
};

// The plainest switch there is: the track, the thumb on it, the words beside it and the input
// underneath, with nothing said about where it starts. It keeps its own state, since nothing was
// handed one to hold.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the switch alone. The card lays what it is handed out in a
// column, and a column draws what it holds the whole way across unless it is told otherwise, which
// would make the whole line a target for the switch rather than the switch itself.
//
// The page and the component it is about are both called Switch, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Switch, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <SwitchComponent>
            <SwitchComponent.Control>
                <SwitchComponent.Thumb />
            </SwitchComponent.Control>
            <SwitchComponent.Label>Notifications</SwitchComponent.Label>
            <SwitchComponent.HiddenInput />
        </SwitchComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Switch>
    <Switch.Control>
        <Switch.Thumb />
    </Switch.Control>
    <Switch.Label>Notifications</Switch.Label>
    <Switch.HiddenInput />
</Switch>`;

// A switch that starts out on. It is still keeping its own state, so it is turned from the switch
// itself rather than from outside
const checkedPreview = (
    <Stack align="start">
        <SwitchComponent defaultChecked>
            <SwitchComponent.Control>
                <SwitchComponent.Thumb />
            </SwitchComponent.Control>
            <SwitchComponent.Label>Notifications</SwitchComponent.Label>
            <SwitchComponent.HiddenInput />
        </SwitchComponent>
    </Stack>
);

const checkedCode = `<Switch defaultChecked>
    <Switch.Control>
        <Switch.Thumb />
    </Switch.Control>
    <Switch.Label>Notifications</Switch.Label>
    <Switch.HiddenInput />
</Switch>`;

// The switch with the state held by whoever is drawing it rather than by the switch. It is a
// component of its own rather than an element the page holds ready, since the state has to be
// kept somewhere for it to be handed back down.
//
// What the caller does with the state is the reason for holding it at all, so it is put to use
// beside the switch rather than only stored
const ControlledPreview = () => {
    const [checked, setChecked] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            <SwitchComponent checked={checked} onCheckedChange={setChecked}>
                <SwitchComponent.Control>
                    <SwitchComponent.Thumb />
                </SwitchComponent.Control>
                <SwitchComponent.Label>Notifications</SwitchComponent.Label>
                <SwitchComponent.HiddenInput />
            </SwitchComponent>
            <Text size="small">Notifications are {checked ? "on" : "off"}</Text>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. The switch is told where it stands
// rather than keeping it, so the state is the caller's and is got ready here
const controlledSetup = `const [checked, setChecked] = React.useState(false);`;

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the switch and the words read together, so it is written out with them
const controlledCode = `<Stack gap="condensed" align="start">
    <Switch checked={checked} onCheckedChange={setChecked}>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
    <Text size="small">Notifications are {checked ? "on" : "off"}</Text>
</Stack>`;

// A switch that cannot be turned, off and on. The two are drawn together, since a disabled switch
// still says which of the two it is and what is worth seeing is that it says so either way
const disabledPreview = (
    <Stack gap="condensed" align="start">
        <SwitchComponent disabled>
            <SwitchComponent.Control>
                <SwitchComponent.Thumb />
            </SwitchComponent.Control>
            <SwitchComponent.Label>Off</SwitchComponent.Label>
            <SwitchComponent.HiddenInput />
        </SwitchComponent>
        <SwitchComponent disabled defaultChecked>
            <SwitchComponent.Control>
                <SwitchComponent.Thumb />
            </SwitchComponent.Control>
            <SwitchComponent.Label>On</SwitchComponent.Label>
            <SwitchComponent.HiddenInput />
        </SwitchComponent>
    </Stack>
);

const disabledCode = `<Stack gap="condensed" align="start">
    <Switch disabled>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Off</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
    <Switch disabled defaultChecked>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>On</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
</Stack>`;

// A switch that is left where it stands. It is drawn as a switch that is on rather than one that
// is off, since what is worth seeing is that it stays on however it is pressed
const readOnlyPreview = (
    <Stack align="start">
        <SwitchComponent readOnly defaultChecked>
            <SwitchComponent.Control>
                <SwitchComponent.Thumb />
            </SwitchComponent.Control>
            <SwitchComponent.Label>Notifications</SwitchComponent.Label>
            <SwitchComponent.HiddenInput />
        </SwitchComponent>
    </Stack>
);

const readOnlyCode = `<Switch readOnly defaultChecked>
    <Switch.Control>
        <Switch.Thumb />
    </Switch.Control>
    <Switch.Label>Notifications</Switch.Label>
    <Switch.HiddenInput />
</Switch>`;

// The switch standing in a field, which describes it by the caption and the validation message
// beneath it and says for it that it is required. The switch is marked invalid itself, since the
// field says nothing about that: what the message says is for the reader, and what the track
// draws is for the same reader looking at the switch
const formControlPreview = (
    <FormControl required>
        <SwitchComponent invalid>
            <SwitchComponent.Control>
                <SwitchComponent.Thumb />
            </SwitchComponent.Control>
            <SwitchComponent.Label>Notifications</SwitchComponent.Label>
            <SwitchComponent.HiddenInput />
        </SwitchComponent>
        <FormControl.Validation variant="error">
            Notifications have to be on to be told about a match
        </FormControl.Validation>
        <FormControl.Caption>Sent by email, once a day</FormControl.Caption>
    </FormControl>
);

const formControlCode = `<FormControl required>
    <Switch invalid>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
    <FormControl.Validation variant="error">
        Notifications have to be on to be told about a match
    </FormControl.Validation>
    <FormControl.Caption>Sent by email, once a day</FormControl.Caption>
</FormControl>`;

// The switch as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Checked",
        description:
            "A switch that starts out on. It is read once, so a switch started this way is turned by whoever is using it rather than from outside.",
        preview: checkedPreview,
        code: checkedCode,
    },
    {
        name: "Controlled",
        description:
            "The state held by whoever is drawing the switch rather than by the switch. It is told where it stands and says where it has been turned to, which is what a switch standing beside anything else that has to agree with it is given.",
        setup: controlledSetup,
        preview: <ControlledPreview />,
        code: controlledCode,
    },
    {
        name: "Disabled",
        description:
            "A switch that cannot be turned. It is taken out of the tab order the way a disabled input is, and what it holds is not submitted, so it is for a setting that is not available just now rather than one that is only to be read.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Read only",
        description:
            "A switch that is left where it stands. It stays in the tab order, so it can still be reached and read, and what it holds is still submitted; only turning it is refused.",
        preview: readOnlyPreview,
        code: readOnlyCode,
    },
    {
        name: "In a form control",
        description:
            "The switch standing in a field. The input takes the field's id, so the field's own name and caption point at it, and it is described by the caption and the validation message and is disabled or required as the field says, unless it was told otherwise itself.",
        preview: formControlPreview,
        code: formControlCode,
    },
];

// What the switch says when it is turned. It is handed whether it is on rather than an event,
// since that is the whole of what happened
const onCheckedChange = "(checked: boolean) => void";

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the switch and its parts take, under the one that takes it. The root is a label and
// the parts are spans, drawn as nothing else, so there is no `as` among them; the input takes what
// an input takes, on top of what is said here.
//
// Where the switch stands and what it says when it is turned are written up first, since they
// are what a switch is told before anything else; the states it can be left in follow, then what
// is submitted, and last how it is named
const groups: ComponentPropGroup[] = [
    {
        name: "Switch",
        props: [
            {
                name: "checked",
                type: "boolean",
                description:
                    "Whether the switch is on, where the caller is holding the state. It is told where it stands and says where it has been turned to, and does not move on its own",
            },
            {
                name: "defaultChecked",
                type: "boolean",
                default: "false",
                description:
                    "Whether the switch starts out on, where it is keeping the state itself. It is read once, so a switch started this way is turned by whoever is using it rather than from outside",
            },
            {
                name: "onCheckedChange",
                type: onCheckedChange,
                description: "Called with whether the switch is on whenever it is turned on or off",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the switch being turned and takes it out of the tab order, the way a disabled input is. What it holds is not submitted. A switch standing in a disabled FormControl is disabled with it",
            },
            {
                name: "readOnly",
                type: "boolean",
                default: "false",
                description:
                    "Leaves the switch where it stands while keeping it in the tab order, so it can still be reached and read. What it holds is still submitted",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires the switch to be on before the owning form can be submitted. A switch standing in a required FormControl is required with it",
            },
            {
                name: "invalid",
                type: "boolean",
                default: "false",
                description:
                    "Marks the switch as holding a value that will not do, which is said to a screen reader and drawn on the track",
            },
            {
                name: "name",
                type: "string",
                description: "The name the value is submitted under",
            },
            {
                name: "value",
                type: "string | number",
                default: '"on"',
                description:
                    "What is submitted while the switch is on. The default is the browser's own rather than the switch's, so a switch given none submits what a checkbox would",
            },
            {
                name: "form",
                type: "string",
                description:
                    "The id of the form the switch belongs to, where it does not stand inside it",
            },
            {
                name: "id",
                type: "string",
                description:
                    "Names the switch, and with it the parts, which are named from it. One is made where the caller does not give one. A switch standing in a FormControl hands the field's id to its input instead, so the field's own name and caption point at it",
            },
            {
                name: "ids",
                type: "SwitchIds",
                description:
                    "A name for any one part in place of the one worked out for it, for something outside the switch that has to point at the part by name",
            },
            styling,
        ],
    },
    {
        name: "SwitchRootProvider",
        props: [
            {
                name: "value",
                type: "UseSwitchReturn",
                required: true,
                description:
                    "What useSwitch returned, which the parts are then drawn from. It takes the place of the props the switch would otherwise work the state out from, for a switch that has to be turned from somewhere else on the page as well",
            },
            styling,
        ],
    },
    {
        name: "SwitchControl",
        props: [styling],
    },
    {
        name: "SwitchThumb",
        props: [styling],
    },
    {
        name: "SwitchLabel",
        props: [styling],
    },
    {
        name: "SwitchHiddenInput",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the switch is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Switch = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Switch
            </Heading>
            <Text as="p" size="large">
                Something that is either on or off, turned rather than picked. It is a checkbox
                underneath, kept on the page out of sight, so the browser does the turning, the tab
                stop and the submitting; the track and the thumb are what that is drawn as, and the
                words beside them say what is being turned.
            </Text>
        </Stack>
        <ComponentExamples component="Switch" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Switch;
