import { Heading, Link as LinkComponent, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// Where the links lead. It is the library's own source, which is where the row across the top of
// the site sends a reader as well, so what is being shown is a link that goes somewhere rather than
// one written to look as though it might
const href = "https://github.com/donaldturinglee/base-ui";

// What the examples have to have in hand before they can be drawn. It is written once and reached
// for by each of them, since where a link leads is not what any of them is about
const hrefSetup = `const href = "https://github.com/donaldturinglee/base-ui";`;

// The plainest link there is: words that lead somewhere, with nothing said about how they are set.
// It is drawn in the accent colour and takes its underline under the pointer, which is what tells it
// from the words around it wherever those words are set.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the link alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a link the width of the page and leave the pointer finding it far from the words.
//
// The page and the component it is about are both called Link, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Link, as an application importing
// it would
const defaultPreview = (
    <Stack align="start">
        <LinkComponent href={href}>Base UI on GitHub</LinkComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Link href={href}>Base UI on GitHub</Link>`;

// A link written into a sentence rather than standing on its own. The two paragraphs are drawn
// together rather than one alone, since what marking a link inline does cannot be read off one of
// them: the words are the same and the prop is the same, and what tells them apart is the setting
// the second one carries.
//
// The setting is written onto the paragraph rather than onto a wrapper of its own, since the
// stylesheet asks only that it stand somewhere above the link. In an application it is set once,
// high up and from whatever the reader was asked, rather than a paragraph at a time
const inlinePreview = (
    <Stack gap="normal" align="start">
        <Text as="p">
            Everyone reaching{" "}
            <LinkComponent inline href={href}>
                this repository
            </LinkComponent>{" "}
            is covered from now on.
        </Text>
        <Text as="p" data-a11y-link-underlines="true">
            Everyone reaching{" "}
            <LinkComponent inline href={href}>
                this repository
            </LinkComponent>{" "}
            is covered from now on.
        </Text>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the two read one under the other
const inlineCode = `<Stack gap="normal" align="start">
    <Text as="p">
        Everyone reaching <Link inline href={href}>this repository</Link> is covered from now on.
    </Text>
    <Text as="p" data-a11y-link-underlines="true">
        Everyone reaching <Link inline href={href}>this repository</Link> is covered from now on.
    </Text>
</Stack>`;

// A link set in the quieter foreground. The two are drawn together, since a shade is read against
// the other rather than on its own, and what the muted one comes to under the pointer is the shade
// the one above it was already set in
const mutedPreview = (
    <Stack gap="condensed" align="start">
        <LinkComponent href={href}>Base UI on GitHub</LinkComponent>
        <LinkComponent muted href={href}>
            Base UI on GitHub
        </LinkComponent>
    </Stack>
);

const mutedCode = `<Stack gap="condensed" align="start">
    <Link href={href}>Base UI on GitHub</Link>
    <Link muted href={href}>Base UI on GitHub</Link>
</Stack>`;

// A link that does something to the page rather than leading anywhere. It is drawn as the button it
// is, since that is what answers the keyboard and is read out as something to press, and everything
// a button is given to look like one is taken back off so that it goes on reading as a link
const buttonPreview = (
    <Stack align="start">
        <LinkComponent as="button" onClick={() => {}}>
            Show more
        </LinkComponent>
    </Stack>
);

const buttonCode = `<Link as="button" onClick={() => {}}>Show more</Link>`;

// The link as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: hrefSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Inside running text",
        description:
            "A link written into a sentence, where the colour it is drawn in is not enough on its own to tell it from the words around it. Marking it inline underlines it for any reader who has asked for underlines, which is a setting the page carries above the link rather than something the link decides for itself: the first paragraph here is not under it and the second is. An underlined link drops its underline under the pointer, since it already has one to give up.",
        setup: hrefSetup,
        preview: inlinePreview,
        code: inlineCode,
    },
    {
        name: "Muted",
        description:
            "A link set in the quieter foreground, for one standing where it is not the thing being read: a byline, a footer, the row of links under a page. It comes up to the ordinary link colour under the pointer rather than taking an underline, so what says it can be pressed is the colour arriving rather than a second mark.",
        setup: hrefSetup,
        preview: mutedPreview,
        code: mutedCode,
    },
    {
        name: "Doing something rather than going somewhere",
        description:
            "A link that acts on the page rather than leading anywhere is drawn as the button it is, so that it answers the keyboard and is read out as something to press rather than as a place to go. Everything a button is given to look like one is taken back off, so it goes on reading as a link. A control that is meant to look like something to press is a Button instead, drawn as an anchor where it leads somewhere.",
        preview: buttonPreview,
        code: buttonCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the link takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// The two the library adds are written up first, since between them they are the whole of what the
// component says about a link beyond drawing one, and what it is drawn as comes last, where it
// decides whether the words lead somewhere or do something
const groups: ComponentPropGroup[] = [
    {
        name: "Link",
        props: [
            {
                name: "muted",
                type: "boolean",
                default: "false",
                description:
                    "Draws the link in the quieter foreground, for one standing where it is not the thing being read. It comes up to the ordinary link colour under the pointer rather than taking an underline",
            },
            {
                name: "inline",
                type: "boolean",
                default: "false",
                description:
                    "Marks the link as one written into a sentence, where the colour it is drawn in is not enough on its own to tell it from the words around it. It is underlined only where something above it carries data-a11y-link-underlines=\"true\", so whether underlines are drawn is the reader's to settle rather than each link's, and one that is underlined drops the underline under the pointer",
            },
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"a"',
                description:
                    "What the element being drawn is. An anchor leads somewhere and is what a link usually is; a button does something to the page instead, and is drawn with everything that makes a button look like one taken back off so that it goes on reading as a link",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the link is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Link = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Link
            </Heading>
            <Text as="p" size="large">
                Words that lead somewhere: another page, a place further down this one, a file to
                fetch. They are set in the accent colour and take their underline under the pointer,
                which is enough to tell them from the words around them wherever a link stands on
                its own. Written into a sentence it is not, since colour alone is not something
                every reader can see, so a link inside running text is marked inline and underlined
                for whoever has asked for underlines. Words that act on the page rather than leading
                anywhere are drawn as a button and read the same; a control meant to look like
                something to press is a Button instead, drawn as an anchor where it leads somewhere.
            </Text>
        </Stack>
        <ComponentExamples component="Link" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Link;
