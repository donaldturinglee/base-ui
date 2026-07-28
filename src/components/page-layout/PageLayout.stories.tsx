import type { StoryFn, Meta } from "@storybook/react-vite";
import { Placeholder } from "../placeholder";
import { PageLayout } from ".";
import type { PageLayoutProps } from "./PageLayout.types";

export default {
    title: "Components/PageLayout",
    component: PageLayout,
} as Meta<typeof PageLayout>;

export const Default: StoryFn<typeof PageLayout> = () => (
    <PageLayout>
        <PageLayout.Header>
            <Placeholder height="64px" label="Header" />
        </PageLayout.Header>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane>
            <Placeholder height="160px" label="Pane" />
        </PageLayout.Pane>
        <PageLayout.Footer>
            <Placeholder height="64px" label="Footer" />
        </PageLayout.Footer>
    </PageLayout>
);

export const Playground: StoryFn<PageLayoutProps> = (args) => (
    <PageLayout {...args}>
        <PageLayout.Header divider="line">
            <Placeholder height="64px" label="Header" />
        </PageLayout.Header>
        <PageLayout.Content>
            <Placeholder height="320px" label="Content" />
        </PageLayout.Content>
        <PageLayout.Pane divider="line">
            <Placeholder height="160px" label="Pane" />
        </PageLayout.Pane>
        <PageLayout.Footer divider="line">
            <Placeholder height="64px" label="Footer" />
        </PageLayout.Footer>
    </PageLayout>
);

Playground.args = {
    containerWidth: "xlarge",
    padding: "normal",
    rowGap: "normal",
    columnGap: "normal",
};

Playground.argTypes = {
    containerWidth: {
        control: {
            type: "radio",
        },
        options: ["full", "medium", "large", "xlarge"],
        description: "The widest the page container is allowed to be",
    },
    padding: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal"],
        description: "The room between the outer edges of the page and the viewport",
    },
    rowGap: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal"],
        description: "The room between the regions stacked down the page",
    },
    columnGap: {
        control: {
            type: "radio",
        },
        options: ["none", "condensed", "normal"],
        description: "The room between the regions standing beside each other",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
