import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../button";
import { Text } from "../text";
import { Bubble } from ".";
import type { BubbleVariant } from "./Bubble.types";

const classes = {
    // A bubble is measured against the room it is given, so the stories give it some
    container: "w-[var(--overlay-width-medium)]",
    conversation: "flex flex-col gap-[var(--stack-gap-normal)]",
    swatches: "flex flex-col gap-[var(--stack-gap-normal)]",
    // Reactions hang past the bubble's edge, so a run of them needs room below to hang into
    roomToHang: "flex flex-col gap-[var(--stack-gap-spacious)] py-[var(--base-size-8)]",
};

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/Bubble/Features",
    decorators: [withContainer],
    parameters: {
        layout: "centered",
    },
};

// The Two Sides Of It, which is the whole of what a bubble is for: one voice on each edge, told
// apart by where it stands and by what it is painted, and neither of them labelled
export const Conversation: StoryFn<typeof Bubble> = () => (
    <div className={classes.conversation}>
        <Bubble variant="muted">
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        </Bubble>

        <Bubble align="end">
            <Bubble.Content>Thursday still works</Bubble.Content>
        </Bubble>

        <Bubble variant="muted">
            <Bubble.Content>Same place as last time?</Bubble.Content>
        </Bubble>
    </div>
);

// A Run From One Voice, where the side is named once and every turn in the run takes it. They sit
// closer to one another than one run does to the next, so the run reads as a single stretch of
// talk
export const Groups: StoryFn<typeof Bubble> = () => (
    <div className={classes.conversation}>
        <Bubble.Group>
            <Bubble variant="muted">
                <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            </Bubble>
            <Bubble variant="muted">
                <Bubble.Content>No rush, whenever you see this</Bubble.Content>
            </Bubble>
        </Bubble.Group>

        <Bubble.Group align="end">
            <Bubble>
                <Bubble.Content>Thursday still works</Bubble.Content>
            </Bubble>
            <Bubble>
                <Bubble.Content>Same place as last time</Bubble.Content>
            </Bubble>
        </Bubble.Group>
    </div>
);

// Painted, for a conversation that has more than two voices in it, or a turn that is not speech
// at all
export const Variants: StoryFn<typeof Bubble> = () => (
    <div className={classes.swatches}>
        {(
            [
                "default",
                "secondary",
                "muted",
                "tinted",
                "outline",
                "ghost",
                "danger",
            ] as const satisfies readonly BubbleVariant[]
        ).map((variant) => (
            <Bubble key={variant} variant={variant}>
                <Bubble.Content>{variant}</Bubble.Content>
            </Bubble>
        ))}
    </div>
);

// Carrying More Than Words, where the timestamp stands beside the painted surface rather than on
// it. The bubble hands the variant down to the surface, so nothing else it carries is painted
export const WithATimestamp: StoryFn<typeof Bubble> = () => (
    <div className={classes.conversation}>
        <Bubble variant="muted">
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            <Text size="small">09:14</Text>
        </Bubble>

        <Bubble align="end">
            <Bubble.Content>Thursday still works</Bubble.Content>
            <Text size="small">09:20</Text>
        </Bubble>
    </div>
);

// Acted On, where the turn leads somewhere or does something. It is rendered as the thing that
// acts, so the pointer, the focus ring and the reading a screen reader gives it all follow from
// the element rather than from a prop
export const Actionable: StoryFn<typeof Bubble> = () => (
    <div className={classes.conversation}>
        <Bubble variant="outline">
            <Bubble.Content as="button" type="button">
                Retry sending this
            </Bubble.Content>
        </Bubble>

        <Bubble variant="tinted">
            <Bubble.Content as="a" href="#thread">
                Jump to the rest of the thread
            </Bubble.Content>
        </Bubble>
    </div>
);

// Reacted To, which is lifted out of the flow so that reacting to a turn does not push what was
// said after it down the page. The corner follows the side the turn stands on, so a conversation
// running down both edges keeps its reactions on the outside
export const WithReactions: StoryFn<typeof Bubble> = () => (
    <div className={classes.roomToHang}>
        <Bubble variant="muted">
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            <Bubble.Reactions>👍 3</Bubble.Reactions>
        </Bubble>

        <Bubble align="end">
            <Bubble.Content>Thursday still works</Bubble.Content>
            <Bubble.Reactions>🎉 1</Bubble.Reactions>
        </Bubble>
    </div>
);

// Reacted To At The Top, for a conversation whose turns are read from the bottom up and where the
// room below one turn belongs to the next
export const ReactionsOnTop: StoryFn<typeof Bubble> = () => (
    <div className={classes.roomToHang}>
        <Bubble variant="muted">
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            <Bubble.Reactions side="top">👍 3</Bubble.Reactions>
        </Bubble>

        <Bubble variant="muted">
            <Bubble.Content>Same place as last time?</Bubble.Content>
            <Bubble.Reactions side="top" align="start">
                ❤️ 2
            </Bubble.Reactions>
        </Bubble>
    </div>
);

// Reactions That Can Be Pressed, where each one carries room of its own and the pill gives its
// padding up rather than setting a second ring of it around them
export const ActionableReactions: StoryFn<typeof Bubble> = () => (
    <div className={classes.roomToHang}>
        <Bubble variant="muted">
            <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
            <Bubble.Reactions>
                <Button variant="invisible" size="small" count={3}>
                    👍
                </Button>
                <Button variant="invisible" size="small" count={1}>
                    🎉
                </Button>
            </Bubble.Reactions>
        </Bubble>
    </div>
);

// Unpainted, for a turn that is not being framed as speech: a note about what happened, or a
// stretch of prose long enough that a painted ground would sit under it as a slab. It gives up
// the width a bubble is held to as well as the ground it stands on
export const Ghost: StoryFn<typeof Bubble> = () => (
    <div className={classes.conversation}>
        <Bubble variant="ghost">
            <Bubble.Content>
                A meter is not going anywhere: it stands where it stands, and either end of it is as
                ordinary a place to be as the middle. A progress bar is the other thing entirely,
                and is expected to reach the end of what it is measuring.
            </Bubble.Content>
        </Bubble>

        <Bubble align="end">
            <Bubble.Content>That is the distinction I was after, thank you</Bubble.Content>
        </Bubble>
    </div>
);

// A Turn That Failed, said in the words of the thing that went wrong rather than in the voice of
// whoever was speaking
export const Danger: StoryFn<typeof Bubble> = () => (
    <div className={classes.conversation}>
        <Bubble align="end">
            <Bubble.Content>Same place as last time?</Bubble.Content>
        </Bubble>

        <Bubble align="end" variant="danger">
            <Bubble.Content>Not sent. Tap to try again.</Bubble.Content>
        </Bubble>
    </div>
);

// Held To The Room It Was Given, where a turn long enough to run past it is broken rather than
// allowed to stretch the conversation. A string with nowhere to break in it is broken anyway
export const LongContent: StoryFn<typeof Bubble> = () => (
    <div className={classes.conversation}>
        <Bubble variant="muted">
            <Bubble.Content>
                The value is handed to the stylesheet as a custom property rather than turned into a
                width in the component, so how far the indicator runs is settled in the same place
                as the colour and the height it is drawn with.
            </Bubble.Content>
        </Bubble>

        <Bubble align="end">
            <Bubble.Content>
                https://example.com/a-very-long-address-with-nowhere-in-it-that-a-line-would-break
            </Bubble.Content>
        </Bubble>
    </div>
);
