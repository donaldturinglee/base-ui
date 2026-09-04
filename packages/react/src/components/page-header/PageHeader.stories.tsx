import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    ArrowRightRegular,
    BranchRegular,
    EditRegular,
    MoreHorizontalRegular,
    PanelLeftExpandRegular,
} from "@gamecrafters/base-ui-icons";
import { Breadcrumbs } from "../breadcrumbs";
import { Button } from "../button";
import { Hidden } from "../hidden";
import { IconButton } from "../icon-button";
import { Label } from "../label";
import { Link } from "../link";
import { StateLabel } from "../state-label";
import { Text } from "../text";
import { PageHeader } from ".";
import type {
    PageHeaderProps,
    PageHeaderTitleLevel,
    PageHeaderTitleVariant,
} from "./PageHeader.types";

const classes = {
    muted: "text-[var(--foreground-color-muted)]",
    strong: "font-[var(--base-text-weight-semibold)]",
    navigation: "flex gap-[var(--base-size-8)] m-0 p-0 list-none",
};

export default {
    title: "Components/PageHeader",
    component: PageHeader,
} as Meta<typeof PageHeader>;

export const Default: StoryFn<typeof PageHeader> = () => (
    <PageHeader role="banner" aria-label="Title">
        <PageHeader.TitleArea>
            <PageHeader.Title>Title</PageHeader.Title>
        </PageHeader.TitleArea>
    </PageHeader>
);

type PlaygroundArgs = PageHeaderProps & {
    title: string;
    titleAs: PageHeaderTitleLevel;
    titleVariant: PageHeaderTitleVariant;
    leadingVisual: boolean;
    trailingVisual: boolean;
    contextArea: boolean;
    parentLink: boolean;
    contextBar: boolean;
    contextAreaActions: boolean;
    leadingAction: boolean;
    trailingAction: boolean;
    actions: boolean;
    description: boolean;
    navigation: boolean;
};

export const Playground: StoryFn<PlaygroundArgs> = ({
    title,
    titleAs,
    titleVariant,
    leadingVisual,
    trailingVisual,
    contextArea,
    parentLink,
    contextBar,
    contextAreaActions,
    leadingAction,
    trailingAction,
    actions,
    description,
    navigation,
    ...args
}) => (
    <PageHeader role="banner" aria-label={title} {...args}>
        <PageHeader.TitleArea variant={titleVariant}>
            <PageHeader.LeadingVisual hidden={!leadingVisual}>
                <BranchRegular />
            </PageHeader.LeadingVisual>
            <PageHeader.Title as={titleAs}>{title}</PageHeader.Title>
            <PageHeader.TrailingVisual hidden={!trailingVisual}>
                <Label>Beta</Label>
            </PageHeader.TrailingVisual>
        </PageHeader.TitleArea>
        <PageHeader.ContextArea hidden={!contextArea}>
            <PageHeader.ParentLink href="#" hidden={!parentLink}>
                Previous page
            </PageHeader.ParentLink>
            <PageHeader.ContextBar hidden={!contextBar}>
                <Breadcrumbs>
                    <Breadcrumbs.Item href="#">react</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#">src</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#">PageHeader</Breadcrumbs.Item>
                    <Breadcrumbs.Item href="#" selected>
                        PageHeader.tsx
                    </Breadcrumbs.Item>
                </Breadcrumbs>
            </PageHeader.ContextBar>
            <PageHeader.ContextAreaActions hidden={!contextAreaActions}>
                <Button size="small" leadingVisual={BranchRegular}>
                    Main
                </Button>
                <IconButton size="small" aria-label="More" icon={MoreHorizontalRegular} />
            </PageHeader.ContextAreaActions>
        </PageHeader.ContextArea>
        <PageHeader.LeadingAction hidden={!leadingAction}>
            <IconButton aria-label="Expand" icon={PanelLeftExpandRegular} variant="invisible" />
        </PageHeader.LeadingAction>
        <PageHeader.TrailingAction hidden={!trailingAction}>
            <IconButton aria-label="Edit" icon={EditRegular} variant="invisible" />
        </PageHeader.TrailingAction>
        <PageHeader.Actions hidden={!actions}>
            <Hidden when="narrow">
                <Button variant="primary">New branch</Button>
            </Hidden>
            <Hidden when={["regular", "wide"]}>
                <Button variant="primary">New</Button>
            </Hidden>
            <IconButton aria-label="More" icon={MoreHorizontalRegular} />
        </PageHeader.Actions>
        <PageHeader.Description hidden={!description}>
            <StateLabel status="pullOpened">Open</StateLabel>
            <Hidden when="narrow">
                <Text className={classes.muted}>
                    <Link href="#" className={classes.strong}>
                        monalisa
                    </Link>{" "}
                    wants to merge 3 commits into <Link href="#">main</Link> from{" "}
                    <Link href="#">monalisa/page-header</Link>
                </Text>
            </Hidden>
            <Hidden when={["regular", "wide"]}>
                <Text className={classes.muted}>
                    <Link href="#">main</Link> <ArrowRightRegular />{" "}
                    <Link href="#">monalisa/page-header</Link>
                </Text>
            </Hidden>
        </PageHeader.Description>
        <PageHeader.Navigation hidden={!navigation}>
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

Playground.args = {
    hasBorder: false,
    title: "Branches",
    titleAs: "h2",
    titleVariant: "medium",
    leadingVisual: false,
    trailingVisual: false,
    contextArea: false,
    parentLink: true,
    contextBar: false,
    contextAreaActions: true,
    leadingAction: false,
    trailingAction: false,
    actions: false,
    description: false,
    navigation: false,
};

Playground.argTypes = {
    hasBorder: {
        control: {
            type: "boolean",
        },
        description: "Draws a line beneath the header, unless a navigation region is showing",
    },
    title: {
        control: {
            type: "text",
        },
        table: {
            category: "Title area",
        },
        description: "What the title says",
    },
    titleAs: {
        control: {
            type: "select",
        },
        options: ["h1", "h2", "h3", "h4", "h5", "h6"],
        table: {
            category: "Title area",
        },
        description: "The heading level the title is rendered as",
    },
    titleVariant: {
        control: {
            type: "radio",
        },
        options: ["large", "medium", "subtitle"],
        table: {
            category: "Title area",
        },
        description:
            "Medium is the size a static title takes, large is for a title the reader wrote, " +
            "and subtitle is for a header standing under another title on the page",
    },
    leadingVisual: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Title area",
        },
        description: "Shows an icon before the title",
    },
    trailingVisual: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Title area",
        },
        description: "Shows a label after the title",
    },
    contextArea: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Context area",
        },
        description: "Shows the context area on every viewport, rather than only on a narrow one",
    },
    parentLink: {
        control: {
            type: "boolean",
        },
        if: {
            arg: "contextArea",
        },
        table: {
            category: "Context area",
        },
        description: "Shows the way back up the hierarchy",
    },
    contextBar: {
        control: {
            type: "boolean",
        },
        if: {
            arg: "contextArea",
        },
        table: {
            category: "Context area",
        },
        description: "Shows a trail of breadcrumbs above the title",
    },
    contextAreaActions: {
        control: {
            type: "boolean",
        },
        if: {
            arg: "contextArea",
        },
        table: {
            category: "Context area",
        },
        description: "Shows the actions at the far end of the context area",
    },
    leadingAction: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Actions",
        },
        description: "Shows an action before the title, from the regular range up",
    },
    trailingAction: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Actions",
        },
        description: "Shows an action right after the title, from the regular range up",
    },
    actions: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Actions",
        },
        description: "Shows the actions of the page at the far end of the title row",
    },
    description: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Other regions",
        },
        description: "Shows a line about the page beneath the title",
    },
    navigation: {
        control: {
            type: "boolean",
        },
        table: {
            category: "Other regions",
        },
        description: "Shows the page's own navigation beneath everything else",
    },
    children: {
        table: {
            disable: true,
        },
    },
    ref: {
        table: {
            disable: true,
        },
    },
};
