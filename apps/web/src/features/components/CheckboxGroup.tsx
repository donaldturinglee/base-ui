import * as React from "react";
import {
    Checkbox,
    CheckboxGroup as CheckboxGroupComponent,
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
};

// What the set on this page is choosing among. It is written once and read out into a box apiece,
// since a set of choices is come by as a list rather than typed out one control at a time
const choices = [
    { value: "releases", label: "New releases" },
    { value: "mentions", label: "Mentions" },
    { value: "digest", label: "Weekly digest" },
];

const choicesSetup = `const choices = [
    { value: "releases", label: "New releases" },
    { value: "mentions", label: "Mentions" },
    { value: "digest", label: "Weekly digest" },
];`;

// The boxes the groups on this page are made of. A checkbox is named by words pointed at it rather
// than by text set down beside it, so each is a box and a label together, and the two are held to
// the start rather than the middle because the box stands against the first line of the words.
//
// Several groups stand on the one page, so the ids are told apart by what the group is showing.
// The listings beneath write the run out rather than calling this, since what a reader copies has
// only itself to reach for
const boxes = (prefix: string, checked?: string[]) =>
    choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Checkbox
                id={`${prefix}-${value}`}
                value={value}
                defaultChecked={checked?.includes(value)}
            />
            <Text as="label" htmlFor={`${prefix}-${value}`}>
                {label}
            </Text>
        </Stack>
    ));

// The plainest group there is: the question, and the boxes it is answered with. It is drawn as a
// fieldset with the name in its legend, so a reader being read to hears what the boxes are a set of
// before they hear the boxes.
//
// The page and the component it is about are both called CheckboxGroup, so the component is brought
// in under a name saying which of the two it is. The listing beneath says CheckboxGroup, as an
// application importing it would
const defaultPreview = (
    <CheckboxGroupComponent>
        <CheckboxGroupComponent.Label>Notify me about</CheckboxGroupComponent.Label>
        {boxes("default")}
    </CheckboxGroupComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<CheckboxGroup>
    <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Checkbox id={\`default-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`default-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</CheckboxGroup>`;

// A line under the name, for what the question needs saying about it that the name alone does not.
// It is read out as part of what describes the group rather than left as words standing near it
const captionPreview = (
    <CheckboxGroupComponent>
        <CheckboxGroupComponent.Label>Notify me about</CheckboxGroupComponent.Label>
        <CheckboxGroupComponent.Caption>Pick as many as you like</CheckboxGroupComponent.Caption>
        {boxes("caption")}
    </CheckboxGroupComponent>
);

const captionCode = `<CheckboxGroup>
    <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
    <CheckboxGroup.Caption>Pick as many as you like</CheckboxGroup.Caption>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Checkbox id={\`caption-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`caption-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</CheckboxGroup>`;

// The name kept as what the group is called while taken off the screen, for a question whose words
// are already said by whatever the group stands under. It is a hidden name rather than no name,
// since a set of boxes nothing names is one a reader is read the answers to without being told the
// question
const hiddenLabelPreview = (
    <CheckboxGroupComponent>
        <CheckboxGroupComponent.Label visuallyHidden>Notify me about</CheckboxGroupComponent.Label>
        {boxes("hidden")}
    </CheckboxGroupComponent>
);

const hiddenLabelCode = `<CheckboxGroup>
    <CheckboxGroup.Label visuallyHidden>Notify me about</CheckboxGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Checkbox id={\`hidden-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`hidden-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</CheckboxGroup>`;

// A question that has to be answered. The name is marked with a star for a reader who is looking at
// it, and the legend carries the word itself for one who is being read to, so neither is left to
// take the requirement from the other
const requiredPreview = (
    <CheckboxGroupComponent required>
        <CheckboxGroupComponent.Label>Notify me about</CheckboxGroupComponent.Label>
        {boxes("required")}
    </CheckboxGroupComponent>
);

const requiredCode = `<CheckboxGroup required>
    <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Checkbox id={\`required-\${value}\`} value={value} />
            <Text as="label" htmlFor={\`required-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</CheckboxGroup>`;

// What the answers are worth, said under the boxes rather than beside any one of them, since what
// is wrong is the answer to the question rather than any single box. The two are drawn together
// rather than one to an example, since what a colour says is read against the other
const validationPreview = (
    <Stack gap="spacious">
        <CheckboxGroupComponent required>
            <CheckboxGroupComponent.Label>Notify me about</CheckboxGroupComponent.Label>
            {boxes("error")}
            <CheckboxGroupComponent.Validation variant="error">
                Pick at least one
            </CheckboxGroupComponent.Validation>
        </CheckboxGroupComponent>
        <CheckboxGroupComponent>
            <CheckboxGroupComponent.Label>Notify me about</CheckboxGroupComponent.Label>
            {boxes("success", ["releases"])}
            <CheckboxGroupComponent.Validation variant="success">
                That works
            </CheckboxGroupComponent.Validation>
        </CheckboxGroupComponent>
    </Stack>
);

// The stack holding the two apart is part of what is being shown rather than the page's own
// furniture, since what the example is about is the one group read against the other
const validationCode = `<Stack gap="spacious">
    <CheckboxGroup required>
        <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
        {choices.map(({ value, label }) => (
            <Stack key={value} direction="horizontal" gap="condensed" align="start">
                <Checkbox id={\`error-\${value}\`} value={value} />
                <Text as="label" htmlFor={\`error-\${value}\`}>
                    {label}
                </Text>
            </Stack>
        ))}
        <CheckboxGroup.Validation variant="error">Pick at least one</CheckboxGroup.Validation>
    </CheckboxGroup>
    <CheckboxGroup>
        <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
        {choices.map(({ value, label }) => (
            <Stack key={value} direction="horizontal" gap="condensed" align="start">
                <Checkbox
                    id={\`success-\${value}\`}
                    value={value}
                    defaultChecked={value === "releases"}
                />
                <Text as="label" htmlFor={\`success-\${value}\`}>
                    {label}
                </Text>
            </Stack>
        ))}
        <CheckboxGroup.Validation variant="success">That works</CheckboxGroup.Validation>
    </CheckboxGroup>
</Stack>`;

// A question that is not to be answered at all. The group speaks for every box in it, so it is
// turned off once rather than box by box, and the name is quieted with them so the whole question
// reads as unavailable rather than only the answers
const disabledPreview = (
    <CheckboxGroupComponent disabled>
        <CheckboxGroupComponent.Label>Notify me about</CheckboxGroupComponent.Label>
        {boxes("disabled", ["releases"])}
    </CheckboxGroupComponent>
);

const disabledCode = `<CheckboxGroup disabled>
    <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Checkbox
                id={\`disabled-\${value}\`}
                value={value}
                defaultChecked={value === "releases"}
            />
            <Text as="label" htmlFor={\`disabled-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</CheckboxGroup>`;

// What has been answered, reported as it changes. The group hands back every box that is ticked
// rather than the one that was just pressed, so what the answers come to is read in one place
// instead of being gathered up by whoever is listening.
//
// It is a component of its own rather than an element the page holds ready, since the answers have
// to be kept somewhere to be shown; the group starts from the boxes that are already ticked, so
// what is read here is right before anything is pressed
const ReportedPreview = () => {
    const [selected, setSelected] = React.useState(["releases"]);

    return (
        <CheckboxGroupComponent onChange={setSelected}>
            <CheckboxGroupComponent.Label>Notify me about</CheckboxGroupComponent.Label>
            <CheckboxGroupComponent.Caption>
                Chosen: {selected.join(", ") || "nothing"}
            </CheckboxGroupComponent.Caption>
            {boxes("reported", ["releases"])}
        </CheckboxGroupComponent>
    );
};

// What the example has to have in hand. The group says what has been answered rather than keeping
// it for the caller, so the answers are the caller's and are got ready here
const reportedSetup = `${choicesSetup}

const [selected, setSelected] = React.useState(["releases"]);`;

const reportedCode = `<CheckboxGroup onChange={setSelected}>
    <CheckboxGroup.Label>Notify me about</CheckboxGroup.Label>
    <CheckboxGroup.Caption>Chosen: {selected.join(", ") || "nothing"}</CheckboxGroup.Caption>
    {choices.map(({ value, label }) => (
        <Stack key={value} direction="horizontal" gap="condensed" align="start">
            <Checkbox
                id={\`reported-\${value}\`}
                value={value}
                defaultChecked={value === "releases"}
            />
            <Text as="label" htmlFor={\`reported-\${value}\`}>
                {label}
            </Text>
        </Stack>
    ))}
</CheckboxGroup>`;

// The group as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what can be said about the question, then what the group is left in, and last who
// hears the answers
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: choicesSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A line under the name",
        description:
            "What the question needs saying about it that the name alone does not. It stands in the legend beside the name, so a reader being read to hears it as part of what the group is called rather than coming upon it after the boxes.",
        setup: choicesSetup,
        preview: captionPreview,
        code: captionCode,
    },
    {
        name: "A name that is only read out",
        description:
            "The name kept as what the group is called while taken off the screen, for a question whose words are already said by whatever the group stands under. It is a hidden name rather than no name: a set of boxes nothing names is one a reader is read the answers to without ever being told the question.",
        setup: choicesSetup,
        preview: hiddenLabelPreview,
        code: hiddenLabelCode,
    },
    {
        name: "Required",
        description:
            "A question that has to be answered. The name is marked with a star for a reader looking at it and the legend carries the word itself for one being read to, so neither is left to take the requirement from the other. Every box in the group is marked required along with it.",
        setup: choicesSetup,
        preview: requiredPreview,
        code: requiredCode,
    },
    {
        name: "Validation",
        description:
            "What the answers are worth, said under the boxes rather than beside any one of them, since what is right or wrong is the answer to the question rather than any single box. The message describes the group, so it is read out when a reader arrives at the boxes rather than only when they reach the end of them, and it carries a mark as well as a colour.",
        setup: choicesSetup,
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Disabled",
        description:
            "A question that is not to be answered at all. The group speaks for every box in it, so it is turned off once rather than box by box, and the name is quieted with them — the whole question reads as unavailable rather than only the answers to it. A box that was ticked before it was turned off keeps its answer.",
        setup: choicesSetup,
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "The answers, reported",
        description:
            "Every box that is ticked, handed back whenever any of them changes, so what the answers come to is read in one place rather than gathered up by whoever is listening. The group starts from the boxes that are already ticked, so the first thing it reports is not the first thing it knows. It finds them however deeply they are wrapped, and a box keeps its own handler as well as calling the group's.",
        setup: reportedSetup,
        preview: <ReportedPreview />,
        code: reportedCode,
    },
];

// What the message is saying about the answers, which settles its colour and the mark beside it
const validationVariant = '"error" | "success"';

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
    default: '"fieldset"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the group and its parts take, under the one that takes it. What the group is left in
// comes first, then who hears the answers, and after those the parts that name the question and say
// what the answers are worth
const groups: ComponentPropGroup[] = [
    {
        name: "CheckboxGroup",
        props: [
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops every box in the group being used, and quiets the name with them, so the whole question reads as unavailable rather than only the answers to it",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires the question to be answered. The name is marked with a star and the legend carries the word itself, so neither a reader looking at it nor one being read to is left to take the requirement from the other",
            },
            {
                name: "onChange",
                type: "(selected: string[], event?: React.ChangeEvent<HTMLInputElement>) => void",
                description:
                    "Called with the value of every box that is ticked whenever any of them changes, and with the event that brought it about. The group starts from the boxes that are already ticked and finds them however deeply they are wrapped; a box keeps its own handler as well",
            },
            {
                name: "aria-labelledby",
                type: "string",
                description:
                    "Names the group by whatever on the page already says what it is, for a group given no label of its own. A group carrying a label is named by that instead",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "CheckboxGroup.Label",
        props: [
            {
                name: "visuallyHidden",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the name as what the group is called while taking it off the screen, for a question whose words are already said by whatever the group stands under",
            },
            styling,
        ],
    },
    {
        name: "CheckboxGroup.Caption",
        props: [styling],
    },
    {
        name: "CheckboxGroup.Validation",
        props: [
            {
                name: "variant",
                type: validationVariant,
                required: true,
                description:
                    "What the message is saying about the answers, which settles its colour and the mark that stands before it, so what it says is not left to the colour alone",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the group is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const CheckboxGroup = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                CheckboxGroup
            </Heading>
            <Text as="p" size="large">
                A set of checkboxes named as one question. It is drawn as a fieldset with the name
                in its legend, so a reader being read to hears what the boxes are a set of before
                they hear the boxes, and one who arrives at a box part way down can ask what it
                belongs to. The group hands back every box that is ticked rather than the one that
                was just pressed, so what the answers come to is read in one place; it finds them
                however deeply they are wrapped, and a box keeps its own handler as well as calling
                the group's.
            </Text>
        </Stack>
        <ComponentExamples component="CheckboxGroup" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default CheckboxGroup;
