import type { StoryFn } from "@storybook/react-vite";
import {
    BranchRegular,
    ChevronDownRegular,
    DataTrendingRegular,
    EditRegular,
    FlowRegular,
    MergeRegular,
    MoreHorizontalRegular,
    PanelLeftExpandRegular,
    SettingsRegular,
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
    muted: "text-[var(--foreground-color-muted)]",
    strong: "font-[var(--base-text-weight-semibold)]",
    navigation: "flex gap-[var(--base-size-8)] m-0 p-0 list-none",
};

export default {
    title: "Components/PageHeader/Features",
};

// Title Only
export const TitleOnly: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
);

// Large Title, for a title the reader wrote
export const LargeTitle: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea variant="large">
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
);

// Subtitle, for a header standing under another title on the page
export const Subtitle: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea variant="subtitle">
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
);

// A Title Sized By Viewport, which comes down a size where there is less room
export const ATitleSizedByViewport: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea variant={{ narrow: "medium", regular: "large" }}>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
);

// With Leading And Trailing Visuals
export const WithLeadingAndTrailingVisuals: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.LeadingVisual>
                <MergeRegular />
            </PageHeader.LeadingVisual>
            <PageHeader.Title>Title</PageHeader.Title>
            <PageHeader.TrailingVisual>
                <Label>Beta</Label>
            </PageHeader.TrailingVisual>
        </PageHeader.TitleArea>
    </PageHeader>
);

// With Leading Visual Hidden When Regular
export const WithLeadingVisualHiddenWhenRegular: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.LeadingVisual hidden={{ regular: true }}>
                <MergeRegular />
            </PageHeader.LeadingVisual>
            <PageHeader.Title>Title</PageHeader.Title>
            <PageHeader.TrailingVisual>
                <Label>Beta</Label>
            </PageHeader.TrailingVisual>
        </PageHeader.TitleArea>
    </PageHeader>
);

// With Actions
export const WithActions: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Actions>
            <IconButton aria-label="Workflows" icon={FlowRegular} />
            <IconButton aria-label="Insights" icon={DataTrendingRegular} />
            <Button variant="primary" trailingVisual={ChevronDownRegular}>
                Add item
            </Button>
            <IconButton aria-label="Settings" icon={SettingsRegular} />
        </PageHeader.Actions>
    </PageHeader>
);

// With Description
export const WithDescription: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="add-pageheader-docs">
        <PageHeader.TitleArea>
            <PageHeader.Title>add-pageheader-docs</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Description>
            <Text className={classes.muted}>
                <Link href="#" className={classes.strong}>
                    monalisa
                </Link>{" "}
                created this branch 5 days ago · 14 commits · updated today
            </Text>
        </PageHeader.Description>
    </PageHeader>
);

// With Navigation
export const WithNavigation: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Pull request title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Pull request title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation>
            <ul className={classes.navigation}>
                <li>
                    <Link href="#" aria-current="page">
                        Conversation
                    </Link>
                </li>
                <li>
                    <Link href="#">Commits</Link>
                </li>
                <li>
                    <Link href="#">Checks</Link>
                </li>
                <li>
                    <Link href="#">Files changed</Link>
                </li>
            </ul>
        </PageHeader.Navigation>
    </PageHeader>
);

// With A Navigation Landmark, which is named for a screen reader
export const WithANavigationLandmark: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Pull request title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Pull request title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation as="nav" aria-label="Pull request">
            <ul className={classes.navigation}>
                <li>
                    <Link href="#" aria-current="page">
                        Item 1
                    </Link>
                </li>
                <li>
                    <Link href="#">Item 2</Link>
                </li>
            </ul>
        </PageHeader.Navigation>
    </PageHeader>
);

// With Leading And Trailing Actions, shown from the regular range up
export const WithLeadingAndTrailingActions: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.LeadingAction>
            <IconButton aria-label="Expand" icon={PanelLeftExpandRegular} variant="invisible" />
        </PageHeader.LeadingAction>
        <PageHeader.TrailingAction>
            <IconButton aria-label="Edit" icon={EditRegular} variant="invisible" />
        </PageHeader.TrailingAction>
    </PageHeader>
);

// With A Parent Link And Context Area Actions, shown on a narrow viewport
export const WithAParentLinkAndContextAreaActions: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.ContextArea>
            <PageHeader.ParentLink href="#">Parent link</PageHeader.ParentLink>
            <PageHeader.ContextAreaActions>
                <Button size="small" trailingAction={ChevronDownRegular}>
                    Add file
                </Button>
                <IconButton size="small" aria-label="More options" icon={MoreHorizontalRegular} />
            </PageHeader.ContextAreaActions>
        </PageHeader.ContextArea>
    </PageHeader>
);

// With A Context Bar And Context Area Actions, shown on a narrow viewport
export const WithAContextBarAndContextAreaActions: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.ContextArea>
            <PageHeader.ContextBar>
                <Breadcrumbs>
                    <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#">PageHeader</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#" selected>
                        PageHeader.tsx
                    </Breadcrumbs.Item>
                </Breadcrumbs>
            </PageHeader.ContextBar>
            <PageHeader.ContextAreaActions>
                <Button size="small" leadingVisual={BranchRegular}>
                    Main
                </Button>
                <IconButton size="small" aria-label="More options" icon={MoreHorizontalRegular} />
            </PageHeader.ContextAreaActions>
        </PageHeader.ContextArea>
    </PageHeader>
);

// With Actions That Change By Viewport, where the label comes down to a word when narrow
export const WithActionsThatChangeByViewport: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Webhooks">
        <PageHeader.TitleArea>
            <PageHeader.Title as="h2">Webhooks</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Actions>
            <Hidden when="narrow">
                <Button variant="primary">New webhook</Button>
            </Hidden>
            <Hidden when={["regular", "wide"]}>
                <Button variant="primary">New</Button>
            </Hidden>
        </PageHeader.Actions>
    </PageHeader>
);

// With A Bottom Border
export const WithABottomBorder: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title" hasBorder>
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
);

// With A Bottom Border And Navigation, where the navigation takes the border's place
export const WithABottomBorderAndNavigation: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title" hasBorder>
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
        <PageHeader.Navigation hidden={{ narrow: true }}>
            <ul className={classes.navigation}>
                <li>
                    <Link href="#" aria-current="page">
                        Conversation
                    </Link>
                </li>
                <li>
                    <Link href="#">Commits</Link>
                </li>
            </ul>
        </PageHeader.Navigation>
    </PageHeader>
);
