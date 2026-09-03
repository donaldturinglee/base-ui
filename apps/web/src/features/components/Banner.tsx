import * as React from "react";
import { SparkleRegular } from "@gamecrafters/base-ui-icons";
import {
    Banner as BannerComponent,
    Button,
    Card,
    Heading,
    Link,
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
    // A banner answers the room it is given rather than the width of the window, so the one
    // example that is about where the actions stand is held to a width narrow enough for the
    // difference between the three to be seen
    narrow: "w-full max-w-[26rem]",
    // The card the flush banner spans lays what it holds out with a gap between the parts, which
    // between the banner and the words under it would be a strip of the card showing through where
    // the banner is meant to meet them
    flush: "gap-0",
    // A visual handed to a banner is drawn as it arrives, so it is given the height the banner
    // draws its own marks at
    icon: "size-[var(--base-size-20)]",
};

// Where the link inside a description leads. It is the library's own source, which is where the row
// across the top of the site sends a reader as well
const href = "https://github.com/donaldturinglee/base-ui";

// What the examples have to have in hand before they can be drawn. Each is written once and reached
// for by the example that needs it
const iconSetup = `const icon = "size-[var(--base-size-20)]";`;

const hrefSetup = `const href = "https://github.com/donaldturinglee/base-ui";`;

// The plainest banner there is: what it is about and a line saying more, with nothing else said
// with a prop. A banner names a region of its own and is named from its title, so the title is
// there from the start rather than being something added later.
//
// The page and the component it is about are both called Banner, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Banner, as an application
// importing it would
const defaultPreview = (
    <BannerComponent
        title="Two-factor authentication"
        description="Everyone reaching this repository is now required to turn it on."
    />
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Banner
    title="Two-factor authentication"
    description="Everyone reaching this repository is now required to turn it on."
/>`;

// What the banner is telling the reader. The five are drawn together rather than one to an example,
// since what a banner is saying is read against the others rather than on its own: apart they are
// five notices, and one under another they are the scale a reader is choosing from.
//
// Each is named for the variant it was given, so what is read off the banner is the value that drew
// it, and the line under the title says what that kind of news is for. They are laid one under
// another rather than across, since a banner runs the width of whatever holds it
const variantsPreview = (
    <Stack gap="condensed">
        <BannerComponent
            variant="critical"
            title="critical"
            description="Something has gone wrong and has to be dealt with."
        />
        <BannerComponent
            variant="info"
            title="info"
            description="Something worth knowing, of no particular weight."
        />
        <BannerComponent
            variant="success"
            title="success"
            description="Something that was asked for has gone through."
        />
        <BannerComponent
            variant="upsell"
            title="upsell"
            description="Something more is to be had than what is being used."
        />
        <BannerComponent
            variant="warning"
            title="warning"
            description="Something is heading for trouble and has not got there yet."
        />
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read one under the other, so it is written out with them
const variantsCode = `<Stack gap="condensed">
    <Banner
        variant="critical"
        title="critical"
        description="Something has gone wrong and has to be dealt with."
    />
    <Banner
        variant="info"
        title="info"
        description="Something worth knowing, of no particular weight."
    />
    <Banner
        variant="success"
        title="success"
        description="Something that was asked for has gone through."
    />
    <Banner
        variant="upsell"
        title="upsell"
        description="Something more is to be had than what is being used."
    />
    <Banner
        variant="warning"
        title="warning"
        description="Something is heading for trouble and has not got there yet."
    />
</Stack>`;

// What is to be done about the banner. The two are handed over rather than written inside it, so
// the banner puts them where they belong and moves them as the room it has changes. Each is drawn
// as the button its place calls for, so neither is told what to look like: the one that gets on
// with it is a button outright, and the one beside it is left bare
const actionsPreview = (
    <BannerComponent
        variant="warning"
        title="Two-factor authentication"
        description="Everyone reaching this repository is now required to turn it on."
        primaryAction={<BannerComponent.PrimaryAction>Turn it on</BannerComponent.PrimaryAction>}
        secondaryAction={
            <BannerComponent.SecondaryAction>Read more</BannerComponent.SecondaryAction>
        }
    />
);

const actionsCode = `<Banner
    variant="warning"
    title="Two-factor authentication"
    description="Everyone reaching this repository is now required to turn it on."
    primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
    secondaryAction={<Banner.SecondaryAction>Read more</Banner.SecondaryAction>}
/>`;

// The way out of the banner. It is a component of its own rather than an element the page holds
// ready, since the banner says the button was pressed and does nothing else: whether it is still
// there afterwards is the caller's, so the state has to be kept somewhere.
//
// What is put in its place is a way of getting it back, since a page that takes its own example
// away and leaves nothing behind can only be read once
const DismissiblePreview = () => {
    const [dismissed, setDismissed] = React.useState(false);

    return dismissed ? (
        <Stack align="start">
            <Button onClick={() => setDismissed(false)}>Show the banner again</Button>
        </Stack>
    ) : (
        <BannerComponent
            title="Two-factor authentication"
            description="Everyone reaching this repository is now required to turn it on."
            onDismiss={() => setDismissed(true)}
        />
    );
};

// What the example has to have in hand before it can be drawn. The banner reports the press rather
// than acting on it, so whether it is still standing is the caller's and is got ready here
const dismissibleSetup = `const [dismissed, setDismissed] = React.useState(false);`;

const dismissibleCode = `dismissed ? (
    <Stack align="start">
        <Button onClick={() => setDismissed(false)}>Show the banner again</Button>
    </Stack>
) : (
    <Banner
        title="Two-factor authentication"
        description="Everyone reaching this repository is now required to turn it on."
        onDismiss={() => setDismissed(true)}
    />
)`;

// A title kept as the region's name and taken off the screen. The banner comes down to the height
// of the line it is left holding, so what is read is a notice of one line rather than a titled one
// with the title missing
const hiddenTitlePreview = (
    <BannerComponent
        variant="warning"
        title="Backups"
        hideTitle
        description="This project has not been backed up in a month."
    />
);

const hiddenTitleCode = `<Banner
    variant="warning"
    title="Backups"
    hideTitle
    description="This project has not been backed up in a month."
/>`;

// A mark of the banner's own in place of the one its variant would carry. It is drawn at the height
// the banner draws its marks at rather than at whatever it arrived as, since it stands where the
// variant's own icon would have
const visualPreview = (
    <BannerComponent
        variant="upsell"
        title="Advanced security"
        description="Secret scanning and code scanning are to be had on this plan."
        leadingVisual={<SparkleRegular className={classes.icon} />}
    />
);

const visualCode = `<Banner
    variant="upsell"
    title="Advanced security"
    description="Secret scanning and code scanning are to be had on this plan."
    leadingVisual={<SparkleRegular className={icon} />}
/>`;

// How much room the banner takes. The two are drawn together rather than one to an example, since a
// padding is read against the other rather than on its own, and each is named by the value that
// drew it
const layoutPreview = (
    <Stack gap="condensed">
        <BannerComponent title="default" description="A banner given the room it usually takes." />
        <BannerComponent
            layout="compact"
            title="compact"
            description="The same banner on less padding, for somewhere room is short."
        />
    </Stack>
);

const layoutCode = `<Stack gap="condensed">
    <Banner title="default" description="A banner given the room it usually takes." />
    <Banner
        layout="compact"
        title="compact"
        description="The same banner on less padding, for somewhere room is short."
    />
</Stack>`;

// Where the actions stand. The three are drawn together and held to a width narrow enough for them
// to differ, since what tells them apart is what each does as the room runs out rather than what
// any of them looks like with room to spare: the first follows the banner's own width and has
// already dropped its action below the words at this one, the second follows the width of the
// window and keeps it beside them until that runs short, and the third drops it below either way
const actionsLayoutPreview = (
    <Stack gap="condensed" className={classes.narrow}>
        <BannerComponent
            title="default"
            description="The actions follow the room the banner has."
            primaryAction={
                <BannerComponent.PrimaryAction>Turn it on</BannerComponent.PrimaryAction>
            }
        />
        <BannerComponent
            actionsLayout="inline"
            title="inline"
            description="The actions stay beside the words."
            primaryAction={
                <BannerComponent.PrimaryAction>Turn it on</BannerComponent.PrimaryAction>
            }
        />
        <BannerComponent
            actionsLayout="stacked"
            title="stacked"
            description="The actions stand below the words."
            primaryAction={
                <BannerComponent.PrimaryAction>Turn it on</BannerComponent.PrimaryAction>
            }
        />
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, and the width it
// is held to with it: a banner standing alone fills what it was put in, but three being read
// against each other have to be given a room small enough for where the actions stand to be the
// difference. The width is written out as the classes it stands for rather than as the name the
// page holds it under, since what is copied out of here has only itself to reach for
const actionsLayoutCode = `<Stack gap="condensed" className="w-full max-w-[26rem]">
    <Banner
        title="default"
        description="The actions follow the room the banner has."
        primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
    />
    <Banner
        actionsLayout="inline"
        title="inline"
        description="The actions stay beside the words."
        primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
    />
    <Banner
        actionsLayout="stacked"
        title="stacked"
        description="The actions stand below the words."
        primaryAction={<Banner.PrimaryAction>Turn it on</Banner.PrimaryAction>}
    />
</Stack>`;

// A banner spanning what holds it rather than standing on its own. It gives up the edges it would
// otherwise meet the card's own with, so the two read as the one thing; the card is what it is put
// in here, and a dialog or the head of a table is the same case
const flushPreview = (
    <Card padding="none" className={classes.flush}>
        <BannerComponent
            flush
            variant="critical"
            title="Something went wrong loading custom fields."
            description="Please try again."
            actionsLayout="inline"
            primaryAction={<BannerComponent.PrimaryAction>Try again</BannerComponent.PrimaryAction>}
        />
        <Stack padding="normal">
            <Text>The card the banner is spanning, which is what its edges were given up for.</Text>
        </Stack>
    </Card>
);

const flushCode = `<Card padding="none" className="gap-0">
    <Banner
        flush
        variant="critical"
        title="Something went wrong loading custom fields."
        description="Please try again."
        actionsLayout="inline"
        primaryAction={<Banner.PrimaryAction>Try again</Banner.PrimaryAction>}
    />
    <Stack padding="normal">
        <Text>The card the banner is spanning, which is what its edges were given up for.</Text>
    </Stack>
</Card>`;

// The title and the line under it written out as parts rather than handed over as props, which is
// what a banner saying anything more than words wants: the description here carries a link, and the
// title is dropped a level to sit under the heading it is being read beneath. The part still names
// the region, since it takes the id the banner is already pointing at
const partsPreview = (
    <BannerComponent variant="success">
        <BannerComponent.Title as="h3">Two-factor authentication is on</BannerComponent.Title>
        <BannerComponent.Description>
            Everyone reaching{" "}
            <Link inline href={href}>
                this repository
            </Link>{" "}
            is covered from now on.
        </BannerComponent.Description>
    </BannerComponent>
);

const partsCode = `<Banner variant="success">
    <Banner.Title as="h3">Two-factor authentication is on</Banner.Title>
    <Banner.Description>
        Everyone reaching <Link inline href={href}>this repository</Link> is covered from now on.
    </Banner.Description>
</Banner>`;

// The banner as it is reached for, drawn and written out one above the other. The plainest one
// comes first, then what it is saying, then what can be done about it, and after those whatever has
// to be said with a prop
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "What the banner is telling the reader, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. Each carries the mark that stands for what it is, so the colour is said again for a reader who does not take it.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "Something to act on it",
        description:
            "What is to be done about the banner, handed to it rather than written inside it, so it is put where it belongs and moved as the room runs out. The one that gets on with it is drawn as a button outright and the one beside it is left bare, so neither has to be told what to look like; that is the whole point of the two parts, and it is the one thing about them a caller cannot change.",
        preview: actionsPreview,
        code: actionsCode,
    },
    {
        name: "Dismissible",
        description:
            "A way out of the banner, shown as soon as there is somewhere for the press to be reported to. The banner says the button was pressed and does nothing else, so whether it is still standing afterwards is the caller's. A banner that can be dismissed and has something to act on it drops the actions below the words, since the dismiss button takes the room they would otherwise stand in.",
        setup: dismissibleSetup,
        preview: <DismissiblePreview />,
        code: dismissibleCode,
    },
    {
        name: "A title that is only read out",
        description:
            "The title kept as the region's name while taken off the screen, for a notice whose words already say what it is about. It is a hidden title rather than no title, since a region with nothing naming it is one a reader moving by landmark arrives at without being told what they have arrived at. With nothing else to stand beside, the banner comes down to the height of the line it is left holding.",
        preview: hiddenTitlePreview,
        code: hiddenTitleCode,
    },
    {
        name: "A visual of its own",
        description:
            "A mark in place of the one the variant would carry, for the two variants whose own mark says nothing the variant has not already said. Critical, success and warning keep theirs whatever they are handed, since on those the mark is what a reader who does not take the colour is left reading.",
        setup: iconSetup,
        preview: visualPreview,
        code: visualCode,
    },
    {
        name: "Compact",
        description:
            "The same banner on less padding, which is what somewhere room is short wants. Nothing else about it changes, so a compact banner still says what a banner says and still holds everything one holds.",
        preview: layoutPreview,
        code: layoutCode,
    },
    {
        name: "Where the actions stand",
        description:
            "Whether the actions are read beside the words or under them. The default follows the room the banner itself has rather than the width of the window, so the same banner reads correctly in a narrow column as it does across a page; inline follows the window instead, for a banner whose room is the page's; and stacked drops them below either way. Both orders are laid out and one of them is taken away, so only the one left standing is in the tab order.",
        preview: actionsLayoutPreview,
        code: actionsLayoutCode,
    },
    {
        name: "Flush",
        description:
            "A banner spanning what holds it rather than standing on its own. It gives up its side borders and its corners, so it meets the edges of a card, a dialog or a table rather than being drawn just within them.",
        preview: flushPreview,
        code: flushCode,
    },
    {
        name: "Written out as parts",
        description:
            "The title and the line under it given as children rather than as props, which is what a banner saying more than words wants. The title still names the region, since it takes the id the banner is already pointing at, and it can be dropped a level to sit under whatever heading it is being read beneath.",
        setup: hrefSetup,
        preview: partsPreview,
        code: partsCode,
    },
];

// What the banner is telling the reader, which sets the ground it stands on, the line around it and
// the mark it carries
const variant = '"critical" | "info" | "success" | "upsell" | "warning"';

// How much room the banner takes
const layout = '"default" | "compact"';

// Where the actions stand in relation to the words
const actionsLayout = '"default" | "inline" | "stacked"';

// What a title can be as a heading. It stands as the levels themselves rather than as the name they
// are collected under, since one of them is what a caller actually hands over. The banner names a
// region, so its title starts at level two and never climbs above it
const titleLevel = '"h2" | "h3" | "h4" | "h5" | "h6"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// Every prop the banner and its parts take, under the one that takes it. What the banner is saying
// comes first, then what it is, then how much of it is drawn, and last what can be done about it.
// The banner is always a section, since that is what makes a region of it, so there is nothing to
// say about what it is drawn as
const groups: ComponentPropGroup[] = [
    {
        name: "Banner",
        props: [
            {
                name: "title",
                type: "React.ReactNode",
                description:
                    "What the banner is about, which names the region as well as titling it. It is required unless a title is given as a child instead, since a region nothing names is one a reader arrives at without being told what they have arrived at",
            },
            {
                name: "description",
                type: "React.ReactNode",
                description:
                    "What is said about it, under the title. It takes whatever can be drawn rather than words alone, so a line carrying a link is given here as it stands",
            },
            {
                name: "hideTitle",
                type: "boolean",
                default: "false",
                description:
                    "Keeps the title as the region's name while taking it off the screen, for a notice whose words already say what it is about. A banner left with nothing but a line of text comes down to the height of it",
            },
            {
                name: "variant",
                type: variant,
                default: '"info"',
                description:
                    "What the banner is telling the reader, rather than the colour it happens to be drawn in, so the scheme underneath can be changed without every name going stale. It settles the mark the banner carries as well as its colours",
            },
            {
                name: "leadingVisual",
                type: "React.ReactNode",
                description:
                    "Stands in place of the mark the variant would otherwise carry. It is read for the info and upsell variants alone, where the mark says nothing the variant has not already said; on the rest it is what a reader who does not take the colour is left reading, so it is kept",
            },
            {
                name: "layout",
                type: layout,
                default: '"default"',
                description:
                    "How much room the banner takes. The compact one keeps the same shape on less padding, which is what somewhere room is short wants",
            },
            {
                name: "actionsLayout",
                type: actionsLayout,
                default: '"default"',
                description:
                    "Whether the actions are read beside the words or under them. The default follows the room the banner itself is given rather than the width of the window; inline follows the window instead; and stacked drops them below either way, which is what a banner that can be dismissed does anyway, since the dismiss button takes the room they would stand in",
            },
            {
                name: "flush",
                type: "boolean",
                default: "false",
                description:
                    "Gives up the side borders and the corners, for a banner spanning a card, a dialog or a table rather than standing on its own",
            },
            {
                name: "onDismiss",
                type: "() => void",
                description:
                    "Shows a way out of the banner and is called when it is pressed. The banner reports the press and does nothing else, so whether it is still standing afterwards is the caller's",
            },
            {
                name: "primaryAction",
                type: "React.ReactNode",
                description:
                    "What is to be done about the banner, given as Banner.PrimaryAction, which is a button and takes everything one takes but the variant. Which button it is drawn as is the part's whole point, so it is not left for a caller to change",
            },
            {
                name: "secondaryAction",
                type: "React.ReactNode",
                description:
                    "What can be done about it short of getting on with it, given as Banner.SecondaryAction. It is the same button left bare, so it is read beside the primary action rather than against it",
            },
            styling,
        ],
    },
    {
        name: "BannerTitle",
        props: [
            {
                name: "as",
                type: titleLevel,
                default: '"h2"',
                description:
                    "What the title is as a heading, so the banner sits at the right depth in the document outline. It names the region whichever level it is given, since it takes the id the banner is already pointing at unless the caller names one of their own",
            },
            styling,
        ],
    },
    {
        name: "BannerDescription",
        props: [styling],
    },
    {
        name: "BannerPrimaryAction",
        props: [styling],
    },
    {
        name: "BannerSecondaryAction",
        props: [styling],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the banner is is said on the page itself, beside the examples it is
// reached for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Banner = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Banner
            </Heading>
            <Text as="p" size="large">
                A notice standing across whatever it belongs to: what it is about, a line saying
                more, and whatever is to be done about it. It is drawn as a region named from its
                own title, so a reader moving by landmark can get to it and is told what they have
                arrived at, and it answers the room it is given rather than the width of the window,
                so the same banner reads correctly in a narrow column as it does across a page.
                Where Alert is a line set apart from what is around it, a banner is the whole
                notice, with somewhere for the actions and the way out of it to stand.
            </Text>
        </Stack>
        <ComponentExamples component="Banner" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Banner;
