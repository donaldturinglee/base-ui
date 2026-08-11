import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { ActionList } from "../action-list";
import { SelectPanel } from ".";
import type { SelectPanelProps } from "./SelectPanel.types";

const labels = [
    { id: "bug", name: "bug", description: "Something isn't working" },
    { id: "enhancement", name: "enhancement", description: "New feature or request" },
    { id: "documentation", name: "documentation", description: "Improvements to the docs" },
    { id: "good-first-issue", name: "good first issue", description: "Good for newcomers" },
    { id: "help-wanted", name: "help wanted", description: "Extra attention is needed" },
];

const useLabelSelection = () => {
    const [selected, setSelected] = React.useState<string[]>(["bug"]);

    const toggle = (id: string) =>
        setSelected((current) =>
            current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
        );

    return { selected, toggle };
};

export default {
    title: "Components/SelectPanel",
    component: SelectPanel,
} as Meta<typeof SelectPanel>;

export const Default: StoryFn<typeof SelectPanel> = () => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel title="Select labels">
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                        <ActionList.Description variant="block">
                            {label.description}
                        </ActionList.Description>
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<SelectPanelProps> = (args) => {
    const { selected, toggle } = useLabelSelection();

    return (
        <SelectPanel {...args}>
            <SelectPanel.Button>Assign label</SelectPanel.Button>

            <ActionList>
                {labels.map((label) => (
                    <ActionList.Item
                        key={label.id}
                        onSelect={() => toggle(label.id)}
                        selected={selected.includes(label.id)}
                    >
                        {label.name}
                    </ActionList.Item>
                ))}
            </ActionList>

            <SelectPanel.Footer />
        </SelectPanel>
    );
};

Playground.args = {
    title: "Select labels",
    description: "",
    variant: "anchored",
    selectionVariant: "multiple",
    width: "medium",
    maxHeight: "large",
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "Names the panel as well as titling it",
    },
    description: {
        control: {
            type: "text",
        },
        description: "Stands below the title, and describes the panel",
    },
    variant: {
        control: {
            type: "radio",
        },
        options: ["anchored", "modal"],
        description: "Whether the panel stands against its button or over the page",
    },
    selectionVariant: {
        control: {
            type: "radio",
        },
        options: ["multiple", "single", "instant"],
        description: "Whether one item or several can be picked",
    },
    width: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large", "xlarge", "auto"],
    },
    maxHeight: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large", "xlarge", "fit-content"],
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
