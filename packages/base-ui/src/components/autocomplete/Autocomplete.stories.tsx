import type { StoryFn, Meta } from "@storybook/react-vite";
import { Stack } from "../stack";
import { Text } from "../text";
import { Autocomplete } from ".";
import type { AutocompleteItem, AutocompleteMenuProps } from "./Autocomplete.types";

const classes = {
    field: "w-[var(--overlay-width-small)]",
};

const topics: AutocompleteItem[] = [
    { id: "css", text: "css" },
    { id: "css-in-js", text: "css-in-js" },
    { id: "design-systems", text: "design-systems" },
    { id: "javascript", text: "javascript" },
    { id: "react", text: "react" },
    { id: "styled-system", text: "styled-system" },
    { id: "typescript", text: "typescript" },
];

export default {
    title: "Components/Autocomplete",
    component: Autocomplete,
} as Meta<typeof Autocomplete>;

export const Default: StoryFn<typeof Autocomplete> = () => (
    <Stack gap="condensed" align="start">
        <Text as="label" id="default-topic-label" htmlFor="default-topic">
            Topic
        </Text>
        <Autocomplete id="default-topic">
            <Autocomplete.Input className={classes.field} placeholder="Search topics" block />
            <Autocomplete.Overlay>
                <Autocomplete.Menu items={topics} aria-labelledby="default-topic-label" />
            </Autocomplete.Overlay>
        </Autocomplete>
    </Stack>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<AutocompleteMenuProps> = (args) => (
    <Stack gap="condensed" align="start">
        <Text as="label" id="playground-topic-label" htmlFor="playground-topic">
            Topic
        </Text>
        <Autocomplete id="playground-topic">
            <Autocomplete.Input className={classes.field} placeholder="Search topics" block />
            <Autocomplete.Overlay>
                <Autocomplete.Menu
                    {...args}
                    items={topics}
                    aria-labelledby="playground-topic-label"
                />
            </Autocomplete.Overlay>
        </Autocomplete>
    </Stack>
);

Playground.args = {
    selectionVariant: "single",
    emptyStateText: "No selectable options",
    loading: false,
};

Playground.argTypes = {
    selectionVariant: {
        control: {
            type: "radio",
        },
        options: ["single", "multiple"],
        description: "Whether one option or several can be picked",
    },
    emptyStateText: {
        control: {
            type: "text",
        },
        description: "Stands in place of the list where the filter has left it with nothing",
    },
    loading: {
        control: {
            type: "boolean",
        },
        description: "Whether the list is waiting for the options it is to show",
    },
    items: {
        table: {
            disable: true,
        },
    },
    selectedItemIds: {
        table: {
            disable: true,
        },
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
