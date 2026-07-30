import * as React from "react";
import type { StoryFn, Meta } from "@storybook/react-vite";
import { PersonRegular } from "@gamecrafters/base-ui-icons";
import { FilteredActionList } from ".";
import type {
    FilteredActionListItemInput,
    FilteredActionListProps,
} from "./FilteredActionList.types";

const classes = {
    // Gives the list a box to sit in rather than the width and height of the page, since it
    // is only ever drawn inside a panel of some kind
    container:
        "w-[20rem] h-[20rem] rounded-[var(--border-radius-medium)] border-solid border-[length:var(--border-width-thin)] border-[color:var(--border-color-default)]",
};

export default {
    title: "Components/FilteredActionList",
    component: FilteredActionList,
} as Meta<typeof FilteredActionList>;

const people = [
    "Monalisa Octocat",
    "Hubot",
    "Mona Lisa",
    "Octocat",
    "Ada Lovelace",
    "Grace Hopper",
    "Alan Turing",
    "Katherine Johnson",
    "Margaret Hamilton",
    "Barbara Liskov",
];

const peopleItems: FilteredActionListItemInput[] = people.map((name, index) => ({
    id: index,
    text: name,
    leadingVisual: PersonRegular,
}));

// The filtering itself is the caller's, so every story does it the same way
const matching = (items: FilteredActionListItemInput[], filter: string) =>
    items.filter((item) => item.text?.toLowerCase().includes(filter.toLowerCase()));

export const Default: StoryFn<typeof FilteredActionList> = () => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionList
            className={classes.container}
            placeholderText="Filter people"
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(peopleItems, filter)}
        />
    );
};

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<FilteredActionListProps> = (args) => {
    const [filter, setFilter] = React.useState("");

    return (
        <FilteredActionList
            {...args}
            className={classes.container}
            filterValue={filter}
            onFilterChange={setFilter}
            items={matching(peopleItems, filter)}
        />
    );
};

Playground.args = {
    placeholderText: "Filter people",
    loading: false,
    loadingType: "body-spinner",
    selectionVariant: "multiple",
    showItemDividers: false,
    announcementsEnabled: true,
    virtualized: false,
};

Playground.argTypes = {
    placeholderText: {
        control: {
            type: "text",
        },
        description: "What the field says before anything has been typed into it",
    },
    loading: {
        control: {
            type: "boolean",
        },
        description: "Whether the list is waiting for the items it is to show",
    },
    loadingType: {
        control: {
            type: "radio",
        },
        options: ["body-spinner", "body-skeleton", "input"],
        description: "Where the wait is shown, and what stands in place of the list",
    },
    selectionVariant: {
        control: {
            type: "radio",
        },
        options: ["single", "multiple"],
        description: "Whether one item or several can be picked",
    },
    showItemDividers: {
        control: {
            type: "boolean",
        },
        description: "Draws a line between the items",
    },
    announcementsEnabled: {
        control: {
            type: "boolean",
        },
        description: "Whether the list is announced as it is filtered",
    },
    virtualized: {
        control: {
            type: "boolean",
        },
        description: "Draws only the items in view, which is what keeps a long list quick",
    },
    items: {
        table: {
            disable: true,
        },
    },
    filterValue: {
        table: {
            disable: true,
        },
    },
    onFilterChange: {
        table: {
            disable: true,
        },
    },
};

Playground.parameters = {
    layout: "centered",
};
