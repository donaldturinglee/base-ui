import {
    Blockquote as BlockquoteComponent,
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
    // A quotation fills whatever it is put in, and across the whole of the card it would be a line
    // of words the width of the page with a rule somewhere off to the left of them. It is given a
    // column to wrap within instead, so the rule is read down the side of several lines
    preview: "max-w-[28rem]",
    // The rule takes its colour through a custom property rather than off the class it came with,
    // so a caller repainting it sets the property rather than unpicking anything
    repainted: "[--blockquote-border-color:var(--border-color-accent-emphasis)]",
};

// What every example that is not about the wording is a quotation of. It is written once and read
// out into each of them, since what they are about is how the quotation is set rather than what it
// happens to say
const quotation =
    "A quotation stands apart from the page around it, so a reader can see at once that the words were taken from somewhere else.";

// What the examples have to have in hand before they can be drawn. Each is written once and
// reached for by the examples that need it, rather than run out along a line that would then have
// to be read across
const quotationSetup = `const quotation =
    "A quotation stands apart from the page around it, so a reader can see at once that the words were taken from somewhere else.";`;

const repaintedSetup = `${quotationSetup}

const repainted = "[--blockquote-border-color:var(--border-color-accent-emphasis)]";`;

// The plainest quotation there is: the words, and nothing said with a prop. It is set apart by a
// rule down its leading edge rather than by quote marks, so the one set of rules serves a page
// whichever way its text runs.
//
// The column it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the quotation alone: standing in an application, it fills whatever it was put in.
//
// The page and the component it is about are both called Blockquote, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Blockquote, as an
// application importing it would
const defaultPreview = (
    <BlockquoteComponent className={classes.preview}>{quotation}</BlockquoteComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Blockquote>{quotation}</Blockquote>`;

// How large the quotation is set. The three are drawn together rather than one to an example, since
// a size is read against the others rather than on its own: apart they are three quotations, and
// beside each other they are a scale.
//
// Each says which size it was given rather than being labelled from outside, so what is read off
// the quotation is the value that set it, and each is long enough to run to a second line, which is
// where the line height the size carries is actually seen
const sizesPreview = (
    <Stack gap="normal" className={classes.preview}>
        <BlockquoteComponent size="large">
            Set large, for a quotation the page is built around rather than one it merely passes.
        </BlockquoteComponent>
        <BlockquoteComponent size="medium">
            Set medium, which is what a quotation is given where nothing is said about its size.
        </BlockquoteComponent>
        <BlockquoteComponent size="small">
            Set small, for an aside that should be read without out-shouting the page it stands in.
        </BlockquoteComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read against one another, so it is written out with them
const sizesCode = `<Stack gap="normal">
    <Blockquote size="large">
        Set large, for a quotation the page is built around rather than one it merely passes.
    </Blockquote>
    <Blockquote size="medium">
        Set medium, which is what a quotation is given where nothing is said about its size.
    </Blockquote>
    <Blockquote size="small">
        Set small, for an aside that should be read without out-shouting the page it stands in.
    </Blockquote>
</Stack>`;

// How much weight the rule carries against whatever the quotation is drawn on. The three are drawn
// together for the same reason the sizes are: what tells them apart is the one rule read beside the
// others, and a single one of them says nothing about which of the three it is
const variantsPreview = (
    <Stack gap="normal" className={classes.preview}>
        <BlockquoteComponent variant="subtle">
            Subtle, where the rule is barely there and the quotation is set apart by little more
            than the room around it.
        </BlockquoteComponent>
        <BlockquoteComponent variant="default">
            Default, which is the weight a quotation carries where nothing is said about it.
        </BlockquoteComponent>
        <BlockquoteComponent variant="emphasis">
            Emphasis, for a quotation that is meant to be seen before the words around it are read.
        </BlockquoteComponent>
    </Stack>
);

const variantsCode = `<Stack gap="normal">
    <Blockquote variant="subtle">
        Subtle, where the rule is barely there and the quotation is set apart by little more
        than the room around it.
    </Blockquote>
    <Blockquote variant="default">
        Default, which is the weight a quotation carries where nothing is said about it.
    </Blockquote>
    <Blockquote variant="emphasis">
        Emphasis, for a quotation that is meant to be seen before the words around it are read.
    </Blockquote>
</Stack>`;

// The quotation with the work it was taken from named beneath it. The whole thing is a figure and
// the name is its caption, so the two are read as one rather than as a quotation followed by a line
// that happens to be about it.
//
// Where the words came from is said twice over: in the caption, for a reader, and in the element's
// own cite attribute, which carries the address rather than the name
const attributionPreview = (
    <Stack as="figure" gap="condensed" className={classes.preview}>
        <BlockquoteComponent cite="https://example.com/handbook">{quotation}</BlockquoteComponent>
        <Text as="figcaption" size="small">
            — The Base UI handbook
        </Text>
    </Stack>
);

const attributionCode = `<Stack as="figure" gap="condensed">
    <Blockquote cite="https://example.com/handbook">{quotation}</Blockquote>
    <Text as="figcaption" size="small">
        — The Base UI handbook
    </Text>
</Stack>`;

// A quotation running to more than one paragraph. The rule keeps to the whole of it rather than
// starting again at each paragraph, which is what tells a reader the paragraphs were all taken from
// the same place
const paragraphsPreview = (
    <BlockquoteComponent className={classes.preview}>
        <Stack gap="condensed">
            <Text as="p">{quotation}</Text>
            <Text as="p">
                Where it runs on past a paragraph, the rule keeps to the whole of it rather than
                starting again at each one.
            </Text>
        </Stack>
    </BlockquoteComponent>
);

const paragraphsCode = `<Blockquote>
    <Stack gap="condensed">
        <Text as="p">{quotation}</Text>
        <Text as="p">
            Where it runs on past a paragraph, the rule keeps to the whole of it rather than
            starting again at each one.
        </Text>
    </Stack>
</Blockquote>`;

// The rule given a colour of its own rather than one off the scale. It is set through the property
// the stylesheet reads the colour from, so nothing the class carries has to be unpicked to change it
const repaintedPreview = (
    <BlockquoteComponent className={`${classes.preview} ${classes.repainted}`}>
        {quotation}
    </BlockquoteComponent>
);

const repaintedCode = `<Blockquote className={repainted}>{quotation}</Blockquote>`;

// The quotation as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: quotationSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "How large the quotation is set. The steps are the body text's own, so a quotation and a paragraph given the same size are set alike, and the rule beside it is drawn to whatever height the words come to.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Variants",
        description:
            "How much weight the rule carries against whatever the quotation is drawn on. It says how far the quotation is meant to stand out rather than which colour it came out, so the scheme underneath can be changed without the names going stale.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "With an attribution",
        description:
            "The quotation with the work it was taken from named beneath it. The two are wrapped in a figure so they are read as one thing rather than as a quotation followed by a line about it, and the name is its caption. The element's own cite attribute carries the address the words came from, which is for a machine rather than for the reader the caption is for.",
        setup: quotationSetup,
        preview: attributionPreview,
        code: attributionCode,
    },
    {
        name: "Several paragraphs",
        description:
            "A quotation running to more than one paragraph. The rule keeps to the whole of it rather than starting again at each one, which is what says the paragraphs were all taken from the same place.",
        setup: quotationSetup,
        preview: paragraphsPreview,
        code: paragraphsCode,
    },
    {
        name: "Repainting the rule",
        description:
            "The rule given a colour of its own rather than one off the scale. Its colour comes through a custom property, so it is repainted by setting that property rather than by unpicking the class the quotation came with, and everything else the class carries is left where it is.",
        setup: repaintedSetup,
        preview: repaintedPreview,
        code: repaintedCode,
    },
];

// How large the quotation is set
const size = '"large" | "medium" | "small"';

// How much weight the rule down the leading edge carries
const variant = '"subtle" | "default" | "emphasis"';

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
    default: '"blockquote"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the quotation takes. It is drawn as the one element rather than as a component with
// parts hanging off it, so there is the one table.
//
// How large it is set comes first, since it is what a quotation is told before anything else, and
// how much weight the rule carries follows it
const groups: ComponentPropGroup[] = [
    {
        name: "Blockquote",
        props: [
            {
                name: "size",
                type: size,
                default: '"medium"',
                description:
                    "How large the quotation is set. The steps are the body text's own, so a quotation and a paragraph given the same size are set alike",
            },
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "How much weight the rule down the leading edge carries against whatever the quotation is drawn on. It says how far the quotation is meant to stand out rather than which colour it came out, so the scheme underneath can be changed without the names going stale",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the quotation is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Blockquote = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Blockquote
            </Heading>
            <Text as="p" size="large">
                Words taken from somewhere else, set apart from the page around them. They are
                marked by a rule down the leading edge rather than by quote marks, so the one set of
                rules serves a page whichever way its text runs, and the rule is drawn to whatever
                height the quotation comes to however many paragraphs that is.
            </Text>
        </Stack>
        <ComponentExamples component="Blockquote" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Blockquote;
