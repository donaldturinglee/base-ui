import type { StoryFn, Meta } from "@storybook/react-vite";
import { Heading } from "../heading";
import { Text } from "../text";
import { PageContent } from ".";
import type { PageContentProps } from "./PageContent.types";

const classes = {
    page: "p-[var(--base-size-16)]",
    section: "flex flex-col gap-[var(--stack-gap-condensed)]",
};

export default {
    title: "Components/PageContent",
    component: PageContent,
    parameters: {
        layout: "fullscreen",
    },
} as Meta<typeof PageContent>;

export const Default: StoryFn<typeof PageContent> = () => (
    <div className={classes.page}>
        <PageContent>
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given.
                </Text>
            </PageContent.Section>
            <PageContent.Section className={classes.section} aria-label="Recent deliveries">
                <Heading size="small">Recent deliveries</Heading>
                <Text>Nothing has been delivered in the last thirty days.</Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

export const Playground: StoryFn<PageContentProps> = (args) => (
    <div className={classes.page}>
        <PageContent {...args}>
            <PageContent.Section className={classes.section} aria-label="Webhooks">
                <Heading size="small">Webhooks</Heading>
                <Text>
                    Webhooks let external services be notified when certain events happen. When the
                    event fires, a POST request is sent to each of the URLs given.
                </Text>
            </PageContent.Section>
            <PageContent.Section className={classes.section} aria-label="Recent deliveries">
                <Heading size="small">Recent deliveries</Heading>
                <Text>Nothing has been delivered in the last thirty days.</Text>
            </PageContent.Section>
        </PageContent>
    </div>
);

Playground.args = {
    width: "full",
    padding: "none",
    gap: "normal",
};

Playground.argTypes = {
    width: {
        control: {
            type: "radio",
        },
        options: ["full", "medium", "large", "xlarge"],
        description: "The widest the content runs before it is held still and centred",
    },
    padding: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal", "spacious"],
        description: "The room left around the content",
    },
    gap: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal", "spacious"],
        description: "The room left between the runs of content",
    },
    as: {
        control: {
            type: "text",
        },
        description: "Which element the content is drawn as",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
