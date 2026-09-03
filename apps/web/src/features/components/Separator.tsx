import {
    Heading,
    Link,
    Separator as SeparatorComponent,
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
    // The line takes its colour through a custom property rather than off the class it came with,
    // so a caller repainting it sets the property rather than unpicking anything
    repainted: "[--separator-color:var(--border-color-accent-emphasis)]",
};

// What the example that repaints the line has to have in hand before it can be drawn. It is the
// property the stylesheet reads the colour from rather than the class it came with
const repaintedSetup = `const repainted = "[--separator-color:var(--border-color-accent-emphasis)]";`;

// The plainest line there is: nothing said with a prop, so it runs across at the weight a line is
// drawn at where nothing is claimed about it. It is drawn between two things rather than on its
// own, since a line with nothing either side of it is not separating anything, so what it stands
// between is part of what the example is showing and is written out with it.
//
// The sentences are the ones the library's own stories are marked up with, so what is read here and
// what is read there are the same words.
//
// The page and the component it is about are both called Separator, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Separator, as an application
// importing it would
const defaultPreview = (
    <Stack gap="normal">
        <Text as="p">Deleting this repository takes it away from everyone who can reach it.</Text>
        <SeparatorComponent />
        <Text as="p">Transferring it hands it on instead, along with everything on it.</Text>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Stack gap="normal">
    <Text as="p">Deleting this repository takes it away from everyone who can reach it.</Text>
    <Separator />
    <Text as="p">Transferring it hands it on instead, along with everything on it.</Text>
</Stack>`;

// How much weight the line carries. The three are drawn together rather than one to an example,
// since a weight is read against the others rather than on its own: apart they are three lines, and
// one under the other they are a scale.
//
// Each is named for the variant it was given, so what is read off the line is the value that drew
// it. There is nothing inside a line to write the name in, so it is set above each of them
const variantsPreview = (
    <Stack gap="normal">
        <Stack gap="condensed">
            <Text size="small">subtle</Text>
            <SeparatorComponent variant="subtle" />
        </Stack>
        <Stack gap="condensed">
            <Text size="small">default</Text>
            <SeparatorComponent variant="default" />
        </Stack>
        <Stack gap="condensed">
            <Text size="small">emphasis</Text>
            <SeparatorComponent variant="emphasis" />
        </Stack>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read one under the other, so it is written out with them
const variantsCode = `<Stack gap="normal">
    <Stack gap="condensed">
        <Text size="small">subtle</Text>
        <Separator variant="subtle" />
    </Stack>
    <Stack gap="condensed">
        <Text size="small">default</Text>
        <Separator variant="default" />
    </Stack>
    <Stack gap="condensed">
        <Text size="small">emphasis</Text>
        <Separator variant="emphasis" />
    </Stack>
</Stack>`;

// The line standing on its end, between things laid across rather than down. It takes its height
// from whatever it stands beside rather than being told one, and keeps a minimum of its own so it
// is still there where nothing stretches it
const verticalPreview = (
    <Stack direction="horizontal" gap="normal" align="center">
        <Link href="#">Overview</Link>
        <SeparatorComponent orientation="vertical" />
        <Link href="#">Settings</Link>
        <SeparatorComponent orientation="vertical" />
        <Link href="#">Members</Link>
    </Stack>
);

const verticalCode = `<Stack direction="horizontal" gap="normal" align="center">
    <Link href="#">Overview</Link>
    <Separator orientation="vertical" />
    <Link href="#">Settings</Link>
    <Separator orientation="vertical" />
    <Link href="#">Members</Link>
</Stack>`;

// A line that is only there to be looked at. It is drawn exactly as the others are and is taken out
// of the accessibility tree instead, so nothing is read out where nothing was being said
const decorativePreview = (
    <Stack gap="normal">
        <Text>Above the line</Text>
        <SeparatorComponent role="presentation" />
        <Text>Below the line</Text>
    </Stack>
);

const decorativeCode = `<Stack gap="normal">
    <Text>Above the line</Text>
    <Separator role="presentation" />
    <Text>Below the line</Text>
</Stack>`;

// The line given a colour of its own rather than one off the scale. It is set through the property
// the stylesheet reads the colour from, so nothing the class carries has to be unpicked to change
// it
const repaintedPreview = (
    <Stack gap="normal">
        <Text>Above the line</Text>
        <SeparatorComponent className={classes.repainted} />
        <Text>Below the line</Text>
    </Stack>
);

const repaintedCode = `<Stack gap="normal">
    <Text>Above the line</Text>
    <Separator className={repainted} />
    <Text>Below the line</Text>
</Stack>`;

// The line as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "How much weight the line carries against whatever it is drawn on. It says how far apart the two groups are meant to read rather than which colour the line came out, so the scheme underneath can be changed without the names going stale.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Vertical",
        description:
            "The line standing on its end, between things laid across rather than down. It takes its height from whatever it stands beside rather than being told one, and keeps a minimum of its own so it is still there where nothing stretches it. It is drawn as a fill rather than as a border, so nothing in a row can shrink it away.",
        preview: verticalPreview,
        code: verticalCode,
    },
    {
        name: "Decorative",
        description:
            "A line that is only there to be looked at, where what it stands between is already said by everything around it. It is drawn exactly as the others are and taken out of the accessibility tree instead, so nothing is read out where nothing was being said.",
        preview: decorativePreview,
        code: decorativeCode,
    },
    {
        name: "Repainting the line",
        description:
            "The line given a colour of its own rather than one off the scale. Its colour comes through a custom property, so it is repainted by setting that property rather than by unpicking the class the line came with, and everything else the class carries is left where it is.",
        setup: repaintedSetup,
        preview: repaintedPreview,
        code: repaintedCode,
    },
];

// Which way the line runs
const orientation = '"horizontal" | "vertical"';

// How much weight the line carries against whatever it is drawn on
const variant = '"subtle" | "default" | "emphasis"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the line takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// Which way it runs comes first, since it settles how the line is drawn at all, and how much weight
// it carries follows.
//
// There is nothing here about the role. The line says it is a separator and says which way it runs
// without being asked, so what a caller writes is the role that takes it back out again, which is
// the element's own prop rather than one the library adds
const groups: ComponentPropGroup[] = [
    {
        name: "Separator",
        props: [
            {
                name: "orientation",
                type: orientation,
                default: '"horizontal"',
                description:
                    "Which way the line runs. A horizontal one fills the width of whatever holds it; a vertical one takes its height from whatever it stands beside and keeps a minimum of its own, so it is still there where nothing stretches it. It is said to a screen reader as well as drawn",
            },
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "How much weight the line carries against whatever it is drawn on. It says how far apart the two groups are meant to read rather than which colour the line came out, so the scheme underneath can be changed without the names going stale",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description:
                    "The element or component this is drawn as, in place of its default. An hr says the same thing the role already says, so it is what a document written to be read without its stylesheet is given; the line is drawn as a fill either way, so the rule an hr brings with it is taken off",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the line is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Separator = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Separator
            </Heading>
            <Text as="p" size="large">
                The line between one group of things and the next. It is drawn as a fill rather than
                as a border, so the one set of rules serves a line running across and a line
                standing on its end, and nothing in a row can shrink it away. It says that it is a
                separator and which way it runs without being asked; a line that is only there to be
                looked at is handed a presentation role instead.
            </Text>
        </Stack>
        <ComponentExamples component="Separator" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Separator;
