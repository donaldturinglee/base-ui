import { Code as CodeComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // The ground takes its colour through a custom property rather than off the class it came with,
    // so a caller repainting it sets the property rather than unpicking anything
    repainted: "[--code-background-color:var(--background-color-accent-muted)]",
};

// What the example that repaints the ground has to have in hand before it can be drawn. It is the
// property the stylesheet reads the colour from rather than the class it came with
const repaintedSetup = `const repainted = "[--code-background-color:var(--background-color-accent-muted)]";`;

// The plainest fragment there is: a command and a file name inside a line, with nothing said about
// how either is set. They are drawn where they belong rather than on their own, since what tells a
// fragment apart is the words around it, so the line is part of what the example is showing and is
// written out with it.
//
// The sentence is the one the library's own stories set, so what is read here and what is read
// there are the same words.
//
// The page and the component it is about are both called Code, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Code, as an application importing
// it would
const defaultPreview = (
    <Stack align="start">
        <Text as="p">
            Install the package with <CodeComponent>npm install</CodeComponent>, then import{" "}
            <CodeComponent>main.css</CodeComponent> once at the root of the application.
        </Text>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Text as="p">
    Install the package with <Code>npm install</Code>, then import <Code>main.css</Code> once at
    the root of the application.
</Text>`;

// What the fragment is set at where it is told nothing, which is whatever the line it sits in is
// set at. The same sentence is set in three paragraphs, each read at a different size, and the
// fragments in it follow every one of them while staying in the monospaced face.
//
// They are not named the way the specimens on the other pages are: what is being shown is that the
// three agree with the lines they stand in, and a name beside each would be one more thing to read
// rather than the difference itself
const runningPreview = (
    <Stack gap="normal" align="start">
        <Text as="p" size="large">
            Install the package with <CodeComponent>npm install</CodeComponent>, then import{" "}
            <CodeComponent>main.css</CodeComponent> once at the root of the application.
        </Text>
        <Text as="p" size="medium">
            Install the package with <CodeComponent>npm install</CodeComponent>, then import{" "}
            <CodeComponent>main.css</CodeComponent> once at the root of the application.
        </Text>
        <Text as="p" size="small">
            Install the package with <CodeComponent>npm install</CodeComponent>, then import{" "}
            <CodeComponent>main.css</CodeComponent> once at the root of the application.
        </Text>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read against one another, so it is written out with them
const runningCode = `<Stack gap="normal" align="start">
    <Text as="p" size="large">
        Install the package with <Code>npm install</Code>, then import <Code>main.css</Code> once
        at the root of the application.
    </Text>
    <Text as="p" size="medium">
        Install the package with <Code>npm install</Code>, then import <Code>main.css</Code> once
        at the root of the application.
    </Text>
    <Text as="p" size="small">
        Install the package with <Code>npm install</Code>, then import <Code>main.css</Code> once
        at the root of the application.
    </Text>
</Stack>`;

// A fragment that is read as something other than source: a key the reader is asked to press, and
// what a program printed back. Both are set the same way, since what tells them apart is what they
// are rather than how they look, and both are drawn inside a line for the same reason the plainest
// example is
const elementsPreview = (
    <Stack align="start">
        <Text as="p">
            Press <CodeComponent as="kbd">Ctrl + C</CodeComponent> to stop the process, which prints{" "}
            <CodeComponent as="samp">Process exited with code 0</CodeComponent> before it goes.
        </Text>
    </Stack>
);

const elementsCode = `<Text as="p">
    Press <Code as="kbd">Ctrl + C</Code> to stop the process,
    which prints <Code as="samp">Process exited with code 0</Code> before it goes.
</Text>`;

// The ground given a colour of its own rather than the one off the scale. It is set through the
// property the stylesheet reads the colour from, so nothing the class carries has to be unpicked to
// change it
const repaintedPreview = (
    <Stack align="start">
        <Text as="p">
            Install the package with{" "}
            <CodeComponent className={classes.repainted}>npm install</CodeComponent>.
        </Text>
    </Stack>
);

const repaintedCode = `<Text as="p">
    Install the package with <Code className={repainted}>npm install</Code>.
</Text>`;

// The fragment as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Taking the line it is read in",
        description:
            "The fragment sets no size of its own. Its size is given in em, so it takes whatever the line it sits in is set at and is told apart from the words around it by the face and the ground alone. The same sentence is set in three paragraphs here, each read at a different size, and the fragments follow every one of them without being told anything.",
        preview: runningPreview,
        code: runningCode,
    },
    {
        name: "What the fragment is",
        description:
            "Not everything set in a monospaced face is source. A kbd is a key the reader is asked to press, and a samp is what a program printed back. All three are drawn the same way, since what tells them apart is what they are rather than how they look, and it is said in the element so a screen reader is told it too.",
        preview: elementsPreview,
        code: elementsCode,
    },
    {
        name: "Repainting the ground",
        description:
            "The ground given a colour of its own rather than the one off the scale. Its colour comes through a custom property, so it is repainted by setting that property rather than by unpicking the class the fragment came with, and everything else the class carries is left where it is.",
        setup: repaintedSetup,
        preview: repaintedPreview,
        code: repaintedCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the fragment takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// There is no size among them. The size is given in em and so is taken off the line the fragment is
// read in, which is most of what makes the component what it is, and what it is drawn as comes
// last, where it decides what the fragment is rather than how it looks
const groups: ComponentPropGroup[] = [
    {
        name: "Code",
        props: [
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"code"',
                description:
                    "What the element being drawn is. A code is source, a name or a command; a kbd is a key the reader is asked to press; a samp is what a program printed back. All three are set the same way, so what is chosen here is what the fragment is rather than how it looks",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the fragment is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Code = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Code
            </Heading>
            <Text as="p" size="large">
                A name, a command or a fragment of source read inside a line of prose, set in a
                monospaced face and on a ground of its own so that it is told apart from the words
                around it. Its size is given in em, so it takes the size of whatever line it is read
                in rather than setting one against it. A listing set apart from the text, with its
                line breaks and its indentation kept as they were written, is a code block instead.
            </Text>
        </Stack>
        <ComponentExamples component="Code" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Code;
