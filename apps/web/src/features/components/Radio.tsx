import * as React from "react";
import { Heading, Radio as RadioComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// What the set on this page is choosing between. It is written once and read out into a radio
// apiece, since a set of choices is come by as a list rather than typed out one control at a time
const choices = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "none", label: "No thanks" },
];

// The plainest radio there is: the control, and the words it stands for beside it. It is given a
// value, which is what it is called on submission, and a name, which is what ties it to the radios
// it is one of.
//
// The words are a label pointed at the control rather than text set down next to it, so that the
// words answer the pointer as the control does and are read out with it. A radio is small, and one
// that can only be hit on the dot itself is a poor target.
//
// The stack is part of what is being shown rather than the page's own furniture, since a radio
// standing without the words it is a choice of is not a radio anybody could use.
//
// The page and the component it is about are both called Radio, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Radio, as an application
// importing it would
const defaultPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <RadioComponent id="default-email" name="default-notify" value="email" />
        <Text as="label" htmlFor="default-email">
            Email
        </Text>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Radio id="default-email" name="default-notify" value="email" />
    <Text as="label" htmlFor="default-email">
        Email
    </Text>
</Stack>`;

// A radio that starts out chosen. It is still keeping its own state, so it is answered from the
// control itself rather than from outside
const checkedPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <RadioComponent id="checked-email" name="checked-notify" value="email" defaultChecked />
        <Text as="label" htmlFor="checked-email">
            Email
        </Text>
    </Stack>
);

const checkedCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Radio id="checked-email" name="checked-notify" value="email" defaultChecked />
    <Text as="label" htmlFor="checked-email">
        Email
    </Text>
</Stack>`;

// The radios of one question, which is the only shape a radio is really used in: a single one has
// nothing to be chosen over. What ties them is the name they share, which is what the browser
// groups on, so choosing any of them lets the others go.
//
// The state is held by whoever is drawing them rather than by the controls, since what the question
// was answered with is the reason for asking it. It is a component of its own rather than an element
// the page holds ready, since the state has to be kept somewhere for it to be handed back down
const NamedSetPreview = () => {
    const [selected, setSelected] = React.useState("email");

    return (
        <Stack gap="condensed">
            {choices.map(({ value, label }) => (
                <Stack key={value} direction="horizontal" gap="condensed" align="center">
                    <RadioComponent
                        id={`set-${value}`}
                        name="set-notify"
                        value={value}
                        checked={selected === value}
                        onChange={(event) => setSelected(event.currentTarget.value)}
                    />
                    <Text as="label" htmlFor={`set-${value}`}>
                        {label}
                    </Text>
                </Stack>
            ))}
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn: the choices being offered, and the
// answer, which the radios are told rather than keep
const namedSetSetup = `const choices = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
    { value: "none", label: "No thanks" },
];

const [selected, setSelected] = React.useState("email");`;

const namedSetCode = `<Stack gap="condensed">
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="center">
            <Radio
                id={\`set-\${value}\`}
                name="set-notify"
                value={value}
                checked={selected === value}
                onChange={(event) => setSelected(event.currentTarget.value)}
            />
            <Text as="label" htmlFor={\`set-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</Stack>`;

// A choice that cannot be made. The two are drawn together because what a disabled radio looks like
// depends on where it was left: one that was never chosen and one that was are the same control in
// two states, and only the pair says what the state does to each
const disabledPreview = (
    <Stack gap="condensed">
        <Stack direction="horizontal" gap="condensed" align="center">
            <RadioComponent id="disabled-email" name="disabled-notify" value="email" disabled />
            <Text as="label" htmlFor="disabled-email">
                Email
            </Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <RadioComponent
                id="disabled-sms"
                name="disabled-notify"
                value="sms"
                disabled
                defaultChecked
            />
            <Text as="label" htmlFor="disabled-sms">
                SMS
            </Text>
        </Stack>
    </Stack>
);

const disabledCode = `<Stack gap="condensed">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Radio id="disabled-email" name="disabled-notify" value="email" disabled />
        <Text as="label" htmlFor="disabled-email">
            Email
        </Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Radio id="disabled-sms" name="disabled-notify" value="sms" disabled defaultChecked />
        <Text as="label" htmlFor="disabled-sms">
            SMS
        </Text>
    </Stack>
</Stack>`;

// The two things a radio says about itself that it does not draw: that the question has to be
// answered, and that what it was answered with will not do. Neither marks the control, since a
// single radio carries no validation of its own — the set around it is what a reader is told is
// wrong, and what is said here is said to a screen reader rather than shown
const validationPreview = (
    <Stack gap="condensed">
        <Stack direction="horizontal" gap="condensed" align="center">
            <RadioComponent id="required-email" name="required-notify" value="email" required />
            <Text as="label" htmlFor="required-email">
                Email
            </Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center">
            <RadioComponent
                id="required-sms"
                name="required-notify"
                value="sms"
                required
                validationStatus="error"
            />
            <Text as="label" htmlFor="required-sms">
                SMS
            </Text>
        </Stack>
    </Stack>
);

const validationCode = `<Stack gap="condensed">
    <Stack direction="horizontal" gap="condensed" align="center">
        <Radio id="required-email" name="required-notify" value="email" required />
        <Text as="label" htmlFor="required-email">
            Email
        </Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center">
        <Radio
            id="required-sms"
            name="required-notify"
            value="sms"
            required
            validationStatus="error"
        />
        <Text as="label" htmlFor="required-sms">
            SMS
        </Text>
    </Stack>
</Stack>`;

// The radio as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Checked",
        description:
            "A radio that starts out chosen. It is read once, so a radio started this way is answered by whoever is using it rather than from outside. A question with a sensible answer is better asked with that answer already made than with nothing chosen, since a set with nothing chosen cannot be got back to once it has been left.",
        preview: checkedPreview,
        code: checkedCode,
    },
    {
        name: "A named set",
        description:
            "The radios of one question, which is the only shape a radio is really used in: a single one has nothing to be chosen over. What ties them is the name they share, which is what the browser groups on, so choosing any of them lets the others go. Given a RadioGroup to stand in, they take its name and this can be left out.",
        setup: namedSetSetup,
        preview: <NamedSetPreview />,
        code: namedSetCode,
    },
    {
        name: "Disabled",
        description:
            "A choice that cannot be made. It is taken out of the tab order the way a disabled input is, and what it holds is not submitted, so it is for a choice that is not available just now rather than one that is only to be read. The two are drawn together because a disabled radio that was chosen and one that was not are the same control saying different things.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Required and invalid",
        description:
            "The two things a radio says about itself that it does not draw. Neither marks the control: a single radio carries no validation of its own, and the set around it is what a reader is told is wrong, so what is said here is said to a screen reader rather than shown. Nothing looks different between these two and the plainest example above, which is the point of them.",
        preview: validationPreview,
        code: validationCode,
    },
];

// What the radio says about the answer it was given. It only informs the ARIA attributes, since a
// single radio carries no validation styling of its own
const validationStatus = '"error" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the radio takes. It is the browser's own radio underneath rather than a control drawn
// out of parts, so there is the one table, and everything an input takes it takes as well.
//
// What the radio is called comes first, since a radio without a value has nothing to submit and one
// without a name is a set of one; where it stands follows, and last what it says about the answer
const groups: ComponentPropGroup[] = [
    {
        name: "Radio",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "Identifies this radio on submission and as its group's selection. It is what the answer to the question comes back as, so it is the one thing a radio cannot be drawn without",
            },
            {
                name: "name",
                type: "string",
                description:
                    "Ties the radio to its siblings, so the browser only lets one of them be checked. A radio inside a RadioGroup takes the group's name when this is left out, and one standing on its own has to be given one",
            },
            {
                name: "checked",
                type: "boolean",
                description:
                    "Whether the radio is the one chosen, where the state is held by whoever is drawing it rather than by the control. Given this, the radio is told where it stands and says nothing on its own, so it wants an onChange to answer through",
            },
            {
                name: "defaultChecked",
                type: "boolean",
                default: "false",
                description:
                    "Where the radio starts out, for a set that keeps its own state. It is read once, so a radio started this way is answered from the control rather than from outside",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the choice being made and takes the radio out of the tab order, and what it holds is not submitted",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires a choice before the form can be submitted. It marks the radio as required to a screen reader as well, and draws nothing of its own",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the radio says about the answer it was given. It only informs the ARIA attributes: a single radio carries no validation styling of its own, and the group around it is what carries the marking a reader sees",
            },
            {
                name: "onChange",
                type: "React.ChangeEventHandler<HTMLInputElement>",
                description:
                    "Called when the radio is chosen. A radio standing in a RadioGroup calls the group's handler as well as this one, so the group hears the answer without the radio having to be told about it",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the radio is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Radio = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Radio
            </Heading>
            <Text as="p" size="large">
                One choice out of a set, where taking it gives up the others. It is the browser's
                own radio underneath, so what ties a set together is the name its members share and
                what comes back on submission is the value of whichever was chosen. A single radio
                is rarely what is wanted — the set is the control, and this is one of its members.
            </Text>
        </Stack>
        <ComponentExamples component="Radio" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Radio;
