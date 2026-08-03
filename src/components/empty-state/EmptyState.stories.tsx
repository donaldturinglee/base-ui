import type { StoryFn, Meta } from "@storybook/react-vite";
import { SearchRegular } from "@gamecrafters/base-ui-icons";
import { Button } from "../button";
import { EmptyState } from ".";
import type { EmptyStateProps } from "./EmptyState.types";

const classes = {
    box: "w-[var(--overlay-width-medium)] border-solid border-[length:var(--border-width-thin)] border-border-default rounded-[var(--border-radius-medium)]",
};

export default {
    title: "Components/EmptyState",
    component: EmptyState,
} as Meta<typeof EmptyState>;

export const Default: StoryFn<typeof EmptyState> = () => (
    <div className={classes.box}>
        <EmptyState
            icon={SearchRegular}
            title="No results found"
            description="Try a different search term"
        />
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<EmptyStateProps> = (args) => (
    <div className={classes.box}>
        <EmptyState {...args} />
    </div>
);

Playground.args = {
    title: "No results found",
    description: "Try a different search term",
    size: "medium",
};

Playground.argTypes = {
    title: {
        control: {
            type: "text",
        },
        description: "Says what is not there",
    },
    description: {
        control: {
            type: "text",
        },
        description: "Says why it is not there, or what to do about it",
    },
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium"],
        description: "Which step of the scale the message is drawn at",
    },
    icon: {
        table: {
            disable: true,
        },
    },
    actions: {
        table: {
            disable: true,
        },
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

export const WithActions: StoryFn<typeof EmptyState> = () => (
    <div className={classes.box}>
        <EmptyState
            icon={SearchRegular}
            title="No results found"
            description="Try a different search term, or clear the filters you have set"
            actions={<Button variant="primary">Clear filters</Button>}
        />
    </div>
);

WithActions.parameters = {
    layout: "centered",
};
