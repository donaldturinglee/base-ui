import type { StoryFn, Meta } from "@storybook/react-vite";
import {
    AlertRegular,
    KeyRegular,
    PersonRegular,
    ShieldRegular,
} from "@gamecrafters/base-ui-icons";
import { NavList } from "../nav-list";
import { PageSidebar } from ".";
import type { PageSidebarProps } from "./PageSidebar.types";

const classes = {
    page: "flex flex-row p-[var(--base-size-16)]",
};

export default {
    title: "Components/PageSidebar",
    component: PageSidebar,
    parameters: {
        layout: "fullscreen",
    },
} as Meta<typeof PageSidebar>;

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

export const Default: StoryFn<typeof PageSidebar> = () => (
    <div className={classes.page}>
        <PageSidebar aria-label="Settings" hasBorder>
            <PageSidebar.Header>
                <PageSidebar.Title>Settings</PageSidebar.Title>
            </PageSidebar.Header>
            <PageSidebar.Content>
                {/* The nav list is a landmark of its own, so the region around it stays a
                    plain box rather than naming a second one */}
                <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
            </PageSidebar.Content>
        </PageSidebar>
    </div>
);

export const Playground: StoryFn<PageSidebarProps> = (args) => (
    <div className={classes.page}>
        <PageSidebar {...args}>
            <PageSidebar.Header>
                <PageSidebar.Title>Settings</PageSidebar.Title>
            </PageSidebar.Header>
            <PageSidebar.Content>
                <PageSidebar.Navigation>{settings}</PageSidebar.Navigation>
            </PageSidebar.Content>
        </PageSidebar>
    </div>
);

Playground.args = {
    "aria-label": "Settings",
    position: "start",
    width: "medium",
    padding: "normal",
    gap: "normal",
    sticky: false,
    hasBorder: true,
};

Playground.argTypes = {
    position: {
        control: {
            type: "radio",
        },
        options: ["start", "end"],
        description: "Which side of the page the sidebar stands on",
    },
    width: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "How wide the sidebar is, once there is room beside the content for it",
    },
    padding: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal", "spacious"],
        description: "The room left around the sidebar",
    },
    gap: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal", "spacious"],
        description: "The room left between the runs of the sidebar",
    },
    sticky: {
        control: {
            type: "boolean",
        },
        description: "Holds the sidebar in place as the page scrolls past it",
    },
    hasBorder: {
        control: {
            type: "boolean",
        },
        description: "Draws a line on whichever edge of the sidebar faces the content",
    },
    "aria-label": {
        control: {
            type: "text",
        },
        description: "Names the landmark the sidebar stands for",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
