import { TagRegular } from "@gamecrafters/base-ui-icons";
import { Badge as BadgeComponent, Heading, Stack, Text } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// Where the badge that leads somewhere leads. It is the library's own source, which is where the
// row across the top of the site sends a reader as well
const href = "https://github.com/donaldturinglee/base-ui";

// The plainest badge there is: the word it carries, and nothing said with a prop. It comes to the
// one that says what something is without claiming any particular weight, drawn at the smallest of
// the steps, which is what a badge read beside a line of text wants.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the badge alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a pill the width of the page.
//
// The page and the component it is about are both called Badge, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Badge, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <BadgeComponent>Draft</BadgeComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Badge>Draft</Badge>`;

// What the badge is saying. The nine are drawn together rather than one to an example, since a
// role is read against the others rather than on its own: apart they are nine badges, and beside
// each other they are the palette a reader is choosing from.
//
// Each is named for the variant it was given, so what is read off the badge is the value that drew
// it. They are laid across rather than down, since a badge is drawn to its word and a column of
// them would be read as a list of things rather than as a set to choose from
const variantsPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <BadgeComponent>default</BadgeComponent>
        <BadgeComponent variant="primary">primary</BadgeComponent>
        <BadgeComponent variant="accent">accent</BadgeComponent>
        <BadgeComponent variant="success">success</BadgeComponent>
        <BadgeComponent variant="attention">attention</BadgeComponent>
        <BadgeComponent variant="severe">severe</BadgeComponent>
        <BadgeComponent variant="danger">danger</BadgeComponent>
        <BadgeComponent variant="done">done</BadgeComponent>
        <BadgeComponent variant="sponsors">sponsors</BadgeComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the nine read beside one another, so it is written out with them
const variantsCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Badge>default</Badge>
    <Badge variant="primary">primary</Badge>
    <Badge variant="accent">accent</Badge>
    <Badge variant="success">success</Badge>
    <Badge variant="attention">attention</Badge>
    <Badge variant="severe">severe</Badge>
    <Badge variant="danger">danger</Badge>
    <Badge variant="done">done</Badge>
    <Badge variant="sponsors">sponsors</Badge>
</Stack>`;

// The three that name no role: the ground taken off, the border taken off after it, and the one
// that says the badge leads somewhere. The last is drawn as an anchor rather than left a span,
// since what answers the pointer is put on the badges that actually go somewhere
const plainPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <BadgeComponent variant="outline">outline</BadgeComponent>
        <BadgeComponent variant="invisible">invisible</BadgeComponent>
        <BadgeComponent as="a" href={href} variant="link">
            link
        </BadgeComponent>
    </Stack>
);

const plainSetup = `const href = "https://github.com/donaldturinglee/base-ui";`;

const plainCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Badge variant="outline">outline</Badge>
    <Badge variant="invisible">invisible</Badge>
    <Badge as="a" href={href} variant="link">
        link
    </Badge>
</Stack>`;

// The same three roles said twice over, filled and then as dots, since what tells the two
// appearances apart is what a row of them comes to rather than what one of them looks like. The
// row of fills is read as a row of colours; the row of dots is read as a column of states, which
// is what a badge following something that changes is usually for
const appearancePreview = (
    <Stack gap="condensed" align="start">
        <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
            <BadgeComponent variant="success">Healthy</BadgeComponent>
            <BadgeComponent variant="attention">Degraded</BadgeComponent>
            <BadgeComponent variant="danger">Down</BadgeComponent>
        </Stack>
        <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
            <BadgeComponent variant="success" appearance="dot">
                Healthy
            </BadgeComponent>
            <BadgeComponent variant="attention" appearance="dot">
                Degraded
            </BadgeComponent>
            <BadgeComponent variant="danger" appearance="dot">
                Down
            </BadgeComponent>
        </Stack>
    </Stack>
);

const appearanceCode = `<Stack gap="condensed" align="start">
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <Badge variant="success">Healthy</Badge>
        <Badge variant="attention">Degraded</Badge>
        <Badge variant="danger">Down</Badge>
    </Stack>
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <Badge variant="success" appearance="dot">Healthy</Badge>
        <Badge variant="attention" appearance="dot">Degraded</Badge>
        <Badge variant="danger" appearance="dot">Down</Badge>
    </Stack>
</Stack>`;

// How much room the badge takes. The three are drawn together for the same reason the variants
// are, and are lined up on their centres rather than at their feet, so what is read between them
// is the height and not where each of them was set down
const sizesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <BadgeComponent size="small">small</BadgeComponent>
        <BadgeComponent size="medium">medium</BadgeComponent>
        <BadgeComponent size="large">large</BadgeComponent>
    </Stack>
);

const sizesCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Badge size="small">small</Badge>
    <Badge size="medium">medium</Badge>
    <Badge size="large">large</Badge>
</Stack>`;

// What stands before the word. The two are drawn together because the visual is put in a different
// place in each: on a filled badge it is one more thing before the word, and on a dot it takes the
// dot's place, since two marks before one word is one more than the word needs.
//
// The visual is handed over as the icon itself rather than as an element built from it, so the
// badge draws it at the step it is being drawn on rather than at whatever size it arrived at
const visualPreview = (
    <Stack direction="horizontal" gap="condensed" align="center">
        <BadgeComponent variant="accent" leadingVisual={TagRegular}>
            Release
        </BadgeComponent>
        <BadgeComponent variant="success" appearance="dot" leadingVisual={TagRegular}>
            Release
        </BadgeComponent>
    </Stack>
);

const visualCode = `<Stack direction="horizontal" gap="condensed" align="center">
    <Badge variant="accent" leadingVisual={TagRegular}>Release</Badge>
    <Badge variant="success" appearance="dot" leadingVisual={TagRegular}>Release</Badge>
</Stack>`;

// The badge as it is reached for, drawn and written out one above the other. The plainest one
// comes first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "What the badge is saying, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. All but primary are a tint under the colour the role is read in; primary is filled outright, since it is the badge that has to be seen before anything around it.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Outline, invisible and link",
        description:
            "The three that name no role. The first two say how much of the badge is drawn rather than what it is for: outline adds no colour to a row, and invisible takes the border off as well while keeping the room a badge takes, so one that falls back to it sits where it would have sat. The last says the badge leads somewhere, and is drawn as an anchor, since only a badge that goes somewhere should answer the pointer as though it did.",
        setup: plainSetup,
        preview: plainPreview,
        code: plainCode,
    },
    {
        name: "Appearance",
        description:
            "Whether the colour is the badge's own ground or a dot standing inside a plain one. A row of fills is read as a row of colours; a row of dots is read as a column of states, which is what a badge following something that changes is usually for. The dot says the same thing the word beside it does, so it is kept out of the accessibility tree rather than read out twice.",
        preview: appearancePreview,
        code: appearanceCode,
    },
    {
        name: "Sizes",
        description:
            "How much room the badge takes. The steps are Label's own, so a badge and a label given the same size stand the same height beside each other. The larger two are the same height and differ in the room they leave to either side of the word.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Leading visual",
        description:
            "What stands before the word, handed to the badge rather than written inside it, so that it is drawn in the place and at the size the badge keeps for it. The dot already puts a mark there, so a visual given alongside one stands in its place rather than beside it.",
        preview: visualPreview,
        code: visualCode,
    },
];

// What the badge is saying, rather than the colour it happens to be drawn in. The nine that name a
// role come first, and after them the three that name none: two saying how much of the badge is
// drawn, and one saying it leads somewhere
const variant =
    '"default" | "primary" | "accent" | "success" | "attention" | "severe" | "danger" | ' +
    '"done" | "sponsors" | "outline" | "invisible" | "link"';

// Whether the colour is the badge's own ground or a dot standing inside a plain one
const appearance = '"filled" | "dot"';

// How much room the badge takes
const size = '"small" | "medium" | "large"';

// What a visual is handed over as: the component to draw, or an element already built
const visual = "React.ElementType | React.ReactElement | null";

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
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the badge takes. It is drawn as the one element rather than as a component with parts
// hanging off it, so there is the one table.
//
// What the badge is saying is written up first, since it is the whole of what a badge is for; how
// that is drawn follows, then how much room it takes, and last what stands before the word
const groups: ComponentPropGroup[] = [
    {
        name: "Badge",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "What the badge is saying, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. Outline, invisible and link name no role: the first two say how much of the badge is drawn, and the last says it leads somewhere",
            },
            {
                name: "appearance",
                type: appearance,
                default: '"filled"',
                description:
                    "Whether the colour is the badge's own ground or a dot standing inside a plain one. The dot is drawn by the badge rather than handed to it, since the colour it carries is the variant's, and it is kept out of the accessibility tree, since it says what the word beside it already says",
            },
            {
                name: "size",
                type: size,
                default: '"small"',
                description:
                    "How much room the badge takes. The steps are Label's own, so a badge and a label given the same size stand the same height; the larger two are the same height and differ in the room they leave to either side of the word",
            },
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "Stands before the word, drawn to whichever step the badge is on rather than at the size it arrived at. The dot appearance already puts a mark there, so one given here stands in its place rather than beside it",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the badge is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Badge = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Badge
            </Heading>
            <Text as="p" size="large">
                A small filled pill saying what something is or what state it is in: a word or two,
                read at a glance beside whatever it belongs to. What it is drawn as says what it is
                for rather than which colour it came out, so the scheme underneath can be changed
                without every name going stale. Where Label draws the same word in outline, a badge
                fills it in, so it is the one to reach for where the colour is doing the work.
            </Text>
        </Stack>
        <ComponentExamples component="Badge" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Badge;
