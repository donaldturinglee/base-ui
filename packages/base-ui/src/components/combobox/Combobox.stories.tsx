import type { StoryFn, Meta } from "@storybook/react-vite";
import { Combobox } from ".";
import type { ComboboxProps } from "./Combobox.types";

const fruit = [
    { value: "apple", label: "Apple" },
    { value: "banana", label: "Banana" },
    { value: "cherry", label: "Cherry" },
    { value: "mango", label: "Mango" },
    { value: "orange", label: "Orange" },
    { value: "pineapple", label: "Pineapple" },
    { value: "strawberry", label: "Strawberry" },
];

const classes = {
    frame: "w-[var(--overlay-width-small)] max-w-full",
};

const items = fruit.map((item) => (
    <Combobox.Item key={item.value} value={item.value}>
        <Combobox.ItemText>{item.label}</Combobox.ItemText>
        <Combobox.ItemIndicator />
    </Combobox.Item>
));

export default {
    title: "Components/Combobox",
    component: Combobox,
} as Meta<typeof Combobox>;

export const Default: StoryFn<typeof Combobox> = () => (
    <div className={classes.frame}>
        <Combobox placeholder="e.g. Apple">
            <Combobox.Label>Favourite fruit</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{items}</Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<ComboboxProps> = (args) => (
    <div className={classes.frame}>
        <Combobox {...args}>
            <Combobox.Label>Favourite fruit</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input />
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
            </Combobox.Control>
            <Combobox.Positioner>
                <Combobox.Content>
                    <Combobox.List>{items}</Combobox.List>
                    <Combobox.Empty />
                </Combobox.Content>
            </Combobox.Positioner>
        </Combobox>
    </div>
);

Playground.args = {
    placeholder: "e.g. Apple",
    multiple: false,
    inputBehavior: "none",
    allowCustomValue: false,
    loopFocus: false,
    openOnClick: false,
    disabled: false,
    readOnly: false,
    invalid: false,
    required: false,
};

Playground.argTypes = {
    placeholder: {
        control: {
            type: "text",
        },
        description: "Stands in for what is typed until something has been",
    },
    multiple: {
        control: {
            type: "boolean",
        },
        description: "Whether more than one item can be held at a time",
    },
    inputBehavior: {
        control: {
            type: "radio",
        },
        options: ["none", "autohighlight", "autocomplete"],
        description: "How the list answers what is being typed",
    },
    selectionBehavior: {
        control: {
            type: "radio",
        },
        options: [undefined, "replace", "clear", "preserve"],
        description: "What becomes of what was typed once something has been picked",
    },
    allowCustomValue: {
        control: {
            type: "boolean",
        },
        description: "Whether the field may keep text that names no item",
    },
    loopFocus: {
        control: {
            type: "boolean",
        },
        description: "Whether stepping off either end of the list comes round to the other",
    },
    openOnClick: {
        control: {
            type: "boolean",
        },
        description: "Whether clicking the field opens the list",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the combobox being used",
    },
    readOnly: {
        control: {
            type: "boolean",
        },
        description: "Shows what is held without letting it be changed",
    },
    invalid: {
        control: {
            type: "boolean",
        },
        description: "Colours the control and marks the field invalid",
    },
    required: {
        control: {
            type: "boolean",
        },
        description: "Says a choice has to be made",
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
