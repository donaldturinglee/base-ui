import type { StoryFn, Meta } from "@storybook/react-vite";
import { AddRegular, SettingsRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { IconButton } from "../icon-button";
import { Text } from "../text";
import { PageHeader } from ".";
import type { PageHeaderProps, PageHeaderTitleVariant } from "./PageHeader.types";

const classes = {
    page: "p-[var(--base-size-16)]",
};

export default {
    title: "Components/PageHeader",
    component: PageHeader,
    parameters: {
        layout: "fullscreen",
    },
} as Meta<typeof PageHeader>;

export const Default: StoryFn<typeof PageHeader> = () => (
    <div className={classes.page}>
        <PageHeader role="banner" aria-label="Webhooks">
            <PageHeader.TitleArea>
                <PageHeader.Title>Webhooks</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Description>
                <Text>Webhooks let external services be notified when certain events happen</Text>
            </PageHeader.Description>
            <PageHeader.Actions>
                <Button variant="primary" leadingVisual={AddRegular}>
                    New webhook
                </Button>
                <IconButton aria-label="Settings" icon={SettingsRegular} />
            </PageHeader.Actions>
        </PageHeader>
    </div>
);

export const Playground: StoryFn<PageHeaderProps & { variant?: PageHeaderTitleVariant }> = ({
    variant,
    ...args
}) => (
    <div className={classes.page}>
        <PageHeader {...args}>
            <PageHeader.TitleArea variant={variant}>
                <PageHeader.Title>Webhooks</PageHeader.Title>
            </PageHeader.TitleArea>
            <PageHeader.Description>
                <Text>Webhooks let external services be notified when certain events happen</Text>
            </PageHeader.Description>
            <PageHeader.Actions>
                <Button variant="primary" leadingVisual={AddRegular}>
                    New webhook
                </Button>
            </PageHeader.Actions>
        </PageHeader>
    </div>
);

Playground.args = {
    role: "banner",
    "aria-label": "Webhooks",
    variant: "medium",
    hasBorder: false,
};

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["subtitle", "medium", "large"],
        description: "Which size the title is drawn in",
    },
    hasBorder: {
        control: {
            type: "boolean",
        },
        description: "Draws a line under the header, where no navigation stands at its foot",
    },
    role: {
        control: {
            type: "text",
        },
        description: "What the header is read as, where it stands for a landmark",
    },
    "aria-label": {
        control: {
            type: "text",
        },
        description: "Names the landmark the header stands for",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
