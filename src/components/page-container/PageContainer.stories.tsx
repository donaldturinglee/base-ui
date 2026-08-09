import type { StoryFn, Meta } from "@storybook/react-vite";
import { Heading } from "../heading";
import { PageHeader } from "../page-header";
import { Text } from "../text";
import { PageContainer } from ".";
import type { PageContainerProps } from "./PageContainer.types";

const classes = {
    section: "flex flex-col gap-[var(--stack-gap-condensed)]",
};

export default {
    title: "Components/PageContainer",
    component: PageContainer,
    parameters: {
        layout: "fullscreen",
    },
} as Meta<typeof PageContainer>;

export const Default: StoryFn<typeof PageContainer> = () => (
    <PageContainer>
        <PageContainer.Region>
            <PageHeader role="banner" aria-label="Webhooks">
                <PageHeader.TitleArea>
                    <PageHeader.Title>Webhooks</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>
        </PageContainer.Region>
        <PageContainer.Region as="main">
            <section className={classes.section} aria-label="About webhooks">
                <Heading size="small">About webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given.
                </Text>
            </section>
        </PageContainer.Region>
    </PageContainer>
);

export const Playground: StoryFn<PageContainerProps> = (args) => (
    <PageContainer {...args}>
        <PageContainer.Region>
            <PageHeader role="banner" aria-label="Webhooks">
                <PageHeader.TitleArea>
                    <PageHeader.Title>Webhooks</PageHeader.Title>
                </PageHeader.TitleArea>
            </PageHeader>
        </PageContainer.Region>
        <PageContainer.Region as="main">
            <section className={classes.section} aria-label="About webhooks">
                <Heading size="small">About webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given.
                </Text>
            </section>
        </PageContainer.Region>
    </PageContainer>
);

Playground.args = {
    width: "xlarge",
    padding: "normal",
    gap: "normal",
    fullHeight: false,
};

Playground.argTypes = {
    width: {
        control: {
            type: "radio",
        },
        options: ["full", "medium", "large", "xlarge"],
        description: "The widest the page runs before it is held still and centred",
    },
    padding: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal", "spacious"],
        description: "The room left between the page and the edge of the viewport",
    },
    gap: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal", "spacious"],
        description: "The room left between the regions of the page",
    },
    fullHeight: {
        control: {
            type: "boolean",
        },
        description: "Stands the page at least as tall as the viewport",
    },
    as: {
        control: {
            type: "text",
        },
        description: "Which element the container is drawn as",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
