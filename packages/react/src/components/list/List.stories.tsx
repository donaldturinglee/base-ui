import type { StoryFn, Meta } from "@storybook/react-vite";
import { List } from ".";
import type { ListProps } from "./List.types";

const classes = {
    // Gives the list a container to lay itself out against
    container: "w-[28rem]",
};

const items = ["Fork the repository", "Create a branch for your change", "Open a pull request"];

export default {
    title: "Components/List",
    component: List,
} as Meta<typeof List>;

export const Default: StoryFn<typeof List> = () => (
    <div className={classes.container}>
        <List>
            {items.map((item) => (
                <List.Item key={item}>{item}</List.Item>
            ))}
        </List>
    </div>
);

export const Playground: StoryFn<ListProps> = (args) => (
    <div className={classes.container}>
        <List {...args}>
            {items.map((item) => (
                <List.Item key={item}>{item}</List.Item>
            ))}
        </List>
    </div>
);

Playground.args = {
    variant: "bullet",
    spacing: "normal",
};

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["bullet", "number", "plain"],
        description: "What marks each item off from the next",
    },
    spacing: {
        control: {
            type: "radio",
        },
        options: ["condensed", "normal", "spacious"],
        description: "How far apart the items sit",
    },
    as: {
        table: {
            disable: true,
        },
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
