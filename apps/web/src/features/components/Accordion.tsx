import { Accordion as AccordionComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest accordion there is: nothing is held for it from outside, so it keeps its own state,
// every item starts closed and opening one closes the last.
//
// The page and the component it is about are both called Accordion, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Accordion, as an application
// importing it would
const defaultPreview = (
    <AccordionComponent>
        <AccordionComponent.Item value="billing">
            <AccordionComponent.Header>Billing</AccordionComponent.Header>
            <AccordionComponent.Panel>
                Change the card the account is billed to, and see what has been charged to it.
            </AccordionComponent.Panel>
        </AccordionComponent.Item>
        <AccordionComponent.Item value="notifications">
            <AccordionComponent.Header>Notifications</AccordionComponent.Header>
            <AccordionComponent.Panel>
                Choose what you hear about, and whether it reaches you by email or on the site.
            </AccordionComponent.Panel>
        </AccordionComponent.Item>
        <AccordionComponent.Item value="security">
            <AccordionComponent.Header>Security</AccordionComponent.Header>
            <AccordionComponent.Panel>
                Review the devices signed in to the account and the keys that can reach it.
            </AccordionComponent.Panel>
        </AccordionComponent.Item>
    </AccordionComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Accordion>
    <Accordion.Item value="billing">
        <Accordion.Header>Billing</Accordion.Header>
        <Accordion.Panel>
            Change the card the account is billed to, and see what has been charged to it.
        </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="notifications">
        <Accordion.Header>Notifications</Accordion.Header>
        <Accordion.Panel>
            Choose what you hear about, and whether it reaches you by email or on the site.
        </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="security">
        <Accordion.Header>Security</Accordion.Header>
        <Accordion.Panel>
            Review the devices signed in to the account and the keys that can reach it.
        </Accordion.Panel>
    </Accordion.Item>
</Accordion>`;

// The accordion as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
];

// What a header can be as a heading. Both the accordion and the one header take it, and the two
// answer each other, so it is written once rather than under each of them. It stands as the levels
// themselves rather than as the name they are collected under, since one of them is what a caller
// actually hands over
const headingLevel = '"h2" | "h3" | "h4" | "h5" | "h6"';

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

// Every prop the accordion and its parts take, under the one that takes it
const groups: ComponentPropGroup[] = [
    {
        name: "Accordion",
        props: [
            {
                name: "value",
                type: "string[]",
                description: "Which items are open, where the caller keeps hold of the state",
            },
            {
                name: "defaultValue",
                type: "string[]",
                default: "[]",
                description:
                    "Which items start out open, where the accordion keeps hold of the state itself",
            },
            {
                name: "multiple",
                type: "boolean",
                default: "false",
                description: "Whether more than one item can stand open at once",
            },
            {
                name: "disabled",
                type: "boolean",
                default: "false",
                description: "Stops every item being opened or closed",
            },
            {
                name: "headingLevel",
                type: headingLevel,
                default: '"h3"',
                description:
                    "What each header is as a heading, so that the accordion sits at the right depth in the document outline",
            },
            {
                name: "keepMounted",
                type: "boolean",
                default: "true",
                description:
                    "Whether a closed panel stays on the page. It does by default, so that its header always has something to point at",
            },
            {
                name: "hiddenUntilFound",
                type: "boolean",
                default: "false",
                description:
                    "Lets the browser's own find-in-page reach a closed panel, opening the item it was found in rather than passing it over",
            },
            styling,
            polymorphic,
            {
                name: "onChange",
                type: "(value: string[]) => void",
                description:
                    "Called with every item that is open whenever any of them opens or closes",
            },
        ],
    },
    {
        name: "Accordion.Item",
        props: [
            {
                name: "value",
                type: "string",
                description:
                    "Names the item to the accordion around it. One is worked out where it is left out, which is enough for an accordion nobody is holding the state of",
            },
            {
                name: "disabled",
                type: "boolean",
                description: "Stops the item being opened or closed",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Accordion.Header",
        props: [
            {
                name: "headingLevel",
                type: headingLevel,
                description:
                    "The heading this one button sits in, which takes the place of the accordion's own level",
            },
            styling,
        ],
    },
    {
        name: "Accordion.Panel",
        props: [styling, polymorphic],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the accordion is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Accordion = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Accordion
            </Heading>
            <Text as="p" size="large">
                A vertically stacked set of interactive headings, each of which reveals a section of
                content.
            </Text>
        </Stack>
        <ComponentExamples component="Accordion" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Accordion;
