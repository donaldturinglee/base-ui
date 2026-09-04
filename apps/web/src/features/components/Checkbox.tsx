import * as React from "react";
import { Checkbox as CheckboxComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
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

// The plainest checkbox there is: the box, and the words it stands for beside it. It is given a
// value, which is what it comes back as on submission and, where it is given no name of its own,
// what it comes back under.
//
// The words are a label pointed at the box rather than text set down next to it, so that the words
// answer the pointer as the box does and are read out with it. A checkbox is small, and one that
// can only be hit on the box itself is a poor target.
//
// The stack is part of what is being shown rather than the page's own furniture, since a checkbox
// standing without the words it is a choice of is not a checkbox anybody could use. The two are
// held to the start rather than the middle, because the box is set to stand against the first line
// of the words beside it and a label running on to a second would carry it down.
//
// The page and the component it is about are both called Checkbox, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Checkbox, as an application
// importing it would
const defaultPreview = (
    <Stack direction="horizontal" gap="condensed" align="start">
        <CheckboxComponent id="default-releases" value="releases" />
        <Text as="label" htmlFor="default-releases">
            New releases
        </Text>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack direction="horizontal" gap="condensed" align="start">
    <Checkbox id="default-releases" value="releases" />
    <Text as="label" htmlFor="default-releases">
        New releases
    </Text>
</Stack>`;

// A box that starts out checked. It is still keeping its own state, so it is answered from the box
// itself rather than from outside
const checkedPreview = (
    <Stack direction="horizontal" gap="condensed" align="start">
        <CheckboxComponent id="checked-releases" value="releases" defaultChecked />
        <Text as="label" htmlFor="checked-releases">
            New releases
        </Text>
    </Stack>
);

const checkedCode = `<Stack direction="horizontal" gap="condensed" align="start">
    <Checkbox id="checked-releases" value="releases" defaultChecked />
    <Text as="label" htmlFor="checked-releases">
        New releases
    </Text>
</Stack>`;

// The third state a checkbox can be put in, and the one thing it is for: a box standing over a set
// where some but not all of it is taken. It is not a state a box is clicked into — nothing the
// browser does leaves a box part checked — so it is worked out from the set and handed down, which
// makes the state the caller's and this a component of its own rather than an element the page
// holds ready.
//
// The box over the set answers for the whole of it and so has no value to submit; the ones beneath
// it do, and are set in from the start to say that they are what it stands for
const PartCheckedPreview = () => {
    const [selected, setSelected] = React.useState(["releases"]);
    const allChecked = selected.length === choices.length;

    return (
        <Stack gap="condensed">
            <Stack direction="horizontal" gap="condensed" align="start">
                <CheckboxComponent
                    id="part-all"
                    checked={allChecked}
                    indeterminate={selected.length > 0 && !allChecked}
                    onChange={(event) =>
                        setSelected(
                            event.currentTarget.checked ? choices.map(({ value }) => value) : [],
                        )
                    }
                />
                <Text as="label" htmlFor="part-all">
                    Everything
                </Text>
            </Stack>
            <Stack gap="condensed" paddingInline="normal">
                {choices.map(({ value, label }) => (
                    <Stack key={value} direction="horizontal" gap="condensed" align="start">
                        <CheckboxComponent
                            id={`part-${value}`}
                            value={value}
                            checked={selected.includes(value)}
                            onChange={(event) =>
                                setSelected(
                                    event.currentTarget.checked
                                        ? [...selected, value]
                                        : selected.filter(
                                              (selectedValue) => selectedValue !== value,
                                          ),
                                )
                            }
                        />
                        <Text as="label" htmlFor={`part-${value}`}>
                            {label}
                        </Text>
                    </Stack>
                ))}
            </Stack>
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn: the choices being offered, what has
// been taken of them, which the boxes are told rather than keep, and whether that is all of them,
// which is what the box over the set is checked by
const partCheckedSetup = `const choices = [
    { value: "releases", label: "New releases" },
    { value: "mentions", label: "Mentions" },
    { value: "digest", label: "Weekly digest" },
];

const [selected, setSelected] = React.useState(["releases"]);
const allChecked = selected.length === choices.length;`;

const partCheckedCode = `<Stack gap="condensed">
    <Stack direction="horizontal" gap="condensed" align="start">
        <Checkbox
            id="part-all"
            checked={allChecked}
            indeterminate={selected.length > 0 && !allChecked}
            onChange={(event) =>
                setSelected(event.currentTarget.checked ? choices.map(({ value }) => value) : [])
            }
        />
        <Text as="label" htmlFor="part-all">
            Everything
        </Text>
    </Stack>
    <Stack gap="condensed" paddingInline="normal">
        {choices.map(({ value, label }) => (
            <Stack key={value} direction="horizontal" gap="condensed" align="start">
                <Checkbox
                    id={\`part-\${value}\`}
                    value={value}
                    checked={selected.includes(value)}
                    onChange={(event) =>
                        setSelected(
                            event.currentTarget.checked
                                ? [...selected, value]
                                : selected.filter((selectedValue) => selectedValue !== value),
                        )
                    }
                />
                <Text as="label" htmlFor={\`part-\${value}\`}>
                    {label}
                </Text>
            </Stack>
        ))}
    </Stack>
</Stack>`;

// A choice that cannot be made. All three are drawn together because what a disabled box looks like
// depends on where it was left: one that was never checked, one that was, and one standing over a
// part checked set are the same control in three states, and only the three together say what the
// state does to each
const disabledPreview = (
    <Stack gap="condensed">
        <Stack direction="horizontal" gap="condensed" align="start">
            <CheckboxComponent id="disabled-releases" value="releases" disabled />
            <Text as="label" htmlFor="disabled-releases">
                Unchecked
            </Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="start">
            <CheckboxComponent id="disabled-mentions" value="mentions" disabled defaultChecked />
            <Text as="label" htmlFor="disabled-mentions">
                Checked
            </Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="start">
            <CheckboxComponent id="disabled-digest" value="digest" disabled indeterminate />
            <Text as="label" htmlFor="disabled-digest">
                Part checked
            </Text>
        </Stack>
    </Stack>
);

const disabledCode = `<Stack gap="condensed">
    <Stack direction="horizontal" gap="condensed" align="start">
        <Checkbox id="disabled-releases" value="releases" disabled />
        <Text as="label" htmlFor="disabled-releases">
            Unchecked
        </Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="start">
        <Checkbox id="disabled-mentions" value="mentions" disabled defaultChecked />
        <Text as="label" htmlFor="disabled-mentions">
            Checked
        </Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="start">
        <Checkbox id="disabled-digest" value="digest" disabled indeterminate />
        <Text as="label" htmlFor="disabled-digest">
            Part checked
        </Text>
    </Stack>
</Stack>`;

// The two things a checkbox says about itself that it does not draw: that it has to be checked, and
// that what it was left at will not do. Neither marks the box, since a single checkbox carries no
// validation of its own — the group around it is what a reader is told is wrong, and what is said
// here is said to a screen reader rather than shown
const validationPreview = (
    <Stack gap="condensed">
        <Stack direction="horizontal" gap="condensed" align="start">
            <CheckboxComponent id="required-terms" value="terms" required />
            <Text as="label" htmlFor="required-terms">
                I have read the terms
            </Text>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="start">
            <CheckboxComponent id="invalid-terms" value="terms" required validationStatus="error" />
            <Text as="label" htmlFor="invalid-terms">
                I have read the terms
            </Text>
        </Stack>
    </Stack>
);

const validationCode = `<Stack gap="condensed">
    <Stack direction="horizontal" gap="condensed" align="start">
        <Checkbox id="required-terms" value="terms" required />
        <Text as="label" htmlFor="required-terms">
            I have read the terms
        </Text>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="start">
        <Checkbox id="invalid-terms" value="terms" required validationStatus="error" />
        <Text as="label" htmlFor="invalid-terms">
            I have read the terms
        </Text>
    </Stack>
</Stack>`;

// The checkbox as it is reached for, drawn and written out one above the other. The plainest one
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
            "A box that starts out checked. It is read once, so a box started this way is answered by whoever is using it rather than from outside.",
        preview: checkedPreview,
        code: checkedCode,
    },
    {
        name: "Part checked",
        description:
            "A box standing over a set where some but not all of it is taken. It is drawn as a dash rather than a tick and reads as mixed, and it is the one state nothing the browser does can leave a box in: it is worked out from the set and handed down, so a part checked box is one whose state the caller is holding. Checked and part checked are never both true at once, whatever the box is told.",
        setup: partCheckedSetup,
        preview: <PartCheckedPreview />,
        code: partCheckedCode,
    },
    {
        name: "Disabled",
        description:
            "A choice that cannot be made. It is taken out of the tab order the way a disabled input is, and what it holds is not submitted, so it is for a choice that is not available just now rather than one that is only to be read. All three are drawn together because a disabled box that was checked, one that was not, and one standing over a part checked set are the same control saying different things.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Required and invalid",
        description:
            "The two things a checkbox says about itself that it does not draw. Neither marks the box: a single checkbox carries no validation of its own, and the group around it is what a reader is told is wrong, so what is said here is said to a screen reader rather than shown. Nothing looks different between these two and the plainest example above, which is the point of them.",
        preview: validationPreview,
        code: validationCode,
    },
];

// What the checkbox says about the state it was left in. It only informs the ARIA attributes, since
// a single checkbox carries no validation styling of its own
const validationStatus = '"error" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the checkbox takes. It is the browser's own checkbox underneath rather than a control
// drawn out of parts, so there is the one table, and everything an input takes it takes as well.
//
// What the box is called comes first, since that is what it answers with and under; where it stands
// follows, then the states it can be left in, and last what it says about them
const groups: ComponentPropGroup[] = [
    {
        name: "Checkbox",
        props: [
            {
                name: "value",
                type: "string",
                default: '"on"',
                description:
                    "Identifies the box on submission and in its group's selection. The default is the browser's own rather than the checkbox's, so a box given none is still submitted while it is checked, under a name it has to have been given",
            },
            {
                name: "name",
                type: "string",
                description:
                    "The name the value is submitted under. It falls back to the value where it is left out, so a box given only a value comes back under it; a set of boxes answering the one question is given the one name and told apart by their values",
            },
            {
                name: "checked",
                type: "boolean",
                description:
                    "Whether the box is checked, where the state is held by whoever is drawing it rather than by the control. Given this, the box is told where it stands and says nothing on its own, so it wants an onChange to answer through",
            },
            {
                name: "defaultChecked",
                type: "boolean",
                default: "false",
                description:
                    "Where the box starts out, for one that keeps its own state. It is read once, so a box started this way is answered from the control rather than from outside",
            },
            {
                name: "indeterminate",
                type: "boolean",
                default: "false",
                description:
                    "Draws a dash in place of the tick and reads as mixed. It stands for a set beneath the box that is part taken rather than for anything the box itself was clicked into, so it is worked out from that set and handed down. A box that is part checked is never also checked",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the choice being made and takes the box out of the tab order, and what it holds is not submitted",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires the box to be checked before the form can be submitted. It marks the box as required to a screen reader as well, and draws nothing of its own",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the checkbox says about the state it was left in. It only informs the ARIA attributes, and only for an error at that: a single checkbox carries no validation styling of its own, and the group around it is what carries the marking a reader sees",
            },
            {
                name: "onChange",
                type: "React.ChangeEventHandler<HTMLInputElement>",
                description:
                    "Called when the box is checked or unchecked. A box standing in a CheckboxGroup calls the group's handler as well as this one, so the group hears the answer without the box having to be told about it",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the checkbox is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Checkbox = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Checkbox
            </Heading>
            <Text as="p" size="large">
                One thing taken or left, on its own or as one of a set where any number of them can
                be taken at once. It is the browser's own checkbox underneath, so the checking, the
                tab stop and the submitting are the browser's doing, and what comes back is the
                value of every box that was checked. Beside taken and left it has a third state,
                which says nothing about the box itself: it stands for a set beneath it that is part
                taken.
            </Text>
        </Stack>
        <ComponentExamples component="Checkbox" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Checkbox;
