import type { StoryFn, Meta } from "@storybook/react-vite";
import { Avatar } from "../avatar";
import { Bubble } from "../bubble";
import { Message } from ".";
import type { MessageProps } from "./Message.types";

const source = "https://avatars.githubusercontent.com/u/7143434?v=4";

const classes = {
    // A message fills the room it is given, so the stories give it some
    container: "w-[var(--overlay-width-medium)]",
};

export default {
    title: "Components/Message",
    component: Message,
} as Meta<typeof Message>;

export const Default: StoryFn<typeof Message> = () => (
    <div className={classes.container}>
        <Message>
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={source} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Message.Header>Ada</Message.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>
    </div>
);

Default.parameters = {
    layout: "centered",
};

export const Playground: StoryFn<MessageProps> = (args) => (
    <div className={classes.container}>
        <Message {...args}>
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={source} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Message.Header>Ada</Message.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
                <Message.Footer>Sent 09:14</Message.Footer>
            </Message.Content>
        </Message>
    </div>
);

Playground.args = {
    align: "start",
};

Playground.argTypes = {
    align: {
        control: {
            type: "radio",
        },
        options: ["start", "end"],
        description: "Which side of the conversation the message comes down",
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
