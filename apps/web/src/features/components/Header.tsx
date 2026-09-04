import { CubeRegular } from "@gamecrafters/base-ui-icons";
import {
    Avatar,
    Header as HeaderComponent,
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
    // The mark before the name of the site is the caller's picture rather than the library's, so
    // how big it is drawn and how far it stands off the word are said here rather than by the link
    // it stands in
    icon: "size-[var(--base-size-24)] shrink-0 me-[var(--base-size-8)]",
    // Every item is held off the one after it, and the last has nothing after it to be held off
    // from, so the room it would otherwise leave at the far end is given back
    lastItem: "me-0",
};

// Where the picture is fetched from. It is the one the library's own stories are drawn with, so
// whoever is shown here and whoever is shown there are the same person
const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

// What an example has to have in hand before it can be drawn, written a line to the thing it
// settles so that an example takes only the lines it actually reaches for
const sourceSetup = `const source = "https://avatars.githubusercontent.com/u/7143434?v=4";`;

const iconSetup = `const icon = "size-[var(--base-size-24)] shrink-0 me-[var(--base-size-8)]";`;

const lastItemSetup = `const lastItem = "me-0";`;

// What a row built the way rows usually are has to have in hand: the picture at the far end, the
// mark at the start, and the class that takes the trailing room off whichever item the row ends on
const rowSetup = `${sourceSetup}
${iconSetup}
${lastItemSetup}`;

// The name of the site, which is what a row is read from: the mark, and the word after it. It
// stands at the start of more than one example here, so it is written the once and reached for by
// each of them.
//
// The mark and the word are two things inside the one link rather than two links standing beside
// each other, so a reader following either of them arrives in the same place
const brand = (
    <HeaderComponent.Item>
        <HeaderComponent.Link href="#">
            <CubeRegular className={classes.icon} />
            <span>Base UI</span>
        </HeaderComponent.Link>
    </HeaderComponent.Item>
);

// The same item as it is written, set in one level from the row it stands in
const brandCode = `    <Header.Item>
        <Header.Link href="#">
            <CubeRegular className={icon} />
            <span>Base UI</span>
        </Header.Link>
    </Header.Item>`;

// Whoever is signed in, which is what a row of this shape ends on. It is the item the row ends at,
// so it is the one that gives up the room it would be held off the far end by.
//
// The picture is given the name of whoever it is of rather than left to say nothing, since it
// stands on its own here with no name written out beside it to be read instead
const account = (
    <HeaderComponent.Item className={classes.lastItem}>
        <Avatar shape="square">
            <Avatar.Image src={source} alt="Mona Lisa Octocat" />
        </Avatar>
    </HeaderComponent.Item>
);

const accountCode = `    <Header.Item className={lastItem}>
        <Avatar shape="square">
            <Avatar.Image src={source} alt="Mona Lisa Octocat" />
        </Avatar>
    </Header.Item>`;

// The row as it is most often built: what the site is at the start of it, whatever the reader can
// be asked for at the end, and between them the one item that takes the room the rest leaves. That
// item is what pushes the picture to the far end, so where the row breaks in two is said by an item
// rather than by anything counted or measured.
//
// The page and the component it is about are both called Header, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Header, as an application
// importing it would
const defaultPreview = (
    <HeaderComponent>
        {brand}
        <HeaderComponent.Item full>Menu</HeaderComponent.Item>
        {account}
    </HeaderComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Header>
${brandCode}
    <Header.Item full>Menu</Header.Item>
${accountCode}
</Header>`;

// The item given the room the rest of the row leaves, with nothing else in the row to be read
// against. An item is only ever as wide as what it holds, so a row with none of these ends wherever
// its last item does; the one that is full is what carries the row across to the far edge, and
// everything after it goes with it
const fullPreview = (
    <HeaderComponent>
        <HeaderComponent.Item>Item 1</HeaderComponent.Item>
        <HeaderComponent.Item full>Item 2</HeaderComponent.Item>
        <HeaderComponent.Item className={classes.lastItem}>Item 3</HeaderComponent.Item>
    </HeaderComponent>
);

const fullCode = `<Header>
    <Header.Item>Item 1</Header.Item>
    <Header.Item full>Item 2</Header.Item>
    <Header.Item className={lastItem}>Item 3</Header.Item>
</Header>`;

// Somewhere each item leads to. The link is drawn in the brighter of the two colours the row is
// given and takes the dimmer one under the pointer, which is the other way around from how a link
// usually behaves: the row is read at a glance rather than gone through, so what can be followed is
// what stands out in it
const linksPreview = (
    <HeaderComponent>
        <HeaderComponent.Item>
            <HeaderComponent.Link href="#">About</HeaderComponent.Link>
        </HeaderComponent.Item>
        <HeaderComponent.Item>
            <HeaderComponent.Link href="#">Releases</HeaderComponent.Link>
        </HeaderComponent.Item>
        <HeaderComponent.Item>
            <HeaderComponent.Link href="#">Team</HeaderComponent.Link>
        </HeaderComponent.Item>
    </HeaderComponent>
);

const linksCode = `<Header>
    <Header.Item>
        <Header.Link href="#">About</Header.Link>
    </Header.Item>
    <Header.Item>
        <Header.Link href="#">Releases</Header.Link>
    </Header.Item>
    <Header.Item>
        <Header.Link href="#">Team</Header.Link>
    </Header.Item>
</Header>`;

// More than the row has room for. It is held to a single line and scrolls sideways rather than
// wrapping, so a row that has outgrown the screen is still one row: a second line would move
// everything under it down at whatever width that happened at, and the page would be laid out
// differently on a phone than the reader had been reading it
const overflowPreview = (
    <HeaderComponent>
        {brand}
        {Array.from({ length: 10 }, (_, index) => (
            <HeaderComponent.Item key={index}>Item</HeaderComponent.Item>
        ))}
        {account}
    </HeaderComponent>
);

const overflowCode = `<Header>
${brandCode}
    {Array.from({ length: 10 }, (_, index) => (
        <Header.Item key={index}>Item</Header.Item>
    ))}
${accountCode}
</Header>`;

// A link that is not an anchor. The button is what can be shown on a page with no router in it;
// what this is actually for is a router's own link, so that following the name of the site redraws
// the page rather than asking the server for another one
const customElementPreview = (
    <HeaderComponent>
        <HeaderComponent.Item>
            <HeaderComponent.Link as="button" type="button">
                Base UI
            </HeaderComponent.Link>
        </HeaderComponent.Item>
    </HeaderComponent>
);

const customElementCode = `<Header>
    <Header.Item>
        <Header.Link as="button" type="button">
            Base UI
        </Header.Link>
    </Header.Item>
</Header>`;

// The row as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: rowSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "The item that takes the rest of the row",
        description:
            "An item is only ever as wide as what it holds, so a row of them ends wherever the last one does. The item marked full is given whatever room the rest of the row leaves, which is what pushes everything after it to the far end. Where the row breaks in two is said by an item rather than by anything counted or measured, so an item added on either side of it lands on the side it was written.",
        setup: lastItemSetup,
        preview: fullPreview,
        code: fullCode,
    },
    {
        name: "Somewhere the row leads to",
        description:
            "The link is drawn in the brighter of the two colours the row is given and takes the dimmer one under the pointer, which is the other way around from how a link usually behaves. The row is read at a glance rather than gone through, so what can be followed is what stands out in it, and moving over it is what says which of them the pointer is on.",
        preview: linksPreview,
        code: linksCode,
    },
    {
        name: "More than the row has room for",
        description:
            "The row is held to a single line and scrolls sideways rather than wrapping once what it holds no longer fits. A second line would move everything under it down at whatever width that happened at, and a page read on a phone would be laid out differently from the one the reader had been reading. The card below is narrower than this row wants, so it is already scrolling.",
        setup: rowSetup,
        preview: overflowPreview,
        code: overflowCode,
    },
    {
        name: "A link that is not an anchor",
        description:
            "What the link is drawn as, in place of the anchor it is by default. A button is what can be shown on a page with no router in it; what this is actually for is a router's own link, so that following the name of the site redraws the page rather than asking the server for another one. The row itself takes the same prop, for a page whose banner is already headed elsewhere.",
        preview: customElementPreview,
        code: customElementCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the row and its parts take, under the part that takes it. The row comes first, then
// the item standing in it, and the link last, which is the order they are written in.
//
// The row declares almost nothing of its own: what it is is where it stands and how it lays out
// what it holds, and both of those are settled without being asked for
const groups: ComponentPropGroup[] = [
    {
        name: "Header",
        props: [
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"header"',
                description:
                    "The element or component the row is drawn as, in place of its default. A page that is already headed by a banner of its own draws this one as a nav or a div instead, so that what a screen reader is told heads the page is the one thing rather than two",
            },
        ],
    },
    {
        name: "HeaderItem",
        props: [
            {
                name: "full",
                type: "boolean",
                default: "false",
                description:
                    "Gives the item whatever room the rest of the row leaves, which pushes everything after it to the far end. An item is only ever as wide as what it holds otherwise, so a row with none of these ends wherever its last item does. More than one of them shares the room left over rather than each taking it in turn",
            },
            styling,
        ],
    },
    {
        name: "HeaderLink",
        props: [
            styling,
            {
                name: "as",
                type: "React.ElementType",
                default: '"a"',
                description:
                    "The element or component the link is drawn as, in place of its default. It is what a row built on a router's own link is given, so that following it redraws the page rather than asking the server for another one",
            },
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the row is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Header = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Header
            </Heading>
            <Text as="p" size="large">
                The row that runs across the top of the page: what the site is, and whatever the
                reader needs wherever in it they are. It is held to a single line and scrolls
                sideways rather than wrapping once what it holds no longer fits, since a row that
                grew a second line would move the page under the reader at whatever width that
                happened at. What stands in it is only ever as wide as what it holds, so where the
                row breaks in two is said by the one item asked to take the room the rest of it
                leaves rather than by anything counted or measured.
            </Text>
        </Stack>
        <ComponentExamples component="Header" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Header;
