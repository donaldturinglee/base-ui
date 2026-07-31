import type { StoryFn } from "@storybook/react-vite";
import {
    AddRegular,
    AlertRegular,
    KeyRegular,
    PersonRegular,
    SettingsRegular,
    ShieldRegular,
} from "@gamecrafters/base-ui-icons";
import { Avatar } from "../avatar";
import { Heading } from "../heading";
import { IconButton } from "../icon-button";
import { Link } from "../link";
import { NavList } from "../nav-list";
import { PageContent } from "../page-content";
import { Text } from "../text";
import { PageSidebar } from ".";

const classes = {
    page: "flex flex-row p-[var(--base-size-16)]",
    section: "flex flex-col gap-[var(--stack-gap-condensed)]",
    navigation: "flex list-none flex-col gap-[var(--base-size-4)] m-0 p-0",
    account: "flex flex-row items-center gap-[var(--stack-gap-condensed)]",
    // Gives the sidebar more height than it holds, so that whatever is pushed to its foot
    // can be seen standing there
    tall: "h-[24rem]",
};

export default {
    title: "Components/PageSidebar/Features",
    parameters: {
        layout: "fullscreen",
    },
};

const settings = (
    <NavList aria-label="Settings">
        <NavList.Item href="#profile" aria-current="page">
            <NavList.LeadingVisual>
                <PersonRegular />
            </NavList.LeadingVisual>
            Profile
        </NavList.Item>
        <NavList.Item href="#account">
            <NavList.LeadingVisual>
                <KeyRegular />
            </NavList.LeadingVisual>
            Account
        </NavList.Item>
        <NavList.Item href="#notifications">
            <NavList.LeadingVisual>
                <AlertRegular />
            </NavList.LeadingVisual>
            Notifications
        </NavList.Item>
        <NavList.Item href="#security">
            <NavList.LeadingVisual>
                <ShieldRegular />
            </NavList.LeadingVisual>
            Security
        </NavList.Item>
    </NavList>
);

// Navigation Only, which is all a simple sidebar needs
export const NavigationOnly: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Settings">
            <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
        </PageSidebar>
    </div>
);

// With Its Own Navigation Landmark, for a sidebar written out by hand rather than as a list
export const WithOwnNavigationLandmark: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Docs">
            <PageSidebar.Title>Docs</PageSidebar.Title>
            <PageSidebar.Navigation as="nav" aria-label="Docs">
                <ul className={classes.navigation}>
                    <li>
                        <Link href="#getting-started" aria-current="page">
                            Getting started
                        </Link>
                    </li>
                    <li>
                        <Link href="#components" muted>
                            Components
                        </Link>
                    </li>
                    <li>
                        <Link href="#tokens" muted>
                            Tokens
                        </Link>
                    </li>
                </ul>
            </PageSidebar.Navigation>
        </PageSidebar>
    </div>
);

// Standing At The End Of The Page, where the sidebar is a note on the content rather than
// the way around it
export const AtTheEnd: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageContent width="medium" gap="condensed">
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>Webhooks let external services be notified when certain events happen.</Text>
            </PageContent.Section>
        </PageContent>
        <PageSidebar aria-label="About" position="end" hasBorder>
            <PageSidebar.Section aria-label="About">
                <PageSidebar.Title as="h3">About</PageSidebar.Title>
                <Text size="small">Delivered over the last thirty days.</Text>
            </PageSidebar.Section>
        </PageSidebar>
    </div>
);

// With A Header, which stands the name of the sidebar against whatever acts on it
export const WithHeader: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Projects">
            <PageSidebar.Header>
                <PageSidebar.Title>Projects</PageSidebar.Title>
                <PageSidebar.Actions>
                    <IconButton size="small" aria-label="New project" icon={AddRegular} />
                    <IconButton
                        size="small"
                        aria-label="Project settings"
                        icon={SettingsRegular}
                        variant="invisible"
                    />
                </PageSidebar.Actions>
            </PageSidebar.Header>
            <PageSidebar.Content>
                <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
            </PageSidebar.Content>
        </PageSidebar>
    </div>
);

// With A Head, A Body And A Foot, which is the whole of a sidebar. The body takes the room
// left over, so the foot is pushed to the bottom however little stands above it
export const WithHeaderContentAndFooter: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Settings" hasBorder className={classes.tall}>
            <PageSidebar.Header>
                <PageSidebar.Title>Settings</PageSidebar.Title>
                <PageSidebar.Actions>
                    <IconButton
                        size="small"
                        aria-label="All settings"
                        icon={SettingsRegular}
                        variant="invisible"
                    />
                </PageSidebar.Actions>
            </PageSidebar.Header>
            <PageSidebar.Content>
                <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
            </PageSidebar.Content>
            <PageSidebar.Footer>
                <span className={classes.account}>
                    <Avatar src="https://avatars.githubusercontent.com/u/92997159" alt="" />
                    <Text size="small">monalisa</Text>
                </span>
            </PageSidebar.Footer>
        </PageSidebar>
    </div>
);

// With A Footer On Its Own, which is pushed down by the room left over even where the sidebar
// holds no body of its own
export const WithFooter: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Settings" hasBorder className={classes.tall}>
            <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
            <PageSidebar.Footer>
                <span className={classes.account}>
                    <Avatar src="https://avatars.githubusercontent.com/u/92997159" alt="" />
                    <Text size="small">monalisa</Text>
                </span>
            </PageSidebar.Footer>
        </PageSidebar>
    </div>
);

// With Sections, for everything that is not a way to somewhere else
export const WithSections: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="About this page" width="small">
            <PageSidebar.Section aria-label="Assignees">
                <PageSidebar.Title as="h3">Assignees</PageSidebar.Title>
                <Text size="small">No one assigned</Text>
            </PageSidebar.Section>
            <PageSidebar.Section aria-label="Labels">
                <PageSidebar.Title as="h3">Labels</PageSidebar.Title>
                <Text size="small">None yet</Text>
            </PageSidebar.Section>
        </PageSidebar>
    </div>
);

// With A Part Hidden On Narrow Viewports, where there is no room for everything
export const WithSectionHiddenOnNarrowViewport: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Settings">
            <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
            <PageSidebar.Section aria-label="Storage" hidden={{ narrow: true }}>
                <PageSidebar.Title as="h3">Storage</PageSidebar.Title>
                <Text size="small">2.1 GB of 10 GB used</Text>
            </PageSidebar.Section>
        </PageSidebar>
    </div>
);

// Beside The Content, which is what a sidebar is for
export const BesideContent: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Settings" hasBorder>
            <PageSidebar.Header>
                <PageSidebar.Title>Settings</PageSidebar.Title>
            </PageSidebar.Header>
            <PageSidebar.Content>
                <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
            </PageSidebar.Content>
        </PageSidebar>
        <PageContent width="large" padding="normal">
            <PageContent.Section className={classes.section} aria-label="Profile">
                <Heading size="small">Profile</Heading>
                <Text>
                    Your profile is what everyone else sees of you. What is filled in here is shown
                    wherever your name is.
                </Text>
            </PageContent.Section>
        </PageContent>
    </div>
);
