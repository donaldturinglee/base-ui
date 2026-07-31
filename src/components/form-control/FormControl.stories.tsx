import type { StoryFn, Meta } from "@storybook/react-vite";
import { TextInput } from "../text-input";
import { FormControl } from ".";
import type { FormControlProps } from "./FormControl.types";

export default {
    title: "Components/FormControl",
    component: FormControl,
} as Meta<typeof FormControl>;

export const Default: StoryFn<typeof FormControl> = () => (
    <FormControl>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
        <FormControl.Caption>The name people will know you by</FormControl.Caption>
    </FormControl>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<FormControlProps> = (args) => (
    <FormControl {...args}>
        <FormControl.Label>Name</FormControl.Label>
        <TextInput />
        <FormControl.Caption>The name people will know you by</FormControl.Caption>
    </FormControl>
);

Playground.args = {
    disabled: false,
    required: false,
    layout: "vertical",
};

Playground.argTypes = {
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the field being used",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires a value before the form can be submitted",
    },
    layout: {
        control: {
            type: "radio",
        },
        options: ["vertical", "horizontal"],
        description: "The direction the field's parts flow",
    },
    id: {
        control: {
            type: "text",
        },
        description: "Ties the label, the caption and the validation message to the input",
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
