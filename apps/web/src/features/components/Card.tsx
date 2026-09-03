import {
    BookRegular,
    MoreHorizontalRegular,
    PeopleRegular,
    RocketRegular,
    StarRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Card as CardComponent,
    Heading,
    IconButton,
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
    // A card fills whatever it is put in, so run out to a card as wide as the page it would be a
    // line of words across the whole of it. It is given a width to be read at instead
    preview: "w-full max-w-[25rem]",
    // The same again for a card standing beside others rather than alone, held to what a row of
    // three has room for. They are all held to the one width, since what tells the specimens apart
    // is then the one prop each of them was given
    box: "w-[10rem]",
    // A mark standing among words is drawn at the size of the words rather than at its own, and is
    // stopped from being squeezed by whatever it is read beside
    icon: "size-[var(--base-size-16)] shrink-0",
    // A picture runs to the card's edges and is drawn at whatever size it was fetched at, so a
    // square source would be a square as wide as the card. It is held to a band across the head of
    // the card and cropped to it instead
    banner: "h-[8rem] object-cover",
};

// Where the picture is fetched from. It is the one the avatar and image pages are drawn with, so
// whoever is shown here and whoever is shown there are the same person
const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

// What the examples have to have in hand before they can be drawn. Each is written once and
// reached for by the examples that need it, rather than run out along a line that would then have
// to be read across
const iconSetup = `const icon = "size-[var(--base-size-16)] shrink-0";`;

const imageSetup = `const source = "https://avatars.githubusercontent.com/u/7143434?v=4";
const banner = "h-[8rem] object-cover";`;

// The card as it is reached for: a mark, a heading, a line about it, and the particulars underneath.
// The parts are picked out by what they are rather than by the order they were written in, so they
// are given in the order they are read in and the card lays them out from there.
//
// The Stack that sets the card in the middle of the example and the width it is held to are the
// page's own furniture, as the example card around it is, so the listing beneath is of the card
// alone: standing on its own, a card fills whatever an application already put it in.
//
// The page and the component it is about are both called Card, so the component is brought in under
// a name saying which of the two it is. The listing beneath says Card, as an application importing
// it would
const defaultPreview = (
    <Stack align="center">
        <CardComponent className={classes.preview}>
            <CardComponent.Icon icon={RocketRegular} />
            <CardComponent.Heading>Ship it</CardComponent.Heading>
            <CardComponent.Description>
                Everything merged since the last release, gathered up and ready to go out.
            </CardComponent.Description>
            <CardComponent.Metadata>
                <PeopleRegular className={classes.icon} />3 contributors
            </CardComponent.Metadata>
        </CardComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Card>
    <Card.Icon icon={RocketRegular} />
    <Card.Heading>Ship it</Card.Heading>
    <Card.Description>
        Everything merged since the last release, gathered up and ready to go out.
    </Card.Description>
    <Card.Metadata>
        <PeopleRegular className={icon} />3 contributors
    </Card.Metadata>
</Card>`;

// A picture at the head of the card rather than a mark within it. It is run out to the card's edges
// by cancelling the padding around it, so nothing has to be said to put it there; what is said is
// how deep the band is, since a picture left to itself is drawn at the size it was fetched at
const imagePreview = (
    <Stack align="center">
        <CardComponent className={classes.preview}>
            <CardComponent.Image src={source} alt="" className={classes.banner} />
            <CardComponent.Heading>Mona Lisa Octocat</CardComponent.Heading>
            <CardComponent.Description>
                A picture is run out to the card&apos;s edges rather than held in by its padding.
            </CardComponent.Description>
        </CardComponent>
    </Stack>
);

const imageCode = `<Card>
    <Card.Image src={source} alt="" className={banner} />
    <Card.Heading>Mona Lisa Octocat</Card.Heading>
    <Card.Description>
        A picture is run out to the card's edges rather than held in by its padding.
    </Card.Description>
</Card>`;

// The same parts laid out in a row rather than stacked. The mark loses the tile it stood on and the
// heading drops to the size of the words under it, so the card reads as one line of a list rather
// than as something standing on its own
const compactPreview = (
    <Stack align="center">
        <CardComponent layout="compact" className={classes.preview}>
            <CardComponent.Icon icon={BookRegular} />
            <CardComponent.Heading>base-ui</CardComponent.Heading>
            <CardComponent.Description>
                A design system implemented as React components for building consistent interfaces.
            </CardComponent.Description>
            <CardComponent.Metadata>
                <StarRegular className={classes.icon} />
                1.2k stars
            </CardComponent.Metadata>
        </CardComponent>
    </Stack>
);

const compactCode = `<Card layout="compact">
    <Card.Icon icon={BookRegular} />
    <Card.Heading>base-ui</Card.Heading>
    <Card.Description>
        A design system implemented as React components for building consistent interfaces.
    </Card.Description>
    <Card.Metadata>
        <StarRegular className={icon} />
        1.2k stars
    </Card.Metadata>
</Card>`;

// Something to act on the card with, laid over it in the corner rather than standing in the column
// with everything else, so it keeps its place however much the card comes to hold. It is named for
// the card it acts on, since a page of cards would otherwise be a row of buttons all called the
// same thing
const actionPreview = (
    <Stack align="center">
        <CardComponent className={classes.preview}>
            <CardComponent.Icon icon={BookRegular} />
            <CardComponent.Heading>base-ui</CardComponent.Heading>
            <CardComponent.Description>
                An action is laid over the card in the corner rather than in the column with
                everything else.
            </CardComponent.Description>
            <CardComponent.Action>
                <IconButton
                    icon={MoreHorizontalRegular}
                    aria-label="More options for base-ui"
                    variant="invisible"
                    size="small"
                />
            </CardComponent.Action>
        </CardComponent>
    </Stack>
);

const actionCode = `<Card>
    <Card.Icon icon={BookRegular} />
    <Card.Heading>base-ui</Card.Heading>
    <Card.Description>
        An action is laid over the card in the corner rather than in the column with everything
        else.
    </Card.Description>
    <Card.Action>
        <IconButton
            icon={MoreHorizontalRegular}
            aria-label="More options for base-ui"
            variant="invisible"
            size="small"
        />
    </Card.Action>
</Card>`;

// How much room is left between what the card holds and its edges. The three are drawn together
// rather than one to an example, since a padding is read against the others rather than on its own,
// and each is named by the value that drew it, so what is read off the card is what it was given.
//
// They are held to the top of the row rather than stretched down it, so a card is as tall as what
// it holds, and the row is set in the middle of the example, so the line the three stand on reads
// as one thing however many of them a viewport has room for
const paddingPreview = (
    <Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
        <CardComponent padding="none" className={classes.box}>
            <CardComponent.Heading>none</CardComponent.Heading>
        </CardComponent>
        <CardComponent padding="condensed" className={classes.box}>
            <CardComponent.Heading>condensed</CardComponent.Heading>
        </CardComponent>
        <CardComponent padding="normal" className={classes.box}>
            <CardComponent.Heading>normal</CardComponent.Heading>
        </CardComponent>
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the three read beside one another, so it is written out with them and the
// width they are held to with it: a card standing alone fills what it was put in, but three being
// read against each other have to be held to the same width for the padding to be the difference
const paddingCode = `<Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
    <Card padding="none" className="w-[10rem]">
        <Card.Heading>none</Card.Heading>
    </Card>
    <Card padding="condensed" className="w-[10rem]">
        <Card.Heading>condensed</Card.Heading>
    </Card>
    <Card padding="normal" className="w-[10rem]">
        <Card.Heading>normal</Card.Heading>
    </Card>
</Stack>`;

// How far the corners are taken off, read and named the same way the paddings are
const radiusPreview = (
    <Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
        <CardComponent borderRadius="medium" className={classes.box}>
            <CardComponent.Heading>medium</CardComponent.Heading>
        </CardComponent>
        <CardComponent borderRadius="large" className={classes.box}>
            <CardComponent.Heading>large</CardComponent.Heading>
        </CardComponent>
    </Stack>
);

const radiusCode = `<Stack direction="horizontal" gap="normal" align="start" justify="center" wrap="wrap">
    <Card borderRadius="medium" className="w-[10rem]">
        <Card.Heading>medium</Card.Heading>
    </Card>
    <Card borderRadius="large" className="w-[10rem]">
        <Card.Heading>large</Card.Heading>
    </Card>
</Stack>`;

// A card handed none of its parts. What it was given is drawn as it stands rather than being sorted
// into the places the parts are laid out in, so the card can be reached for as a surface alone
const customPreview = (
    <Stack align="center">
        <CardComponent className={classes.preview}>
            <Stack gap="condensed">
                <Text weight="semibold">Written out rather than filled in</Text>
                <Text as="p">
                    A card given none of its parts draws what it was handed as it stands, so it can
                    be reached for as a surface on its own.
                </Text>
            </Stack>
        </CardComponent>
    </Stack>
);

const customCode = `<Card>
    <Stack gap="condensed">
        <Text weight="semibold">Written out rather than filled in</Text>
        <Text as="p">
            A card given none of its parts draws what it was handed as it stands, so it can be
            reached for as a surface on its own.
        </Text>
    </Stack>
</Card>`;

// A card drawn as a section, which makes a landmark of it. The heading names it without being
// pointed at, so there is nothing to write down and nothing for the two to fall out of step over
const sectionPreview = (
    <Stack align="center">
        <CardComponent as="section" className={classes.preview}>
            <CardComponent.Icon icon={BookRegular} />
            <CardComponent.Heading>Release notes</CardComponent.Heading>
            <CardComponent.Description>
                A card drawn as a section is a landmark, named from its heading, so it can be moved
                to directly rather than come upon.
            </CardComponent.Description>
        </CardComponent>
    </Stack>
);

const sectionCode = `<Card as="section">
    <Card.Icon icon={BookRegular} />
    <Card.Heading>Release notes</Card.Heading>
    <Card.Description>
        A card drawn as a section is a landmark, named from its heading, so it can be moved to
        directly rather than come upon.
    </Card.Description>
</Card>`;

// The card as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then the parts it can be given in place of a mark or beside one, and after those whatever
// has to be said with a prop
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: iconSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "A picture at the head",
        description:
            "An image stands where an icon would, and runs out to the card's edges by cancelling the padding around it. A card given both draws the image, since the two are the same place on the card rather than two places.",
        setup: imageSetup,
        preview: imagePreview,
        code: imageCode,
    },
    {
        name: "Compact",
        description:
            "The same parts laid out in a row rather than stacked, with tighter spacing, the icon left bare rather than set on a tile, and the heading dropped to the size of the words under it. It is what a card read as one of many wants, where a card standing on its own wants the room.",
        setup: iconSetup,
        preview: compactPreview,
        code: compactCode,
    },
    {
        name: "Something to act on it",
        description:
            "An action is laid over the card in the corner rather than standing in the column with everything else, so it keeps its place however much the card comes to hold. It is named for the card it acts on, since a page of cards would otherwise be a row of buttons all called the same thing.",
        preview: actionPreview,
        code: actionCode,
    },
    {
        name: "Padding",
        description:
            "How much room is left between what the card holds and its edges. None is what a card holding something drawn to its own edges wants, a picture or a listing that brings its own room with it.",
        preview: paddingPreview,
        code: paddingCode,
    },
    {
        name: "Border radius",
        description:
            "How far the corners are taken off. The larger of the two is what a card standing on its own is drawn with, and the smaller what one read among others is.",
        preview: radiusPreview,
        code: radiusCode,
    },
    {
        name: "Content of its own",
        description:
            "A card given none of its parts draws what it was handed as it stands rather than sorting it into the places the parts are laid out in, so it can be reached for as a surface on its own. What it was told about its padding and its corners still holds.",
        preview: customPreview,
        code: customCode,
    },
    {
        name: "A card that stands on its own",
        description:
            "A card drawn as a section is a landmark, which is what one standing on its own rather than among others wants: it can be moved to directly instead of being come upon. It is named from its heading, so there is nothing to write down; a card named outright is taken at its word instead.",
        preview: sectionPreview,
        code: sectionCode,
    },
];

// What the card can be drawn as. It is the two elements themselves rather than anything a caller
// could hand over, since which of them is drawn decides whether the card is a landmark
const cardElement = '"div" | "section"';

// How much room is left between what the card holds and its edges
const padding = '"none" | "condensed" | "normal"';

// How far the corners are taken off
const borderRadius = '"medium" | "large"';

// Whether the parts are stacked or laid out in a row
const layout = '"default" | "compact"';

// What a heading can be as a heading. It stands as the levels themselves rather than as the name
// they are collected under, since one of them is what a caller actually hands over
const headingLevel = '"h2" | "h3" | "h4" | "h5" | "h6"';

// What the mark is handed over as. It is the component to draw rather than an element already
// built from it, since the card is what settles the size and the colour it is drawn at

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the card and its parts take, under the one that takes it. How the card is drawn comes
// first, then the parts in the order they are read down the card: what heads it, what names it,
// what is said about it, the particulars under that, and what acts on the whole of it
const groups: ComponentPropGroup[] = [
    {
        name: "Card",
        props: [
            {
                name: "padding",
                type: padding,
                default: '"normal"',
                description:
                    "How much room is left between what the card holds and its edges. A compact card pulls the normal one in by a step, since its parts are read across rather than down",
            },
            {
                name: "borderRadius",
                type: borderRadius,
                default: '"large"',
                description: "How far the corners are taken off",
            },
            {
                name: "layout",
                type: layout,
                default: '"default"',
                description:
                    "Whether the parts are stacked or laid out in a row. The compact one leaves the icon bare rather than on a tile and drops the heading to the size of the words under it",
            },
            styling,
            {
                name: "as",
                type: cardElement,
                default: '"div"',
                description:
                    "The element the card is drawn as. A section makes a landmark of it, which is what a card standing on its own wants, and it is named from its heading unless the caller names it outright",
            },
        ],
    },
    {
        name: "CardIcon",
        props: [
            {
                name: "icon",
                type: "React.ElementType",
                required: true,
                description:
                    "The mark drawn at the head of the card. It is handed over as the icon itself rather than as an element built from it, so the card draws it at the size and in the colour it draws its own marks at",
            },
            {
                name: "aria-label",
                type: "string",
                description:
                    "Names the mark, where it says something the words beside it do not. One left unnamed is decorative and is kept out of the accessibility tree, which is what a mark standing beside a heading that already says the same thing wants",
            },
            styling,
        ],
    },
    {
        name: "CardImage",
        props: [
            {
                name: "alt",
                type: "string",
                default: '""',
                description:
                    "What the picture tells a reader who cannot see it. It comes to nothing at all, which is what says a picture is decorative, so one carrying anything the heading and the description do not already say has to be given this",
            },
            styling,
        ],
    },
    {
        name: "CardHeading",
        props: [
            {
                name: "as",
                type: headingLevel,
                default: '"h3"',
                description:
                    "What the heading is as a heading, so that the card sits at the right depth in the document outline. It is what names a card drawn as a section, whichever level it is given",
            },
            styling,
        ],
    },
    {
        name: "CardDescription",
        props: [styling],
    },
    {
        name: "CardMetadata",
        props: [styling],
    },
    {
        name: "CardAction",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the card is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Card = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Card
            </Heading>
            <Text as="p" size="large">
                A surface holding one thing among others: a heading, a line about it, and whatever
                of a mark, a picture, a line of particulars and something to act on it is given. The
                parts are picked out by what they are rather than by where they were written, so
                they can be handed over in any order, and a card given none of them draws what it
                was handed as it stands.
            </Text>
        </Stack>
        <ComponentExamples component="Card" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Card;
