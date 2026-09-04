import { Heading, Stack, Text, Textarea as TextareaComponent } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A field told to fill what holds it has to be given something to fill, and across the whole of
    // the card it would run the width of the page. It is given a column instead
    preview: "w-[20rem]",
};

// The plainest field there is: nothing said with a prop, so it comes to the seven lines by thirty
// characters the library falls back to, draggable on both axes. It starts at the size it was told
// rather than growing as it is filled, since a field that moved the page under the reader as they
// typed would take the line they were writing with it.
//
// The words above it are a label pointed at the field rather than text set down over it, so the
// words answer the pointer as the field does and are read out with it.
//
// The stack is part of what is being shown rather than the page's own furniture, since a field
// standing without the words saying what it is for is not a field anybody could fill in. It is set
// against the start of the column, since the field is drawn to the width it was told and a stack
// left to itself would pull it out to the width of the card.
//
// The page and the component it is about are both called Textarea, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Textarea, as an application
// importing it would
const defaultPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-notes">
            Notes
        </Text>
        <TextareaComponent id="default-notes" />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="default-notes">
        Notes
    </Text>
    <Textarea id="default-notes" />
</Stack>`;

// Which axes the reader can drag the field along. The four are drawn together rather than one to an
// example, since what a corner will do is only learnt by taking hold of it, and each is named for
// the value it was given so what is read off the label is what drew it.
//
// The handle is the browser's own, drawn in the corner of the control rather than by the library,
// so a field that can only be dragged one way still shows it
const resizePreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="none-notes">
                none
            </Text>
            <TextareaComponent id="none-notes" resize="none" rows={3} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="both-notes">
                both
            </Text>
            <TextareaComponent id="both-notes" resize="both" rows={3} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="horizontal-notes">
                horizontal
            </Text>
            <TextareaComponent id="horizontal-notes" resize="horizontal" rows={3} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="vertical-notes">
                vertical
            </Text>
            <TextareaComponent id="vertical-notes" resize="vertical" rows={3} />
        </Stack>
    </Stack>
);

const resizeCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="none-notes">
            none
        </Text>
        <Textarea id="none-notes" resize="none" rows={3} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="both-notes">
            both
        </Text>
        <Textarea id="both-notes" resize="both" rows={3} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="horizontal-notes">
            horizontal
        </Text>
        <Textarea id="horizontal-notes" resize="horizontal" rows={3} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="vertical-notes">
            vertical
        </Text>
        <Textarea id="vertical-notes" resize="vertical" rows={3} />
    </Stack>
</Stack>`;

// How far the reader is allowed to drag. The field is left draggable up and down and held between
// the two, so a reader who wants more room has it and a form that was laid out around this field
// keeps its shape.
//
// Nothing is said about how tall it starts, so it opens at the seven lines the library falls back
// to and the ceiling brings it back under, which is what a field given a maximum shorter than its
// own rows does
const heightPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="height-notes">
            Notes
        </Text>
        <TextareaComponent id="height-notes" minHeight={80} maxHeight={160} resize="vertical" />
    </Stack>
);

const heightCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="height-notes">
        Notes
    </Text>
    <Textarea id="height-notes" minHeight={80} maxHeight={160} resize="vertical" />
</Stack>`;

// The field drawn to the width of whatever holds it rather than to the thirty characters it was
// told. It is what a field standing in a form or in a column of its own is given, where one drawn
// to its own measure would be read as narrower than everything it stands under.
//
// The column it is given to fill is the page's own furniture: across the whole of the card the
// field would run the width of the page, which shows nothing a wide field does not. The stack is
// left to stretch rather than set against the start, since a field asked to fill what holds it has
// first to be let
const blockPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <Text as="label" htmlFor="block-notes">
            Notes
        </Text>
        <TextareaComponent id="block-notes" block rows={3} />
    </Stack>
);

const blockCode = `<Stack gap="condensed">
    <Text as="label" htmlFor="block-notes">
        Notes
    </Text>
    <Textarea id="block-notes" block rows={3} />
</Stack>`;

// The field recessed against what it stands on rather than raised off it. It is for a surface that
// is already raised, where a field drawn in the page's own colour would be lost in the card around
// it
const contrastPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="contrast-notes">
            Notes
        </Text>
        <TextareaComponent id="contrast-notes" contrast rows={3} />
    </Stack>
);

const contrastCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="contrast-notes">
        Notes
    </Text>
    <Textarea id="contrast-notes" contrast rows={3} />
</Stack>`;

// What the field says about what it holds. The two are drawn together since what tells them apart
// is the colour each is drawn in, which is read against the other rather than on its own
const validationPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="error-notes">
                Notes
            </Text>
            <TextareaComponent id="error-notes" validationStatus="error" rows={3} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="success-notes">
                Notes
            </Text>
            <TextareaComponent id="success-notes" validationStatus="success" rows={3} />
        </Stack>
    </Stack>
);

const validationCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="error-notes">
            Notes
        </Text>
        <Textarea id="error-notes" validationStatus="error" rows={3} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="success-notes">
            Notes
        </Text>
        <Textarea id="success-notes" validationStatus="success" rows={3} />
    </Stack>
</Stack>`;

// A field that cannot be written in. It goes on showing what it holds, since words that cannot be
// changed are still worth reading, and the corner stops answering with them: there is nothing to
// make room for
const disabledPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="disabled-notes">
            Notes
        </Text>
        <TextareaComponent
            id="disabled-notes"
            disabled
            rows={3}
            defaultValue="You cannot change this"
        />
    </Stack>
);

const disabledCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="disabled-notes">
        Notes
    </Text>
    <Textarea id="disabled-notes" disabled rows={3} defaultValue="You cannot change this" />
</Stack>`;

// How much room is left, counted down under the field. The second one is already past its limit,
// which is the state the counter is worth showing in: it turns and takes a mark, and the field
// marks itself invalid the way an error status would.
//
// The count is only ever shown, never read out where it stands. What a screen reader is told is the
// limit as the field is reached, and then the count again once the reader stops typing, so it is
// not read a character at a time as the words are being written
const limitPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="limit-notes">
                Notes
            </Text>
            <TextareaComponent id="limit-notes" characterLimit={50} rows={3} />
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="over-notes">
                Notes
            </Text>
            <TextareaComponent
                id="over-notes"
                characterLimit={10}
                rows={3}
                defaultValue="This is rather longer than the limit allows"
            />
        </Stack>
    </Stack>
);

const limitCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="limit-notes">
            Notes
        </Text>
        <Textarea id="limit-notes" characterLimit={50} rows={3} />
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="over-notes">
            Notes
        </Text>
        <Textarea
            id="over-notes"
            characterLimit={10}
            rows={3}
            defaultValue="This is rather longer than the limit allows"
        />
    </Stack>
</Stack>`;

// The field as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Resize",
        description:
            "Which axes the reader can drag the field along. The handle is the browser's own, drawn in the corner of the control, so a field that can only be dragged one way still shows it and simply refuses the other. None takes the corner away altogether, which is for a field whose height is the form's to settle rather than the reader's.",
        preview: resizePreview,
        code: resizeCode,
    },
    {
        name: "How far it can be dragged",
        description:
            "The floor and the ceiling a dragged field is held between, in pixels. A field left to itself can be pulled down to a single line or out past the foot of the page, and a form laid out around it loses its shape either way. Nothing is said here about how tall it starts, so it opens at the seven lines it falls back to and the ceiling brings it back under.",
        preview: heightPreview,
        code: heightCode,
    },
    {
        name: "Block",
        description:
            "Whether the field is drawn to the columns it was told or to the width of whatever holds it. It is what a field standing in a form or in a column of its own is given, where one drawn to its own measure would be read as narrower than everything it stands under. The column around it here is the page's own, since across the whole of the card a block field shows nothing a wide one does not.",
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Contrast",
        description:
            "The field recessed against what it stands on rather than raised off it. It is for a surface that is already raised — a card, a dialog, a panel — where a field drawn in the page's own colour would be lost in what surrounds it.",
        preview: contrastPreview,
        code: contrastCode,
    },
    {
        name: "Validation status",
        description:
            "What the field says about what it holds. Error colours the border and marks the control invalid, so it is said to a screen reader as well as shown; success only colours it, since there is nothing wrong to report. Neither carries the message itself, which is for the form around it to give.",
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Disabled",
        description:
            "A field that cannot be written in. It goes on showing what it holds, since words that cannot be changed are still worth reading, and the corner stops answering along with it. The field is taken out of the tab order and what it holds is not submitted, so it is for a field that is not available just now rather than one that is only to be read.",
        preview: disabledPreview,
        code: disabledCode,
    },
    {
        name: "Character limit",
        description:
            "How much room is left, counted down under the field. The second one is already past its limit, which is the state the counter is worth showing in: it turns, takes a mark, and the field marks itself invalid the way an error status would. The limit is not enforced — the reader is told rather than stopped, so a sentence half typed is never cut off mid-word.",
        preview: limitPreview,
        code: limitCode,
    },
];

// Which axes the reader can drag the field along
const resize = '"none" | "both" | "horizontal" | "vertical"';

// What the field says about what it holds
const validationStatus = '"error" | "success"';

// Every prop the field takes. It has no parts of its own: what it draws besides the control is the
// frame around it and the counter under it, and both are the field's own rather than anything a
// caller reaches for.
//
// How big it starts comes first, then how far it can be dragged from there, then how it is drawn
// against the page, then what it says about what it holds, and last what it is underneath
const groups: ComponentPropGroup[] = [
    {
        name: "Textarea",
        props: [
            {
                name: "rows",
                type: "number",
                default: "7",
                description:
                    "How tall the field starts, in lines. It is the element's own attribute, so it is a starting height rather than a limit: the reader can drag past it, and text longer than it scrolls within the field",
            },
            {
                name: "cols",
                type: "number",
                default: "30",
                description:
                    "How wide the field starts, in characters. It is what the field is drawn to where it has not been told to fill what holds it, and is left to the block prop where it has",
            },
            {
                name: "resize",
                type: resize,
                default: '"both"',
                description:
                    "Which axes the reader can drag the field along. The handle is the browser's own and is drawn in the corner whichever of these is given, so a field held to one axis still shows it and refuses the other. None takes it away altogether. A disabled field is not draggable whatever this says",
            },
            {
                name: "minHeight",
                type: "number",
                description:
                    "The shortest the field can be dragged to, in pixels. Without one a reader can pull it down to a single line, which is a form losing its shape rather than a reader making room",
            },
            {
                name: "maxHeight",
                type: "number",
                description:
                    "The tallest the field can be dragged to, in pixels. It holds a field that starts taller than this under it as well, so a maximum shorter than the rows it was given wins",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever holds it, in place of being drawn to the columns it was told",
            },
            {
                name: "contrast",
                type: "boolean",
                default: "false",
                description:
                    "Recesses the field against what it stands on rather than raising it off. It is for a surface that is already raised, where a field drawn in the page's own colour would be lost in what surrounds it",
            },
            {
                name: "characterLimit",
                type: "number",
                description:
                    "Shows a counter under the field, counting down to this and then up past it. Passing it is reported rather than prevented: the counter turns and the field marks itself invalid, but nothing is cut off. The count is shown rather than read out where it stands — a screen reader is told the limit as the field is reached, and the count again once the reader stops typing",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the field says about what it holds. Error colours the border and marks the control invalid, so it is said to a screen reader as well as shown; success only colours it. A limit that has been passed reports an error of its own, whatever this says",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires the field before the form can be submitted, and says so to a screen reader as well as to the form",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the field being written in and takes it out of the tab order, and what it holds is not submitted. It goes on showing what it holds and stops being draggable",
            },
            {
                name: "className",
                type: "string",
                description:
                    "Class name for custom styling. It lands on the frame around the control rather than on the control itself, since the frame is what carries the border, the ground and the focus ring",
            },
            {
                name: "...textarea props",
                type: 'React.ComponentPropsWithoutRef<"textarea">',
                description:
                    "It is the browser's own textarea underneath, so it takes what one takes: value and defaultValue, onChange, placeholder, name, readOnly, and the rest. Style lands on the control, alongside the two heights",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the field is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Textarea = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Textarea
            </Heading>
            <Text as="p" size="large">
                Somewhere to write more than a line. It is the browser&apos;s own textarea
                underneath: the frame around it, the focus ring and the counter under it are the
                library&apos;s, and everything within the frame is the browser&apos;s, including the
                corner the reader takes hold of to make room. It starts at the size it was told
                rather than growing as it is filled, since a field that moved the page under the
                reader as they typed would take the line they were writing with it.
            </Text>
        </Stack>
        <ComponentExamples component="Textarea" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Textarea;
