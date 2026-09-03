import {
    Heading,
    NativeSelect as NativeSelectComponent,
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
    // A field told to fill what holds it has to be given something to fill, and across the whole of
    // the card it would run the width of the page. It is given a column instead
    preview: "w-[20rem]",
};

// What every example is a choice between. It is written once and read out into each of them, since
// what they are about is the field rather than what happens to be in it
const choices = (
    <>
        <NativeSelectComponent.Option value="one">Choice one</NativeSelectComponent.Option>
        <NativeSelectComponent.Option value="two">Choice two</NativeSelectComponent.Option>
        <NativeSelectComponent.Option value="three">Choice three</NativeSelectComponent.Option>
    </>
);

// The plainest field there is: the choices in it, and nothing said with a prop. It is the browser's
// own select underneath, drawn to the library's scale, so it opens the way a reader's own platform
// opens one rather than the way a page decided it should.
//
// The words above it are a label pointed at the field rather than text set down over it, so the
// words answer the pointer as the field does and are read out with it.
//
// The stack is part of what is being shown rather than the page's own furniture, since a field
// standing without the words saying what it is for is not a field anybody could fill in.
//
// The page and the component it is about are both called NativeSelect, so the component is brought
// in under a name saying which of the two it is. The listing beneath says NativeSelect, as an
// application importing it would
const defaultPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="default-choice">
            Choice
        </Text>
        <NativeSelectComponent id="default-choice">{choices}</NativeSelectComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="default-choice">
        Choice
    </Text>
    <NativeSelect id="default-choice">
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
    </NativeSelect>
</Stack>`;

// Words standing in the field until a choice is made. They are drawn as the first option rather
// than written over the field, since a select shows whichever option is current and has nowhere
// else to put them
const placeholderPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="placeholder-choice">
            Choice
        </Text>
        <NativeSelectComponent id="placeholder-choice" placeholder="Pick a choice">
            {choices}
        </NativeSelectComponent>
    </Stack>
);

const placeholderCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="placeholder-choice">
        Choice
    </Text>
    <NativeSelect id="placeholder-choice" placeholder="Pick a choice">
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
    </NativeSelect>
</Stack>`;

// The same placeholder on a field that has to be answered. It stands in until a choice is made and
// then cannot be gone back to, since a field that must be filled has no empty answer to offer
const requiredPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="required-choice">
            Choice
        </Text>
        <NativeSelectComponent id="required-choice" placeholder="Pick a choice" required>
            {choices}
        </NativeSelectComponent>
    </Stack>
);

const requiredCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="required-choice">
        Choice
    </Text>
    <NativeSelect id="required-choice" placeholder="Pick a choice" required>
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
    </NativeSelect>
</Stack>`;

// Choices gathered under headings of their own, for a list long enough that a reader would
// otherwise be reading through it rather than looking down it
const groupedPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="grouped-choice">
            Choice
        </Text>
        <NativeSelectComponent id="grouped-choice">
            <NativeSelectComponent.OptGroup label="Group one">
                <NativeSelectComponent.Option value="one">Choice one</NativeSelectComponent.Option>
                <NativeSelectComponent.Option value="two">Choice two</NativeSelectComponent.Option>
            </NativeSelectComponent.OptGroup>
            <NativeSelectComponent.OptGroup label="Group two">
                <NativeSelectComponent.Option value="three">
                    Choice three
                </NativeSelectComponent.Option>
                <NativeSelectComponent.Option value="four">
                    Choice four
                </NativeSelectComponent.Option>
            </NativeSelectComponent.OptGroup>
        </NativeSelectComponent>
    </Stack>
);

const groupedCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="grouped-choice">
        Choice
    </Text>
    <NativeSelect id="grouped-choice">
        <NativeSelect.OptGroup label="Group one">
            <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
            <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        </NativeSelect.OptGroup>
        <NativeSelect.OptGroup label="Group two">
            <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
            <NativeSelect.Option value="four">Choice four</NativeSelect.Option>
        </NativeSelect.OptGroup>
    </NativeSelect>
</Stack>`;

// How much room the field takes. The three are drawn together rather than one to an example, since
// a size is read against the others rather than on its own, and each is named for the size it was
// given so what is read off the label is the value that drew it.
//
// The smaller two come out the same height, since what the small field holds already fills the
// height a medium one is held to; what tells them apart is the type they are set in
const sizesPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="small-choice">
                small
            </Text>
            <NativeSelectComponent id="small-choice" size="small">
                {choices}
            </NativeSelectComponent>
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="medium-choice">
                medium
            </Text>
            <NativeSelectComponent id="medium-choice" size="medium">
                {choices}
            </NativeSelectComponent>
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="large-choice">
                large
            </Text>
            <NativeSelectComponent id="large-choice" size="large">
                {choices}
            </NativeSelectComponent>
        </Stack>
    </Stack>
);

const sizesCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="small-choice">
            small
        </Text>
        <NativeSelect id="small-choice" size="small">
            <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        </NativeSelect>
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="medium-choice">
            medium
        </Text>
        <NativeSelect id="medium-choice" size="medium">
            <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        </NativeSelect>
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="large-choice">
            large
        </Text>
        <NativeSelect id="large-choice" size="large">
            <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        </NativeSelect>
    </Stack>
</Stack>`;

// The field drawn to the width of whatever holds it rather than to the longest choice in it. It is
// what a field standing in a form or in a column of its own is given, where one drawn to its
// content would be read as narrower than everything it stands under
const blockPreview = (
    <Stack gap="condensed" className={classes.preview}>
        <Text as="label" htmlFor="block-choice">
            Choice
        </Text>
        <NativeSelectComponent id="block-choice" block>
            {choices}
        </NativeSelectComponent>
    </Stack>
);

const blockCode = `<Stack gap="condensed">
    <Text as="label" htmlFor="block-choice">
        Choice
    </Text>
    <NativeSelect id="block-choice" block>
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
    </NativeSelect>
</Stack>`;

// What the field says about the answer it holds. The two are drawn together since what tells them
// apart is the colour each is drawn in, which is read against the other rather than on its own
const validationPreview = (
    <Stack gap="normal">
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="error-choice">
                Choice
            </Text>
            <NativeSelectComponent id="error-choice" validationStatus="error">
                {choices}
            </NativeSelectComponent>
        </Stack>
        <Stack gap="condensed" align="start">
            <Text as="label" htmlFor="success-choice">
                Choice
            </Text>
            <NativeSelectComponent id="success-choice" validationStatus="success">
                {choices}
            </NativeSelectComponent>
        </Stack>
    </Stack>
);

const validationCode = `<Stack gap="normal">
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="error-choice">
            Choice
        </Text>
        <NativeSelect id="error-choice" validationStatus="error">
            <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        </NativeSelect>
    </Stack>
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="success-choice">
            Choice
        </Text>
        <NativeSelect id="success-choice" validationStatus="success">
            <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        </NativeSelect>
    </Stack>
</Stack>`;

// A choice that cannot be made. The field goes on showing what it holds, since an answer that
// cannot be changed is still one worth reading
const disabledPreview = (
    <Stack gap="condensed" align="start">
        <Text as="label" htmlFor="disabled-choice">
            Choice
        </Text>
        <NativeSelectComponent id="disabled-choice" disabled>
            {choices}
        </NativeSelectComponent>
    </Stack>
);

const disabledCode = `<Stack gap="condensed" align="start">
    <Text as="label" htmlFor="disabled-choice">
        Choice
    </Text>
    <NativeSelect id="disabled-choice" disabled>
        <NativeSelect.Option value="one">Choice one</NativeSelect.Option>
        <NativeSelect.Option value="two">Choice two</NativeSelect.Option>
        <NativeSelect.Option value="three">Choice three</NativeSelect.Option>
    </NativeSelect>
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
        name: "Placeholder",
        description:
            "Words standing in the field until a choice is made. They are drawn as the first option rather than written over the field, since a select shows whichever option is current and has nowhere else to put them. Left choosable, so a reader can go back to having answered nothing.",
        preview: placeholderPreview,
        code: placeholderCode,
    },
    {
        name: "Required with a placeholder",
        description:
            "The same placeholder on a field that has to be answered. It stands in until a choice is made and is then taken out of the list, since a field that must be filled has no empty answer to offer, and a reader who has answered cannot go back to not having done so.",
        preview: requiredPreview,
        code: requiredCode,
    },
    {
        name: "Grouped options",
        description:
            "Choices gathered under headings of their own, for a list long enough that a reader would otherwise be reading through it rather than looking down it. The headings are the browser's own, so they are drawn and read out the way that reader's platform draws and reads them.",
        preview: groupedPreview,
        code: groupedCode,
    },
    {
        name: "Sizes",
        description:
            "How much room the field takes, and what its choices are set in. It is the scale the rest of the library's controls are held on, so a field standing beside a button is told the same size as the button. The smaller two come out the same height and are told apart by the type; large is set in the same type as medium and given more room around it.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Block",
        description:
            "Whether the field is drawn to the longest choice in it or to the width of whatever holds it. It is what a field at the foot of a form or in a column of its own is given, where one drawn to its content would be read as narrower than everything it stands under.",
        preview: blockPreview,
        code: blockCode,
    },
    {
        name: "Validation status",
        description:
            "What the field says about the answer it holds. Error colours the border and marks the control invalid, so it is said to a screen reader as well as shown; success only colours it, since there is nothing wrong to report. Neither carries the message itself, which is for the field around it to give.",
        preview: validationPreview,
        code: validationCode,
    },
    {
        name: "Disabled",
        description:
            "A choice that cannot be made. The field is taken out of the tab order the way a disabled control is and what it holds is not submitted, so it is for a choice that is not available just now rather than one that is only to be read.",
        preview: disabledPreview,
        code: disabledCode,
    },
];

// How tall the field is drawn
const size = '"small" | "medium" | "large"';

// What the field says about the answer it holds
const validationStatus = '"error" | "success"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the field and its parts take, under the part that takes it.
//
// The field comes first, since everything about how it is drawn is settled there; the option and
// the group follow, since what they are for is said by where they are written rather than by
// anything much they are told
const groups: ComponentPropGroup[] = [
    {
        name: "NativeSelect",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How much room the field takes and what its choices are set in. It is the scale the rest of the library's controls are held on. The smaller two come out the same height and are told apart by the type; large is set in the same type as medium and given more room around it. The element's own size attribute takes a row count and means something else, so it is not taken here",
            },
            {
                name: "placeholder",
                type: "string",
                description:
                    "Words standing in the field until a choice is made, drawn as the first option rather than written over the field. Given alongside required it is taken out of the list once a choice has been made, since a field that must be filled has no empty answer to offer",
            },
            {
                name: "block",
                type: "boolean",
                default: "false",
                description:
                    "Fills the width of whatever holds it, in place of being drawn to the longest choice in it",
            },
            {
                name: "validationStatus",
                type: validationStatus,
                description:
                    "What the field says about the answer it holds. Error colours the border and marks the control invalid, so it is said to a screen reader as well as shown; success only colours it",
            },
            {
                name: "required",
                type: "boolean",
                default: "false",
                description:
                    "Requires a choice before the form can be submitted. With a placeholder given, it is what takes that placeholder out of the list once it has been left",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description:
                    "Stops the choice being made and takes the field out of the tab order, and what it holds is not submitted",
            },
            styling,
            {
                name: "...select props",
                type: 'React.ComponentPropsWithoutRef<"select">',
                description:
                    "It is the browser's own select underneath, so it takes what one takes. Multiple is not among them, since a list box cannot carry this styling, and neither is the element's own size",
            },
        ],
    },
    {
        name: "NativeSelectOption",
        props: [
            {
                name: "value",
                type: "string",
                required: true,
                description:
                    "What the choice comes back as on submission, which is the whole of what an option is for",
            },
            styling,
        ],
    },
    {
        name: "NativeSelectOptGroup",
        props: [
            {
                name: "label",
                type: "string",
                description:
                    "The heading the choices beneath it are gathered under. It is the element's own, so it is drawn and read out the way the reader's platform draws and reads it",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the field is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const NativeSelect = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                NativeSelect
            </Heading>
            <Text as="p" size="large">
                One choice out of a list, drawn as the browser's own select. It opens the way the
                reader's platform opens one rather than the way a page decided it should, which is
                what makes it the one to reach for on a phone and wherever a list is only a list.
                The library draws the field around it and the chevron beside it; everything inside
                is the browser's.
            </Text>
        </Stack>
        <ComponentExamples component="NativeSelect" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default NativeSelect;
