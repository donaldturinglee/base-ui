import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Avatar } from "../avatar";
import { Bubble } from "../bubble";
import { Spinner } from "../spinner";
import { Message } from ".";

const speakers = {
    ada: "https://avatars.githubusercontent.com/u/7143434?v=4",
    alan: "https://avatars.githubusercontent.com/u/1024025?v=4",
};

const classes = {
    // A message fills the room it is given, so the stories give it some
    container: "w-[var(--overlay-width-medium)]",
    thread: "flex flex-col gap-[var(--stack-gap-normal)]",
    // Reactions hang past the bubble's edge, so a thread carrying them needs room to hang into
    roomToHang: "flex flex-col gap-[var(--stack-gap-spacious)] py-[var(--base-size-8)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Message/Features",
    decorators: [withContainer],
    parameters: {
        layout: "centered",
    },
};

// Both Sides Of It, which is the whole of what a message is for. The same markup serves either
// speaker: only the side changes, and the row is laid out from the other end
export const Conversation: StoryFn<typeof Message> = () => (
    <div className={classes.thread}>
        <Message>
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.ada} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Message.Header>Ada</Message.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>

        <Message align="end">
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.alan} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Message.Header>Alan</Message.Header>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>
    </div>
);

// The Side Handed Down, where the message is told which side it comes down and everything it
// carries follows. The bubbles inside are never told the side themselves
export const AlignInherited: StoryFn<typeof Message> = () => (
    <Message align="end">
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.alan} />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Alan</Message.Header>
            <Bubble>
                <Bubble.Content>Thursday still works</Bubble.Content>
            </Bubble>
            <Bubble>
                <Bubble.Content>Same place as last time</Bubble.Content>
            </Bubble>
            <Message.Footer>Sent 09:20</Message.Footer>
        </Message.Content>
    </Message>
);

// A Run Of Messages, where the side is named once on the run rather than on every message in it.
// The messages sit closer together than one run does to the next, so the run reads as one turn.
//
// This is the shape for a run that carries no speaker beside it. Where there is a face to show,
// a turn is better written as one message holding several bubbles, as in AlignInherited above:
// the speaker then settles at the foot of the whole turn rather than against each line of it
export const Groups: StoryFn<typeof Message> = () => (
    <div className={classes.thread}>
        <Message.Group>
            <Message>
                <Message.Content>
                    <Message.Header>Ada</Message.Header>
                    <Bubble variant="muted">
                        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                    </Bubble>
                </Message.Content>
            </Message>
            <Message>
                <Message.Content>
                    <Bubble variant="muted">
                        <Bubble.Content>No rush, whenever you see this</Bubble.Content>
                    </Bubble>
                </Message.Content>
            </Message>
        </Message.Group>

        <Message.Group align="end">
            <Message>
                <Message.Content>
                    <Bubble>
                        <Bubble.Content>Thursday still works</Bubble.Content>
                    </Bubble>
                </Message.Content>
            </Message>
            <Message>
                <Message.Content>
                    <Bubble>
                        <Bubble.Content>Same place as last time</Bubble.Content>
                    </Bubble>
                </Message.Content>
            </Message>
        </Message.Group>
    </div>
);

// Named And Accounted For, where the lines above and below what was said are set in by as much as
// the words are, so the name stands over the first letter of them. The speaker is lifted back up
// beside the words rather than dropping to the foot of the line below them
export const WithAHeaderAndFooter: StoryFn<typeof Message> = () => (
    <div className={classes.thread}>
        <Message>
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.ada} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Message.Header>Ada · 09:14</Message.Header>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
                <Message.Footer>Read</Message.Footer>
            </Message.Content>
        </Message>

        <Message align="end">
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.alan} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Message.Header>Alan · 09:20</Message.Header>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
                <Message.Footer>Sent</Message.Footer>
            </Message.Content>
        </Message>
    </div>
);

// Nothing Standing Beside It, for a conversation with only two voices in it, where a column of
// the same two faces down the edge says nothing the side does not already say
export const WithoutAnAvatar: StoryFn<typeof Message> = () => (
    <div className={classes.thread}>
        <Message>
            <Message.Content>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>

        <Message align="end">
            <Message.Content>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                </Bubble>
            </Message.Content>
        </Message>
    </div>
);

// Words On The Page, where an unpainted bubble has no padding for the lines above and below it to
// line up with, so the message gives up its gutter and they line up with the words instead
export const WithAGhostBubble: StoryFn<typeof Message> = () => (
    <Message>
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.ada} />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Assistant</Message.Header>
            <Bubble variant="ghost">
                <Bubble.Content>
                    A meter is not going anywhere: it stands where it stands, and either end of it
                    is as ordinary a place to be as the middle. A progress bar is the other thing
                    entirely, and is expected to reach the end of what it is measuring.
                </Bubble.Content>
            </Bubble>
            <Message.Footer>Answered in 1.2s</Message.Footer>
        </Message.Content>
    </Message>
);

// Reacted To, where the pill hangs astride the bubble's edge and gathers at the corner the side
// of the message points to, without the bubble having been told which side that is
export const WithReactions: StoryFn<typeof Message> = () => (
    <div className={classes.roomToHang}>
        <Message>
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.ada} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Bubble variant="muted">
                    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
                    <Bubble.Reactions>👍 3</Bubble.Reactions>
                </Bubble>
            </Message.Content>
        </Message>

        <Message align="end">
            <Message.Avatar>
                <Avatar size={32}>
                    <Avatar.Image src={speakers.alan} />
                </Avatar>
            </Message.Avatar>
            <Message.Content>
                <Bubble>
                    <Bubble.Content>Thursday still works</Bubble.Content>
                    <Bubble.Reactions>🎉 1</Bubble.Reactions>
                </Bubble>
            </Message.Content>
        </Message>
    </div>
);

// Still Being Said, where the line below says what is happening rather than what happened
export const Pending: StoryFn<typeof Message> = () => (
    <Message>
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.ada} />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Message.Header>Assistant</Message.Header>
            <Bubble variant="muted">
                <Bubble.Content>Looking that up now</Bubble.Content>
            </Bubble>
            <Message.Footer>
                <Spinner size="small" />
            </Message.Footer>
        </Message.Content>
    </Message>
);

// Something Went Wrong, said in the words of the thing that failed rather than in the voice of
// whoever was speaking
export const Failed: StoryFn<typeof Message> = () => (
    <Message align="end">
        <Message.Avatar>
            <Avatar size={32}>
                <Avatar.Image src={speakers.alan} />
            </Avatar>
        </Message.Avatar>
        <Message.Content>
            <Bubble variant="danger">
                <Bubble.Content as="button" type="button">
                    Not sent. Tap to try again.
                </Bubble.Content>
            </Bubble>
            <Message.Footer>Failed 09:21</Message.Footer>
        </Message.Content>
    </Message>
);
