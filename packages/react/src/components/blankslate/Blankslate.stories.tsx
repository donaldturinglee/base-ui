import type { StoryFn, Meta } from "@storybook/react-vite";
import { BookRegular } from "@gamecrafters/base-ui-icons";
import { Link } from "../link";
import { Blankslate } from ".";
import type { BlankslateProps } from "./Blankslate.types";

const classes = {
    icon: "size-[var(--base-size-24)]",
};

export default {
    title: "Components/Blankslate",
    component: Blankslate,
} as Meta<typeof Blankslate>;

export const Default: StoryFn<typeof Blankslate> = () => (
    <Blankslate>
        <Blankslate.Visual>
            <BookRegular className={classes.icon} />
        </Blankslate.Visual>
        <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
        <Blankslate.Description>
            Wikis give your project a place to lay out its roadmap, show the current status, and
            document the work as a team.
        </Blankslate.Description>
        <Blankslate.PrimaryAction>
            <Link as="button">Create the first page</Link>
        </Blankslate.PrimaryAction>
        <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
    </Blankslate>
);

type PlaygroundArgs = BlankslateProps & {
    primaryAction?: boolean;
    secondaryAction?: boolean;
};

export const Playground: StoryFn<PlaygroundArgs> = ({
    primaryAction,
    secondaryAction,
    ...args
}) => (
    <Blankslate {...args}>
        <Blankslate.Visual>
            <BookRegular className={classes.icon} />
        </Blankslate.Visual>
        <Blankslate.Heading>Welcome to the wiki</Blankslate.Heading>
        <Blankslate.Description>
            Wikis give your project a place to lay out its roadmap, show the current status, and
            document the work as a team.
        </Blankslate.Description>
        {primaryAction ? (
            <Blankslate.PrimaryAction>
                <Link as="button">Create the first page</Link>
            </Blankslate.PrimaryAction>
        ) : null}
        {secondaryAction ? (
            <Blankslate.SecondaryAction href="#">Learn more about wikis</Blankslate.SecondaryAction>
        ) : null}
    </Blankslate>
);

Playground.args = {
    size: "medium",
    border: false,
    narrow: false,
    spacious: false,
    primaryAction: true,
    secondaryAction: true,
};

Playground.argTypes = {
    size: {
        control: {
            type: "radio",
        },
        options: ["small", "medium", "large"],
        description: "Sets the type scale, padding and visual size",
    },
    border: {
        control: {
            type: "boolean",
        },
        description: "Draws a border around the blankslate",
    },
    narrow: {
        control: {
            type: "boolean",
        },
        description: "Constrains the blankslate and centres it",
    },
    spacious: {
        control: {
            type: "boolean",
        },
        description: "Opens up the padding around the content",
    },
    primaryAction: {
        control: {
            type: "boolean",
        },
        description: "Shows or hides the primary action",
    },
    secondaryAction: {
        control: {
            type: "boolean",
        },
        description: "Shows or hides the secondary action",
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
