import {
    Bubble as BubbleComponent,
    Button,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A turn takes a share of the room it was given rather than a width of its own, and the side
    // it stands on is read against the edges of that room, so the examples are held to the width a
    // column of talk is actually read at rather than run the width of the card
    conversation: "w-full max-w-[30rem]",
    // Reactions are hung past the bubble's edge rather than set below it, so a turn carrying them
    // wants room above and below to hang into
    roomToHang: "w-full max-w-[30rem] py-[var(--base-size-8)]",
};

// The plainest turn there is: the words, on the ground a turn comes to, standing on the side one
// stands on where it is told neither. The width around it is the page's own furniture, as the card
// is, so the listing beneath is of the turn alone.
//
// The page and the component it is about are both called Bubble, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Bubble, as an application
// importing it would
const defaultPreview = (
    <Stack className={classes.conversation}>
        <BubbleComponent>
            <BubbleComponent.Content>Are we still on for Thursday?</BubbleComponent.Content>
        </BubbleComponent>
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Bubble>
    <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
</Bubble>`;

// What the surface is painted. The seven are drawn together rather than one to an example, since a
// paint is read against the others rather than on its own, and each is named by the value that drew
// it. Ghost is the one that is not a surface at all, which is why it is read here as a line of words
// where the rest are read as grounds
const variantsPreview = (
    <Stack gap="condensed" className={classes.conversation}>
        <BubbleComponent variant="default">
            <BubbleComponent.Content>default</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="secondary">
            <BubbleComponent.Content>secondary</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>muted</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="tinted">
            <BubbleComponent.Content>tinted</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="outline">
            <BubbleComponent.Content>outline</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="ghost">
            <BubbleComponent.Content>ghost</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="danger">
            <BubbleComponent.Content>danger</BubbleComponent.Content>
        </BubbleComponent>
    </Stack>
);

// The column is part of what is being shown rather than the page's own furniture, since a turn is
// measured against the room it was given and stands against the edges of it. The width is written
// out as the classes it stands for rather than as the name the page holds it under, since what is
// copied out of here has only itself to reach for
const variantsCode = `<Stack gap="condensed" className="w-full max-w-[30rem]">
    <Bubble variant="default">
        <Bubble.Content>default</Bubble.Content>
    </Bubble>
    <Bubble variant="secondary">
        <Bubble.Content>secondary</Bubble.Content>
    </Bubble>
    <Bubble variant="muted">
        <Bubble.Content>muted</Bubble.Content>
    </Bubble>
    <Bubble variant="tinted">
        <Bubble.Content>tinted</Bubble.Content>
    </Bubble>
    <Bubble variant="outline">
        <Bubble.Content>outline</Bubble.Content>
    </Bubble>
    <Bubble variant="ghost">
        <Bubble.Content>ghost</Bubble.Content>
    </Bubble>
    <Bubble variant="danger">
        <Bubble.Content>danger</Bubble.Content>
    </Bubble>
</Stack>`;

// The two sides of it, which is the whole of what a bubble is for: one voice on each edge, told
// apart by where it stands and by what it is painted, and neither of them labelled. The side is
// what a reader takes to mean the speaker, so nothing here says who is talking
const conversationPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>Are we still on for Thursday?</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent align="end">
            <BubbleComponent.Content>Thursday still works</BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>Same place as last time?</BubbleComponent.Content>
        </BubbleComponent>
    </Stack>
);

const conversationCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Bubble variant="muted">
        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
    </Bubble>
    <Bubble align="end">
        <Bubble.Content>Thursday still works</Bubble.Content>
    </Bubble>
    <Bubble variant="muted">
        <Bubble.Content>Same place as last time?</Bubble.Content>
    </Bubble>
</Stack>`;

// A run of turns from one voice, where the side is named once and every turn in the run takes it.
// They sit closer to one another than one run sits to the next, so a run reads as a single stretch
// of talk rather than as several separate ones
const groupPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <BubbleComponent.Group>
            <BubbleComponent variant="muted">
                <BubbleComponent.Content>Are we still on for Thursday?</BubbleComponent.Content>
            </BubbleComponent>
            <BubbleComponent variant="muted">
                <BubbleComponent.Content>No rush, whenever you see this</BubbleComponent.Content>
            </BubbleComponent>
        </BubbleComponent.Group>
        <BubbleComponent.Group align="end">
            <BubbleComponent>
                <BubbleComponent.Content>Thursday still works</BubbleComponent.Content>
            </BubbleComponent>
            <BubbleComponent>
                <BubbleComponent.Content>Same place as last time</BubbleComponent.Content>
            </BubbleComponent>
        </BubbleComponent.Group>
    </Stack>
);

const groupCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
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
</Stack>`;

// A turn carrying more than what was said. The bubble is the frame and the content is the surface,
// so the timestamp stands beside the painted ground rather than on it, and neither part has to know
// which variant it is standing in
const timestampPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>Are we still on for Thursday?</BubbleComponent.Content>
            <Text size="small">09:14</Text>
        </BubbleComponent>
        <BubbleComponent align="end">
            <BubbleComponent.Content>Thursday still works</BubbleComponent.Content>
            <Text size="small">09:20</Text>
        </BubbleComponent>
    </Stack>
);

const timestampCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Bubble variant="muted">
        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        <Text size="small">09:14</Text>
    </Bubble>
    <Bubble align="end">
        <Bubble.Content>Thursday still works</Bubble.Content>
        <Text size="small">09:20</Text>
    </Bubble>
</Stack>`;

// A turn that leads somewhere or does something. It is drawn as the thing that acts rather than
// told it acts, so the pointer, the focus ring and the reading a screen reader gives it all follow
// from the element, and a surface that does nothing is never drawn as though it does
const actionablePreview = (
    <Stack gap="normal" className={classes.conversation}>
        <BubbleComponent variant="outline">
            <BubbleComponent.Content as="button" type="button">
                Retry sending this
            </BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent variant="tinted">
            <BubbleComponent.Content as="a" href="#thread">
                Jump to the rest of the thread
            </BubbleComponent.Content>
        </BubbleComponent>
    </Stack>
);

const actionableCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Bubble variant="outline">
        <Bubble.Content as="button" type="button">Retry sending this</Bubble.Content>
    </Bubble>
    <Bubble variant="tinted">
        <Bubble.Content as="a" href="#thread">Jump to the rest of the thread</Bubble.Content>
    </Bubble>
</Stack>`;

// What has been hung on a turn since it was taken. It is lifted out of the flow, so reacting to a
// turn does not push everything said after it down the page, and it gathers at the corner the turn's
// own side points to, so a conversation running down both edges keeps its reactions on the outside
const reactionsPreview = (
    <Stack gap="spacious" className={classes.roomToHang}>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>Are we still on for Thursday?</BubbleComponent.Content>
            <BubbleComponent.Reactions>👍 3</BubbleComponent.Reactions>
        </BubbleComponent>
        <BubbleComponent align="end">
            <BubbleComponent.Content>Thursday still works</BubbleComponent.Content>
            <BubbleComponent.Reactions>🎉 1</BubbleComponent.Reactions>
        </BubbleComponent>
    </Stack>
);

// The room above and below is part of what is being shown rather than the page's own furniture,
// since the pill hangs past the edge it is pinned to and would otherwise be clipped by whatever the
// conversation was put in
const reactionsCode = `<Stack gap="spacious" className="w-full max-w-[30rem] py-[var(--base-size-8)]">
    <Bubble variant="muted">
        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        <Bubble.Reactions>👍 3</Bubble.Reactions>
    </Bubble>
    <Bubble align="end">
        <Bubble.Content>Thursday still works</Bubble.Content>
        <Bubble.Reactions>🎉 1</Bubble.Reactions>
    </Bubble>
</Stack>`;

// Reactions hung over the top edge instead, for a conversation read from the bottom up, where the
// room below one turn belongs to the next. The second names the corner itself rather than taking the
// one the turn's side points to
const reactionsTopPreview = (
    <Stack gap="spacious" className={classes.roomToHang}>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>Are we still on for Thursday?</BubbleComponent.Content>
            <BubbleComponent.Reactions side="top">👍 3</BubbleComponent.Reactions>
        </BubbleComponent>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>Same place as last time?</BubbleComponent.Content>
            <BubbleComponent.Reactions side="top" align="end">
                ❤️ 2
            </BubbleComponent.Reactions>
        </BubbleComponent>
    </Stack>
);

const reactionsTopCode = `<Stack gap="spacious" className="w-full max-w-[30rem] py-[var(--base-size-8)]">
    <Bubble variant="muted">
        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        <Bubble.Reactions side="top">👍 3</Bubble.Reactions>
    </Bubble>
    <Bubble variant="muted">
        <Bubble.Content>Same place as last time?</Bubble.Content>
        <Bubble.Reactions side="top" align="end">❤️ 2</Bubble.Reactions>
    </Bubble>
</Stack>`;

// Reactions that can be pressed rather than only read. Each carries room of its own, so the pill
// gives its padding up rather than setting a second ring of it around them
const actionableReactionsPreview = (
    <Stack gap="spacious" className={classes.roomToHang}>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>Are we still on for Thursday?</BubbleComponent.Content>
            <BubbleComponent.Reactions>
                <Button variant="invisible" size="small" count={3}>
                    👍
                </Button>
                <Button variant="invisible" size="small" count={1}>
                    🎉
                </Button>
            </BubbleComponent.Reactions>
        </BubbleComponent>
    </Stack>
);

const actionableReactionsCode = `<Stack gap="spacious" className="w-full max-w-[30rem] py-[var(--base-size-8)]">
    <Bubble variant="muted">
        <Bubble.Content>Are we still on for Thursday?</Bubble.Content>
        <Bubble.Reactions>
            <Button variant="invisible" size="small" count={3}>👍</Button>
            <Button variant="invisible" size="small" count={1}>🎉</Button>
        </Bubble.Reactions>
    </Bubble>
</Stack>`;

// A turn long enough to run past the room it was given, which is broken rather than allowed to
// stretch the conversation. A string with nowhere in it that a line would break is broken anyway,
// since a pasted address should widen a turn no further than anything else does
const longContentPreview = (
    <Stack gap="normal" className={classes.conversation}>
        <BubbleComponent variant="muted">
            <BubbleComponent.Content>
                I had a look at the room they have moved us into and it is a good deal smaller than
                the last one, so if everyone brings someone we will be standing.
            </BubbleComponent.Content>
        </BubbleComponent>
        <BubbleComponent align="end">
            <BubbleComponent.Content>
                https://example.com/a-very-long-address-with-nowhere-in-it-that-a-line-would-break
            </BubbleComponent.Content>
        </BubbleComponent>
    </Stack>
);

const longContentCode = `<Stack gap="normal" className="w-full max-w-[30rem]">
    <Bubble variant="muted">
        <Bubble.Content>
            I had a look at the room they have moved us into and it is a good deal smaller
            than the last one, so if everyone brings someone we will be standing.
        </Bubble.Content>
    </Bubble>
    <Bubble align="end">
        <Bubble.Content>
            https://example.com/a-very-long-address-with-nowhere-in-it-that-a-line-would-break
        </Bubble.Content>
    </Bubble>
</Stack>`;

// The bubble as it is reached for, drawn and written out one above the other. The plainest one comes
// first, then what a turn is painted, then the conversation the turns are read in, and after those
// whatever a turn carries besides the words
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Variants",
        description:
            "What the surface is painted, rather than the colour it happens to come out, so the scheme underneath can be changed without every name going stale. Ghost is the one that is not a surface at all: it gives up the ground, the corners and the padding, and with them the share of the room a turn is otherwise held to, for a note about what happened or a stretch of prose long enough that a painted ground would sit under it as a slab.",
        preview: variantsPreview,
        code: variantsCode,
    },
    {
        name: "A conversation",
        description:
            "Which side of the conversation a turn stands on, which is the whole of what a bubble is for. A reader takes the side to mean the speaker without ever being told so, so the two voices are told apart by where they stand and by what they are painted rather than by a label on either of them.",
        preview: conversationPreview,
        code: conversationCode,
    },
    {
        name: "A run from one voice",
        description:
            "Several turns from the same speaker, with the side named once on the run rather than again on each of them. They sit closer to one another than one run sits to the next, so a run reads as a single stretch of talk. A turn that names a side of its own still takes it, since the nearer of the two wins.",
        preview: groupPreview,
        code: groupCode,
    },
    {
        name: "Carrying more than words",
        description:
            "A timestamp, a line of controls, a note about delivery — whatever a turn carries besides what was said. The bubble is the frame and the content is the surface, so what the variant paints lands on the surface alone and everything else stands beside it, on the ground the conversation stands on.",
        preview: timestampPreview,
        code: timestampCode,
    },
    {
        name: "Something to act on",
        description:
            "A turn that leads somewhere or does something, drawn as the thing that acts rather than told that it acts. The pointer, the focus ring and the reading a screen reader gives it all follow from the element, so a surface that does nothing is never drawn as though it does.",
        preview: actionablePreview,
        code: actionableCode,
    },
    {
        name: "Reactions",
        description:
            "What has been hung on a turn since it was taken, gathered into a pill sitting astride one of the bubble's edges. It is lifted out of the flow, so reacting to a turn does not push everything said after it down the page, and it gathers at the corner the turn's own side points to, so a conversation running down both edges keeps its reactions on the outside where there is room for them.",
        preview: reactionsPreview,
        code: reactionsCode,
    },
    {
        name: "Reactions above the turn",
        description:
            "The pill hung over the top edge instead, for a conversation read from the bottom up, where the room below one turn belongs to the next. The corner can be named outright as well, for a turn whose reactions belong somewhere other than the side it stands on.",
        preview: reactionsTopPreview,
        code: reactionsTopCode,
    },
    {
        name: "Reactions that can be pressed",
        description:
            "Reactions that are added to and taken back rather than only read. Each one carries room of its own, so the pill gives its padding up rather than setting a second ring of it around them.",
        preview: actionableReactionsPreview,
        code: actionableReactionsCode,
    },
    {
        name: "Held to the room it was given",
        description:
            "A turn takes only as much width as its words need, up to a share of the room it was given, since one run to the full width would leave nothing to say which side of the conversation it came from. Words long enough to run past that are broken, and so is a string with nowhere in it that a line would break.",
        preview: longContentPreview,
        code: longContentCode,
    },
];

// Which side of the conversation a turn stands on. It stands as the values themselves rather than as
// the name they are collected under, since one of them is what a caller actually hands over
const align = '"start" | "end"';

// What the surface is painted
const variant = '"default" | "secondary" | "muted" | "tinted" | "outline" | "ghost" | "danger"';

// Which of the bubble's edges the reactions are hung over
const side = '"top" | "bottom"';

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"div"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the bubble and its parts take, under the one that takes it. The turn comes first, since
// it is what the page is about, then the run it stands in, then the surface it is painted on and
// what has been hung off it
const groups: ComponentPropGroup[] = [
    {
        name: "Bubble",
        props: [
            {
                name: "variant",
                type: variant,
                default: '"default"',
                description:
                    "What the surface is painted, rather than the colour it happens to come out. It is handed down to the content rather than set on the bubble, so anything else the turn carries stands beside the painted ground rather than on it",
            },
            {
                name: "align",
                type: align,
                description:
                    "Which side of the conversation the turn stands on, which is what a reader takes to mean the speaker. Left unsaid, it takes the side of the run it stands in, or of the message carrying it, and stands at the start where there is neither",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Bubble.Group",
        props: [
            {
                name: "align",
                type: align,
                default: '"start"',
                description:
                    "The side every turn in the run stands on. A speaker does not change sides part way through a run, so it is named here rather than on each of them; a turn that names one of its own still takes it",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Bubble.Content",
        props: [
            {
                name: "as",
                type: "React.ElementType",
                default: '"div"',
                description:
                    "The element the surface is drawn as. A turn that can be acted on is drawn as the thing that acts — a button for one that is pressed, an anchor for one that leads somewhere — so the pointer and the focus ring follow from the element rather than from a prop of its own",
            },
            styling,
        ],
    },
    {
        name: "Bubble.Reactions",
        props: [
            {
                name: "side",
                type: side,
                default: '"bottom"',
                description:
                    "Which of the bubble's edges the pill is hung over. The top is what a conversation read from the bottom up wants, where the room below one turn belongs to the next",
            },
            {
                name: "align",
                type: align,
                description:
                    "Which corner of that edge the pill gathers at. Left unsaid, it follows the side the turn stands on, so a conversation running down both edges keeps its reactions on the outside",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the bubble is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const Bubble = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Bubble
            </Heading>
            <Text as="p" size="large">
                One turn in a conversation: what was said, and whatever has been hung off it since.
                Which side it stands on is what says who said it, so a conversation is read as two
                voices without either of them being labelled. The bubble is the frame rather than
                the surface — what the variant paints lands on the content inside it — so a turn
                carrying a timestamp or a row of controls stands them beside the painted ground
                rather than on it.
            </Text>
        </Stack>
        <ComponentExamples component="Bubble" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Bubble;
