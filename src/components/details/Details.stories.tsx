import type { StoryFn, Meta } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Details } from ".";
import type { DetailsProps } from "./Details.types";

const classes = {
    // Gives the content a width to sit in rather than the width of the page
    container: "w-[20rem]",
};

export default {
    title: "Components/Details",
    component: Details,
} as Meta<typeof Details>;

export const Default: StoryFn<typeof Details> = () => (
    <Details className={classes.container}>
        <Details.Summary as={Button}>See details</Details.Summary>
        <Text as="p">
            The branch was merged an hour ago, and the two commits on it are now on main.
        </Text>
    </Details>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<DetailsProps> = (args) => (
    <Details {...args} className={classes.container}>
        <Details.Summary as={Button}>See details</Details.Summary>
        <Text as="p">
            The branch was merged an hour ago, and the two commits on it are now on main.
        </Text>
    </Details>
);

Playground.args = {
    defaultOpen: false,
    closeOnOutsideClick: false,
};

Playground.argTypes = {
    defaultOpen: {
        control: {
            type: "boolean",
        },
        description: "Whether the disclosure starts out open, where it holds the state itself",
    },
    closeOnOutsideClick: {
        control: {
            type: "boolean",
        },
        description: "Closes the disclosure again where a click lands outside of it",
    },
    open: {
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
