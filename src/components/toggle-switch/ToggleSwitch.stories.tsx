import type { StoryFn, Meta } from "@storybook/react-vite";
import { Text } from "../text";
import { ToggleSwitch } from ".";
import type { ToggleSwitchProps } from "./ToggleSwitch.types";

const classes = {
    // The switch is named by an element beside it, so every story lays the pair out together
    row: "flex items-center justify-between gap-[var(--base-size-16)] w-[18rem]",
};

export default {
    title: "Components/ToggleSwitch",
    component: ToggleSwitch,
} as Meta<typeof ToggleSwitch>;

export const Default: StoryFn<typeof ToggleSwitch> = () => (
    <div className={classes.row}>
        <Text id="toggle" weight="semibold">
            Toggle label
        </Text>
        <ToggleSwitch aria-labelledby="toggle" />
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ToggleSwitchProps> = (args) => (
    <div className={classes.row}>
        <Text id="toggle" weight="semibold">
            Toggle label
        </Text>
        <ToggleSwitch {...args} aria-labelledby="toggle" />
    </div>
);

Playground.args = {
    checked: undefined,
    defaultChecked: false,
    disabled: false,
    loading: false,
    size: "medium",
    statusLabelPosition: "start",
    buttonLabelOn: "On",
    buttonLabelOff: "Off",
};

Playground.argTypes = {
    checked: {
        control: {
            type: "boolean",
        },
        description: "Whether the switch is on, where the caller keeps hold of the state",
    },
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
        description: "Stops the switch being used",
    },
    loading: {
        control: {
            type: "boolean",
        },
        description: "Whether the value behind the switch is still being worked out",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium"],
        description: "How tall the switch is",
    },
    statusLabelPosition: {
        control: {
            type: "radio",
        },
        options: ["start", "end"],
        description: "Which side of the switch the on and off labels sit on",
    },
    buttonLabelOn: {
        control: {
            type: "text",
        },
        description: "What the switch says when it is on",
    },
    buttonLabelOff: {
        control: {
            type: "text",
        },
        description: "What the switch says when it is off",
    },
    loadingLabel: {
        control: {
            type: "text",
        },
        description: "What a reader hears once the switch has been loading long enough",
    },
    loadingLabelDelay: {
        control: {
            type: "number",
        },
        description: "How long the switch waits before a reader is told that it is loading",
    },
    "aria-labelledby": {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
