import type { StoryFn, Meta } from "@storybook/react-vite";
import { Link } from "../link";
import { Text } from "../text";
import { HoverCard } from ".";
import type { HoverCardProps } from "./HoverCard.types";

const classes = {
    // Gives the card room to open into, rather than against the top of the frame
    container: "p-[var(--base-size-40)]",
    body: "flex flex-col gap-[var(--base-size-4)]",
    muted: "text-[var(--foreground-color-muted)]",
};

export default {
    title: "Components/HoverCard",
    component: HoverCard,
} as Meta<typeof HoverCard>;

export const Default: StoryFn<typeof HoverCard> = () => (
    <div className={classes.container}>
        <Text>
            Reviewed by{" "}
            <HoverCard>
                <HoverCard.Trigger>
                    <Link href="#monalisa" inline>
                        monalisa
                    </Link>
                </HoverCard.Trigger>
                <HoverCard.Content>
                    <div className={classes.body}>
                        <Text weight="semibold">Mona Lisa Octocat</Text>
                        <Text size="small" className={classes.muted}>
                            Engineer at GitHub. Works on the things that hold the rest of it up.
                        </Text>
                    </div>
                </HoverCard.Content>
            </HoverCard>{" "}
            two days ago.
        </Text>
    </div>
);

export const Playground: StoryFn<HoverCardProps> = (args) => (
    <div className={classes.container}>
        <HoverCard {...args}>
            <HoverCard.Trigger>
                <Link href="#monalisa" inline>
                    monalisa
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Content>
                <div className={classes.body}>
                    <Text weight="semibold">Mona Lisa Octocat</Text>
                    <Text size="small" className={classes.muted}>
                        Engineer at GitHub. Works on the things that hold the rest of it up.
                    </Text>
                </div>
            </HoverCard.Content>
        </HoverCard>
    </div>
);

Playground.args = {
    side: "outside-bottom",
    align: "start",
    openDelay: 500,
    closeDelay: 300,
    disabled: false,
};

Playground.argTypes = {
    side: {
        control: {
            type: "radio",
        },
        options: ["outside-top", "outside-right", "outside-bottom", "outside-left"],
        description: "Which edge of the trigger the card stands off",
    },
    align: {
        control: {
            type: "radio",
        },
        options: ["start", "center", "end"],
        description: "Where along that edge the card lines up",
    },
    openDelay: {
        control: {
            type: "number",
        },
        description: "How long the pointer has to rest on the trigger before the card opens",
    },
    closeDelay: {
        control: {
            type: "number",
        },
        description: "How long the card is left standing once the pointer has left",
    },
    disabled: {
        control: {
            type: "boolean",
        },
        description: "Stops the card opening at all",
    },
    children: {
        table: {
            disable: true,
        },
    },
};
