import { Heading, List, Stack, Text } from "@gamecrafters/base-ui/react";

const classes = {
    // The prose is read, so it is held to a measure. The releases beneath it are looked through
    // rather than read across, so they are left to the width they are given
    prose: "max-w-[46rem]",
    // The date is read beside the version rather than as part of it, so it is set apart from it
    // the way an aside is
    date: "text-[var(--foreground-color-muted)]",
    // A release is read down rather than across, so what it changed is held to the same measure
    // the prose above it is
    changes: "max-w-[46rem]",
};

// One release of the package, as it went out. The date is the day it was published rather than
// the day the work was done, since what a reader is holding is the published package
type Release = {
    version: string;
    date: string;
    // What changed in it, said as it is read by an application rather than as it was committed:
    // a component added and taken away again before the release went out changed nothing, and is
    // not written up as though it had
    changes: string[];
};

// Every release the page says anything about, newest first, which is the order a changelog is
// read in: what is being upgraded to stands above what is being upgraded from
const releases: Release[] = [
    {
        version: "0.0.32",
        date: "2 September 2026",
        changes: [
            "Switch is new, drawn from a Control, a Thumb, a Label and a HiddenInput. The checkbox underneath is what the browser turns, tabs to and submits, so the track and the thumb are only what that is drawn as",
            "ToggleSwitch is gone and Switch stands in its place: what the switch turns is said by the Label among its parts rather than by an element beside it pointed at with aria-labelledby, and what it holds is submitted with the form it stands in",
            "Rating draws its filled stars in the colour the system keeps for a star, in place of the gold that stands behind a warning",
            "The icons the library is drawn with brought up to date",
        ],
    },
    {
        version: "0.0.31",
        date: "31 August 2026",
        changes: [
            "Badge takes outline, invisible and link variants. None of the three names a role the way the rest do: the first two say how much of the badge is drawn, and the last says it leads somewhere",
        ],
    },
    {
        version: "0.0.30",
        date: "30 August 2026",
        changes: [
            "Badge, Clipboard, JSONTreeView, Resizable and Timer are new",
            "Accordion takes keepMounted and hiddenUntilFound, so a panel can be left in the document and found by the browser's own search",
            "Collapsible draws what it holds in a Panel, in place of Content",
            "Marquee is built from Viewport, Content, Item and Edge parts rather than as the one component",
        ],
    },
    {
        version: "0.0.29",
        date: "23 August 2026",
        changes: [
            "PageLayout.Sidebar restyled, and the packages the library is built against brought up to date",
        ],
    },
    {
        version: "0.0.28",
        date: "22 August 2026",
        changes: ["PageLayout reworked for how it holds the regions it is handed"],
    },
    {
        version: "0.0.27",
        date: "22 August 2026",
        changes: ["ContextMenu is new, with a trigger and an overlay of its own"],
    },
    {
        version: "0.0.26",
        date: "19 August 2026",
        changes: [
            "The library moved to packages/react and the Storybook to apps/docs, so what is published holds the components alone",
        ],
    },
];

// One release: what it is called and when it went out, and under them what it changed. The version
// heads it rather than the date, since a reader arrives holding one version and looking for
// another rather than looking for a day
const Entry = ({ version, date, changes }: Release) => (
    <Stack gap="condensed">
        <Stack direction="horizontal" gap="condensed" align="baseline" wrap="wrap">
            <Heading as="h2" size="small">
                {version}
            </Heading>
            <Text size="small" className={classes.date}>
                {date}
            </Text>
        </Stack>
        <List spacing="condensed" className={classes.changes}>
            {changes.map((change) => (
                <List.Item key={change}>{change}</List.Item>
            ))}
        </List>
    </Stack>
);

// What changed in each release of the package. It is written by hand rather than worked out from
// anything: nothing here reads the registry or the history, so a release is written up as it is
// cut and this page is what says so
const Changelog = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Changelog
            </Heading>
            <Text as="p" size="large">
                What changed in each release of the package, newest first. The version an
                application is drawn by is the one it installed, so what stands above it here is
                what upgrading would bring with it.
            </Text>
        </Stack>
        <Stack gap="spacious">
            {releases.map((release) => (
                <Entry key={release.version} {...release} />
            ))}
        </Stack>
        <Text as="p" size="small" className={classes.prose}>
            Releases before these are read from the commit history, which is where the entries above
            were taken from.
        </Text>
    </Stack>
);

export default Changelog;
