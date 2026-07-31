import type { StoryFn } from "@storybook/react-vite";
import {
    AddRegular,
    BranchRegular,
    ChevronDownRegular,
    EditRegular,
    MoreHorizontalRegular,
    PanelLeftExpandRegular,
    SettingsRegular,
    TagRegular,
} from "@gamecrafters/base-ui-icons";
import { Breadcrumbs } from "../breadcrumbs";
import { Button } from "../button";
import { Hidden } from "../hidden";
import { IconButton } from "../icon-button";
import { Label } from "../label";
import { Link } from "../link";
import { Text } from "../text";
import { PageHeader } from ".";

const classes = {
    page: "p-[var(--base-size-16)]",
    navigation: "flex list-none gap-[var(--base-size-16)] m-0 p-0",
};

export default {
    title: "Components/PageHeader/Features",
    parameters: {
        layout: "fullscreen",
    },
};

// Title Only, which is all a simple page needs
export const TitleOnly: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.TitleArea>
                <PageHeader.Title>Title</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// Large Title, for something a reader wrote rather than a page of the site itself
export const LargeTitle: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.TitleArea variant="large">
                <PageHeader.Title>Add a page header to the docs</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// Subtitle, for a page that already carries a title of its own
export const Subtitle: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.TitleArea variant="subtitle">
                <PageHeader.Title>Notifications</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// With Leading And Trailing Visuals, standing either side of the title
export const WithLeadingAndTrailingVisuals: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.TitleArea>
                <PageHeader.LeadingVisual>
                    <TagRegular />
                </PageHeader.LeadingVisual>
                <PageHeader.Title>Labels</PageHeader.Title>
                <PageHeader.TrailingVisual>
                    <Label>Beta</Label>
                </PageHeader.TrailingVisual>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// With A Leading Visual Hidden On Regular Viewports
export const WithLeadingVisualHiddenOnRegularViewport: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.TitleArea>
                <PageHeader.LeadingVisual hidden={{ regular: true }}>
                    <TagRegular />
                </PageHeader.LeadingVisual>
                <PageHeader.Title>Labels</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// With Actions, which act on whatever the page is about
export const WithActions: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.TitleArea>
                <PageHeader.Title>Webhooks</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Actions>
                <Button variant="primary" trailingAction={ChevronDownRegular}>
                    Add item
                </Button>
                <IconButton aria-label="Settings" icon={SettingsRegular} />
            </PageHeader.Actions>
        </PageHeader>
    </div>
);

// With A Description, which says more about the page under the title
export const WithDescription: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="add-page-header-docs">
            <PageHeader.TitleArea>
                <PageHeader.Title>add-page-header-docs</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Description>
                <Text>
                    <Link href="#author">monalisa</Link> created this branch 5 days ago · 14 commits
                    · updated today
                </Text>
            </PageHeader.Description>
        </PageHeader>
    </div>
);

// With Navigation, which moves between the pages that belong with this one
export const WithNavigation: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Pull request title">
            <PageHeader.TitleArea>
                <PageHeader.Title>Pull request title</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Navigation as="nav" aria-label="Pull request">
                <ul className={classes.navigation}>
                    <li>
                        <Link href="#conversation" aria-current="page">
                            Conversation
                        </Link>
                    </li>
                    <li>
                        <Link href="#commits">Commits</Link>
                    </li>
                    <li>
                        <Link href="#checks">Checks</Link>
                    </li>
                    <li>
                        <Link href="#files">Files changed</Link>
                    </li>
                </ul>
            </PageHeader.Navigation>
        </PageHeader>
    </div>
);

// With Leading And Trailing Actions, which stand either side of the title row
export const WithLeadingAndTrailingActions: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.LeadingAction>
                <IconButton aria-label="Expand" icon={PanelLeftExpandRegular} variant="invisible" />
            </PageHeader.LeadingAction>
            <PageHeader.TitleArea>
                <PageHeader.Title>Title</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.TrailingAction>
                <IconButton aria-label="Edit" icon={EditRegular} variant="invisible" />
            </PageHeader.TrailingAction>
        </PageHeader>
    </div>
);

// With Breadcrumbs, which stand before the title rather than above it
export const WithBreadcrumbs: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="PageHeader.tsx">
            <PageHeader.Breadcrumbs>
                <Breadcrumbs>
                    <Breadcrumbs.Item href="#base-ui">base-ui</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#src">src</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#components">components</Breadcrumbs.Item>
                </Breadcrumbs>
            </PageHeader.Breadcrumbs>
            <PageHeader.TitleArea>
                <PageHeader.Title>page-header</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// With A Parent Link And Context Area Actions, which a narrow viewport is given in place of
// everything that will not fit beside the title
export const WithParentLinkAndContextAreaActions: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.ContextArea>
                <PageHeader.ParentLink href="#parent">Parent</PageHeader.ParentLink>

                <PageHeader.ContextAreaActions>
                    <Button size="small" trailingAction={ChevronDownRegular}>
                        Add file
                    </Button>
                    <IconButton
                        size="small"
                        aria-label="More options"
                        icon={MoreHorizontalRegular}
                    />
                </PageHeader.ContextAreaActions>
            </PageHeader.ContextArea>
            <PageHeader.TitleArea>
                <PageHeader.Title>Title</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// With A Context Bar, which stands in the context area where the way back up is more than one
// step
export const WithContextBar: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.ContextArea>
                <PageHeader.ContextBar>
                    <Breadcrumbs>
                        <Breadcrumbs.Item href="#base-ui">base-ui</Breadcrumbs.Item>
                        <Breadcrumbs.Item href="#src">src</Breadcrumbs.Item>
                        <Breadcrumbs.Item href="#components">components</Breadcrumbs.Item>
                    </Breadcrumbs>
                </PageHeader.ContextBar>
                <PageHeader.ContextAreaActions>
                    <Button size="small" leadingVisual={BranchRegular}>
                        main
                    </Button>
                </PageHeader.ContextAreaActions>
            </PageHeader.ContextArea>
            <PageHeader.TitleArea>
                <PageHeader.Title>Title</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// With Actions That Change With The Viewport, so that a narrow screen is given the short form
export const WithResponsiveActions: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Webhooks">
            <PageHeader.TitleArea>
                <PageHeader.Title>Webhooks</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Actions>
                <Hidden when="narrow">
                    <Button variant="primary" leadingVisual={AddRegular}>
                        New webhook
                    </Button>
                </Hidden>
                <Hidden when={["regular", "wide"]}>
                    <IconButton aria-label="New webhook" icon={AddRegular} variant="primary" />
                </Hidden>
            </PageHeader.Actions>
        </PageHeader>
    </div>
);

// With A Border, which is left off wherever a navigation stands at the foot of the header
export const WithBorder: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title" hasBorder>
            <PageHeader.TitleArea>
                <PageHeader.Title>Title</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);

// A Title Size That Changes With The Viewport
export const WithResponsiveTitleSize: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Title">
            <PageHeader.TitleArea variant={{ narrow: "medium", regular: "large" }}>
                <PageHeader.Title>Add a page header to the docs</PageHeader.Title>
            </PageHeader.TitleArea>
        </PageHeader>
    </div>
);
