import * as React from "react";
import {
    CheckmarkRegular,
    DismissRegular,
    PauseRegular,
    PlayRegular,
} from "@gamecrafters/base-ui-icons";
import {
    Button,
    Heading,
    IconButton,
    Stack,
    Swap as SwapComponent,
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
};

// The plainest swap there is: a pair of marks inside something that is pressed. It is drawn that
// way rather than on its own, since a swap carries nothing to press and only says what it was
// told, so what holds whether it is on is part of what the example is showing.
//
// The button is named for what it is for rather than for the mark standing in it, and says which
// of the two states it is in through aria-pressed. A name that changed with the mark would be read
// out as the press was made and leave a reader hearing the state they have just left.
//
// The page and the component it is about are both called Swap, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Swap, as an application
// importing it would
const DefaultPreview = () => {
    const [playing, setPlaying] = React.useState(false);

    return (
        <Stack align="start">
            <IconButton
                aria-label="Play"
                aria-pressed={playing}
                onClick={() => setPlaying((previous) => !previous)}
                icon={
                    <SwapComponent swap={playing}>
                        <SwapComponent.Indicator type="on">
                            <PauseRegular />
                        </SwapComponent.Indicator>
                        <SwapComponent.Indicator type="off">
                            <PlayRegular />
                        </SwapComponent.Indicator>
                    </SwapComponent>
                }
            />
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. Which of the two is shown is the
// caller's to hold, so it is got ready here
const defaultSetup = `const [playing, setPlaying] = React.useState(false);`;

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<IconButton
    aria-label="Play"
    aria-pressed={playing}
    onClick={() => setPlaying((previous) => !previous)}
    icon={
        <Swap swap={playing}>
            <Swap.Indicator type="on"><PauseRegular /></Swap.Indicator>
            <Swap.Indicator type="off"><PlayRegular /></Swap.Indicator>
        </Swap>
    }
/>`;

// How one mark gives way to the other. The five are drawn together rather than one to an example,
// since a movement is read against the others rather than on its own, and they are all told the
// one state so that a single press sets the five of them going at once and the differences can be
// watched side by side.
//
// The same pair of marks is given to each, so the movement is the whole of what tells them apart,
// and the pair is angular rather than round so that turning and flipping can be seen at all. Each
// is named by the value that drew it, standing in the middle of the mark it belongs to
const TransitionsPreview = () => {
    const [swapped, setSwapped] = React.useState(false);

    return (
        <Stack gap="normal" align="start">
            <Stack direction="horizontal" gap="normal" align="start">
                <Stack gap="condensed" align="center">
                    <SwapComponent swap={swapped}>
                        <SwapComponent.Indicator type="on">
                            <CheckmarkRegular />
                        </SwapComponent.Indicator>
                        <SwapComponent.Indicator type="off">
                            <DismissRegular />
                        </SwapComponent.Indicator>
                    </SwapComponent>
                    <Text size="small">fade</Text>
                </Stack>
                <Stack gap="condensed" align="center">
                    <SwapComponent swap={swapped} transition="flip">
                        <SwapComponent.Indicator type="on">
                            <CheckmarkRegular />
                        </SwapComponent.Indicator>
                        <SwapComponent.Indicator type="off">
                            <DismissRegular />
                        </SwapComponent.Indicator>
                    </SwapComponent>
                    <Text size="small">flip</Text>
                </Stack>
                <Stack gap="condensed" align="center">
                    <SwapComponent swap={swapped} transition="rotate">
                        <SwapComponent.Indicator type="on">
                            <CheckmarkRegular />
                        </SwapComponent.Indicator>
                        <SwapComponent.Indicator type="off">
                            <DismissRegular />
                        </SwapComponent.Indicator>
                    </SwapComponent>
                    <Text size="small">rotate</Text>
                </Stack>
                <Stack gap="condensed" align="center">
                    <SwapComponent swap={swapped} transition="scale">
                        <SwapComponent.Indicator type="on">
                            <CheckmarkRegular />
                        </SwapComponent.Indicator>
                        <SwapComponent.Indicator type="off">
                            <DismissRegular />
                        </SwapComponent.Indicator>
                    </SwapComponent>
                    <Text size="small">scale</Text>
                </Stack>
                <Stack gap="condensed" align="center">
                    <SwapComponent swap={swapped} transition="none">
                        <SwapComponent.Indicator type="on">
                            <CheckmarkRegular />
                        </SwapComponent.Indicator>
                        <SwapComponent.Indicator type="off">
                            <DismissRegular />
                        </SwapComponent.Indicator>
                    </SwapComponent>
                    <Text size="small">none</Text>
                </Stack>
            </Stack>
            <Button size="small" onClick={() => setSwapped((previous) => !previous)}>
                Swap
            </Button>
        </Stack>
    );
};

const transitionsSetup = `const [swapped, setSwapped] = React.useState(false);`;

// The stacks are part of what is being shown rather than the page's own furniture, since what the
// example is about is the five read beside one another and the one press that sets them going
const transitionsCode = `<Stack gap="normal" align="start">
    <Stack direction="horizontal" gap="normal" align="start">
        <Stack gap="condensed" align="center">
            <Swap swap={swapped}>
                <Swap.Indicator type="on"><CheckmarkRegular /></Swap.Indicator>
                <Swap.Indicator type="off"><DismissRegular /></Swap.Indicator>
            </Swap>
            <Text size="small">fade</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <Swap swap={swapped} transition="flip">
                <Swap.Indicator type="on"><CheckmarkRegular /></Swap.Indicator>
                <Swap.Indicator type="off"><DismissRegular /></Swap.Indicator>
            </Swap>
            <Text size="small">flip</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <Swap swap={swapped} transition="rotate">
                <Swap.Indicator type="on"><CheckmarkRegular /></Swap.Indicator>
                <Swap.Indicator type="off"><DismissRegular /></Swap.Indicator>
            </Swap>
            <Text size="small">rotate</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <Swap swap={swapped} transition="scale">
                <Swap.Indicator type="on"><CheckmarkRegular /></Swap.Indicator>
                <Swap.Indicator type="off"><DismissRegular /></Swap.Indicator>
            </Swap>
            <Text size="small">scale</Text>
        </Stack>
        <Stack gap="condensed" align="center">
            <Swap swap={swapped} transition="none">
                <Swap.Indicator type="on"><CheckmarkRegular /></Swap.Indicator>
                <Swap.Indicator type="off"><DismissRegular /></Swap.Indicator>
            </Swap>
            <Text size="small">none</Text>
        </Stack>
    </Stack>
    <Button size="small" onClick={() => setSwapped((previous) => !previous)}>
        Swap
    </Button>
</Stack>`;

// Words rather than marks. Both are laid on top of one another rather than one being taken off the
// page, so the swap stands as wide as the longer of the two and the button keeps its width as it
// is pressed rather than growing and shrinking under the pointer
const WordsPreview = () => {
    const [following, setFollowing] = React.useState(false);

    return (
        <Stack align="start">
            <Button onClick={() => setFollowing((previous) => !previous)}>
                <SwapComponent swap={following}>
                    <SwapComponent.Indicator type="on">Following</SwapComponent.Indicator>
                    <SwapComponent.Indicator type="off">Follow</SwapComponent.Indicator>
                </SwapComponent>
            </Button>
        </Stack>
    );
};

const wordsSetup = `const [following, setFollowing] = React.useState(false);`;

const wordsCode = `<Button onClick={() => setFollowing((previous) => !previous)}>
    <Swap swap={following}>
        <Swap.Indicator type="on">Following</Swap.Indicator>
        <Swap.Indicator type="off">Follow</Swap.Indicator>
    </Swap>
</Button>`;

// The swap as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: defaultSetup,
        preview: <DefaultPreview />,
        code: defaultCode,
    },
    {
        name: "Transitions",
        description:
            "How one mark gives way to the other. Each is a pair of movements that cross, one standing back as the other comes forward, so the two read as one thing changing rather than as two things taking turns. The five here are told the one state, so a single press sets them all going and the differences can be watched side by side.",
        setup: transitionsSetup,
        preview: <TransitionsPreview />,
        code: transitionsCode,
    },
    {
        name: "Holding words",
        description:
            "A swap holds whatever is put in it, words as readily as marks. Both are laid on top of one another rather than one being taken off the page, so it stands as wide as the longer of the two and a button that says what it will do next keeps its width as it is pressed.",
        setup: wordsSetup,
        preview: <WordsPreview />,
        code: wordsCode,
    },
];

// How one mark gives way to the other
const transition = '"fade" | "flip" | "rotate" | "scale" | "none"';

// Which of the two an indicator is
const indicatorType = '"on" | "off"';

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
    default: '"span"',
    description: "The element or component this is drawn as, in place of its default",
};

// Every prop the swap and its parts take, under the one that takes it. Which of the two is shown
// is written up first, since it is the whole of what a swap is told, and how it is drawn follows
const groups: ComponentPropGroup[] = [
    {
        name: "Swap",
        props: [
            {
                name: "swap",
                type: "boolean",
                default: "false",
                description:
                    "Which of the two indicators is shown: the one marked on where this is true, and the one marked off where it is not. The caller holds it, since a swap carries nothing to press and reports nothing",
            },
            {
                name: "transition",
                type: transition,
                default: '"fade"',
                description:
                    "How one indicator gives way to the other. None cuts straight from one to the other, which is what a swap that reports something rather than answers a press is given",
            },
            styling,
            polymorphic,
        ],
    },
    {
        name: "Swap.Indicator",
        props: [
            {
                name: "type",
                type: indicatorType,
                required: true,
                description:
                    "Which of the two this is. It is said rather than worked out from the order the pair was written in, so they can be laid out whichever way round reads better",
            },
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the swap is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Swap = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Swap
            </Heading>
            <Text as="p" size="large">
                Two things laid on the same square, one of which is shown at a time. Both stay on
                the page rather than one being taken off it, so the swap keeps the size of the
                larger of the two and nothing beside it moves as they change. It carries nothing to
                press and reports nothing: it is put inside whatever is pressed, and says only what
                it was told.
            </Text>
        </Stack>
        <ComponentExamples component="Swap" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Swap;
