import type { StoryFn, Meta } from "@storybook/react-vite";
import { Switch } from ".";
import type { SwitchProps } from "./Switch.types";

export default {
    title: "Components/Switch",
    component: Switch,
} as Meta<typeof Switch>;

export const Default: StoryFn<typeof Switch> = () => (
    <Switch>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<SwitchProps> = (args) => (
    <Switch {...args}>
        <Switch.Control>
            <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
        <Switch.HiddenInput />
    </Switch>
);

Playground.args = {
    defaultChecked: false,
    disabled: false,
    readOnly: false,
    required: false,
    invalid: false,
};

Playground.argTypes = {
    defaultChecked: {
        control: {
            type: "boolean",
        },
        description: "Whether the switch starts out on, where it keeps hold of the state itself",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the switch being turned, and takes it out of the tab order",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Leaves the switch where it stands, while keeping it in the tab order",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Requires the switch to be on before the form can be submitted",
    },
    invalid: {
        control: {
            type: "boolean",
        },
        description: "Marks the switch as holding a value that will not do",
    },
    name: {
        control: {
            type: "text",
        },
        description: "The name the value is submitted under",
    },
    value: {
        control: {
            type: "text",
        },
        description: "What is submitted while the switch is on",
    },
    checked: {
        table: {
            disable: true,
        },
    },
    ids: {
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

Playground.parameters = {
    layout: "centered",
};
