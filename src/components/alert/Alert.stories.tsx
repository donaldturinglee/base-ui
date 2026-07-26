import type { StoryFn, Meta } from "@storybook/react-vite";
import Alert from "./Alert";
import type { AlertProps } from "./Alert.types";

export default {
    title: "Components/Alert",
    component: Alert,
} as Meta<typeof Alert>;

export const Default: StoryFn<typeof Alert> = () => <Alert>Default</Alert>;

export const Playground: StoryFn<AlertProps> = (args) => <Alert {...args}>Default</Alert>;

Playground.args = {
    variant: "default",
};

Playground.argTypes = {
    variant: {
        control: {
            type: "radio",
        },
        options: ["default", "success", "warning", "danger"],
        description: "Sets the background, border and icon colour",
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
