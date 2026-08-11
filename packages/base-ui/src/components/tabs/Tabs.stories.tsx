import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Tabs } from ".";
import type { TabsProps } from "./Tabs.types";

const classes = {
    // Gives the tablist a container to run the width of
    container: "w-[28rem]",
};

const sections = [
    {
        value: "overview",
        label: "Overview",
        body: "Everything that has happened on the repository over the last week.",
    },
    {
        value: "issues",
        label: "Issues",
        body: "Twelve issues are open, four of them raised since Friday.",
    },
    {
        value: "pull-requests",
        label: "Pull requests",
        body: "Three pull requests are waiting on a review from you.",
    },
];

export default {
    title: "Components/Tabs",
    component: Tabs,
} as Meta<typeof Tabs>;

export const Default: StoryFn<typeof Tabs> = () => (
    <Stack gap="normal" className={classes.container}>
        <Tabs defaultValue="overview">
            <Tabs.List aria-label="Repository">
                {sections.map((section) => (
                    <Tabs.Tab key={section.value} value={section.value}>
                        {section.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
            {sections.map((section) => (
                <Tabs.Panel key={section.value} value={section.value}>
                    <Text>{section.body}</Text>
                </Tabs.Panel>
            ))}
        </Tabs>
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<TabsProps> = (args) => (
    <Stack gap="normal" className={classes.container}>
        <Tabs {...args}>
            <Tabs.List aria-label="Repository">
                {sections.map((section) => (
                    <Tabs.Tab key={section.value} value={section.value}>
                        {section.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
            {sections.map((section) => (
                <Tabs.Panel key={section.value} value={section.value}>
                    <Text>{section.body}</Text>
                </Tabs.Panel>
            ))}
        </Tabs>
    </Stack>
);

Playground.args = {
    defaultValue: "overview",
};

Playground.argTypes = {
    defaultValue: {
        control: {
            type: "radio",
        },
        options: sections.map((section) => section.value),
        description: "Which tab starts out selected, where the tabs hold the state themselves",
    },
    value: {
        table: {
            disable: true,
        },
    },
    id: {
        table: {
            disable: true,
        },
    },
    children: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
