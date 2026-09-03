import * as React from "react";
import { PersonRegular, StarRegular } from "@gamecrafters/base-ui-icons";
import { Heading, Stack, Text, Token as TokenComponent } from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
};

// The plainest token there is: the words it stands for, and nothing said with a prop. It comes to
// one that answers nothing and cannot be taken back out, which is what a token standing in a list
// of what has already been picked is.
//
// The Stack that holds it to the start of the card is the page's own furniture, as the card around
// it is, so the listing beneath is of the token alone. The card lays what it is handed out in a
// column, and a column stretches what it holds the whole way across unless it is told otherwise,
// which would draw a pill the width of the page.
//
// The page and the component it is about are both called Token, so the component is brought in
// under a name saying which of the two it is. The listing beneath says Token, as an application
// importing it would
const defaultPreview = (
    <Stack align="start">
        <TokenComponent text="monalisa" />
    </Stack>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<Token text="monalisa" />`;

// How much room the token is given. The four are drawn together rather than one to an example,
// since a size is read against the others rather than on its own, and each is named for the size it
// was given so what is read off the token is the value that drew it.
//
// They are lined up on their centres rather than at their feet, so what is read between them is the
// height and not where each of them was set down
const sizesPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <TokenComponent size="small" text="small" />
        <TokenComponent size="medium" text="medium" />
        <TokenComponent size="large" text="large" />
        <TokenComponent size="xlarge" text="xlarge" />
    </Stack>
);

// The stack is part of what is being shown rather than the page's own furniture, since what the
// example is about is the four read beside one another, so it is written out with them. The example
// above is held to the start of the card by a Stack that does nothing else, which is the page's own
// and is left out; nothing is held back from one that is already being shown
const sizesCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Token size="small" text="small" />
    <Token size="medium" text="medium" />
    <Token size="large" text="large" />
    <Token size="xlarge" text="xlarge" />
</Stack>`;

// What stands before the words. The four sizes are drawn together rather than one alone, since what
// is being shown is that the smallest has no room for one and is drawn without it, which cannot be
// read off a token that has one
const visualPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <TokenComponent size="small" text="monalisa" leadingVisual={PersonRegular} />
        <TokenComponent size="medium" text="monalisa" leadingVisual={PersonRegular} />
        <TokenComponent size="large" text="monalisa" leadingVisual={PersonRegular} />
        <TokenComponent size="xlarge" text="monalisa" leadingVisual={PersonRegular} />
    </Stack>
);

const visualCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Token size="small" text="monalisa" leadingVisual={PersonRegular} />
    <Token size="medium" text="monalisa" leadingVisual={PersonRegular} />
    <Token size="large" text="monalisa" leadingVisual={PersonRegular} />
    <Token size="xlarge" text="monalisa" leadingVisual={PersonRegular} />
</Stack>`;

// Tokens that can be taken back out. The list has to be kept somewhere for a token to be able to
// leave it, so the example is a component of its own rather than an element the page holds ready.
//
// What is done with the list is the reason for holding it at all, so a token that has been taken
// out is actually gone rather than only reported
const RemovablePreview = () => {
    const [tokens, setTokens] = React.useState(["zero", "one", "two", "three"]);

    return (
        <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
            {tokens.map((token) => (
                <TokenComponent
                    key={token}
                    text={token}
                    onRemove={() => setTokens((current) => current.filter((one) => one !== token))}
                />
            ))}
        </Stack>
    );
};

// What the example has to have in hand before it can be drawn. The tokens are the caller's rather
// than the token's own, so the list is got ready here
const removableSetup = `const [tokens, setTokens] = React.useState(["zero", "one", "two", "three"]);`;

const removableCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    {tokens.map((token) => (
        <Token
            key={token}
            text={token}
            onRemove={() => setTokens((current) => current.filter((one) => one !== token))}
        />
    ))}
</Stack>`;

// A token that answers the reader, drawn as the link or the button it stands for. The one that
// answers nothing is drawn beside them, since what tells them apart is what happens under the
// pointer rather than how any one of them looks standing still
const interactivePreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <TokenComponent as="a" href="#" text="A link" />
        <TokenComponent as="button" text="A button" onClick={() => {}} />
        <TokenComponent text="Neither" />
    </Stack>
);

const interactiveCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Token as="a" href="#" text="A link" />
    <Token as="button" text="A button" onClick={() => {}} />
    <Token text="Neither" />
</Stack>`;

// A token that both leads somewhere and can be taken back out. It holds two things to press, so
// what it leads to moves onto the words and the button that removes it is left standing beside them
// rather than inside them, since one button cannot stand inside another
const bothPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <TokenComponent as="a" href="#" text="monalisa" onRemove={() => {}} />
        <TokenComponent as="button" text="octocat" onClick={() => {}} onRemove={() => {}} />
    </Stack>
);

const bothCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Token as="a" href="#" text="monalisa" onRemove={() => {}} />
    <Token as="button" text="octocat" onClick={() => {}} onRemove={() => {}} />
</Stack>`;

// The ones that have been picked out of the rest. The two are drawn together, since what tells them
// apart is the border read against the other rather than on its own
const selectedPreview = (
    <Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
        <TokenComponent text="Picked" isSelected leadingVisual={StarRegular} />
        <TokenComponent text="Not picked" leadingVisual={StarRegular} />
    </Stack>
);

const selectedCode = `<Stack direction="horizontal" gap="condensed" align="center" wrap="wrap">
    <Token text="Picked" isSelected leadingVisual={StarRegular} />
    <Token text="Not picked" leadingVisual={StarRegular} />
</Stack>`;

// A token that answers neither pointer nor key. It is only a token that would have answered that
// has anything to give up, so the one drawn here is a button
const disabledPreview = (
    <Stack align="start">
        <TokenComponent as="button" text="Disabled" disabled onClick={() => {}} />
    </Stack>
);

const disabledCode = `<Token as="button" text="Disabled" disabled onClick={() => {}} />`;

// The token as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Sizes",
        description:
            "How much room the token is given. The scale is the token's own rather than the one the rest of the controls are held on, since a token is smaller than whatever it usually stands beside. The smaller two are set in the same type and differ in the room around it; the larger two do the same.",
        preview: sizesPreview,
        code: sizesCode,
    },
    {
        name: "Leading visual",
        description:
            "What stands before the words, handed to the token rather than written inside it, so that it is drawn in the place and at the size the token keeps for it. The smallest size has no room to spare, so a visual given to one is left out rather than drawn cramped.",
        preview: visualPreview,
        code: visualCode,
    },
    {
        name: "Removable",
        description:
            "A token that can be taken back out, by the button at its end or by Backspace or Delete while it holds focus. The keys are said in words only a screen reader reads, since a reader who can see the button has already been told. What the list comes to is the caller's to keep, so the token says it has been asked to go rather than going of its own accord.",
        setup: removableSetup,
        preview: <RemovablePreview />,
        code: removableCode,
    },
    {
        name: "Leading somewhere",
        description:
            "A token drawn as the link or the button it stands for. What makes it answer the reader is being given something to answer with — an anchor or a button to be drawn as, something to do when pressed, or a place in the tab order — rather than a prop saying so.",
        preview: interactivePreview,
        code: interactiveCode,
    },
    {
        name: "Leading somewhere and removable",
        description:
            "A token that does both holds two things to press. What it leads to moves onto the words, and the button that removes it is left standing beside them rather than inside them, since one button cannot stand inside another. The mark that removes it is then drawn without being a button at all, and Backspace and Delete are what take the token out.",
        preview: bothPreview,
        code: bothCode,
    },
    {
        name: "Selected",
        description:
            "The tokens that have been picked out of the rest. The border is what says so and the words are darkened with it, since a token is already a pill and has nowhere else to carry the difference.",
        preview: selectedPreview,
        code: selectedCode,
    },
    {
        name: "Disabled",
        description:
            "A token that answers neither pointer nor key. Only a token that would have answered has anything to give up, so it is what a token drawn as a button or a link is told where the thing it stands for is not available just now.",
        preview: disabledPreview,
        code: disabledCode,
    },
];

// How much room the token is given. The scale is the token's own, since a token is smaller than the
// controls it usually stands beside
const size = '"small" | "medium" | "large" | "xlarge"';

// What a visual is handed over as: the component to draw, or an element already built
const visual = "React.ElementType | React.ReactElement | null";

// What every one of them says. It is the same prop saying the same thing on both, so it is named
// once rather than written out under each of them
const text = {
    name: "text",
    type: "React.ReactNode",
    required: true,
    description: "What the token says, which is the whole of what it stands for",
};

const sizeProp = {
    name: "size",
    type: size,
    default: '"medium"',
    description:
        "How much room the token is given. The scale is the token's own rather than the one the rest of the controls are held on, since a token is smaller than whatever it usually stands beside",
};

const isSelected = {
    name: "isSelected",
    type: "boolean",
    default: "false",
    description:
        "Marks the token as one of the ones that have been picked out of the rest, which is said by the border and the colour of the words rather than by a mark of its own",
};

const onRemove = {
    name: "onRemove",
    type: "() => void",
    description:
        "Called when the button at the end of the token is pressed, or when Backspace or Delete is pressed while the token holds focus. Giving it is what draws the button, so a token without it cannot be taken back out. What the list comes to is the caller's to keep",
};

const hideRemoveButton = {
    name: "hideRemoveButton",
    type: "boolean",
    default: "false",
    description:
        "Leaves the button out while keeping what onRemove was given for, so a token that is taken out some other way still answers Backspace and Delete",
};

const disabled = {
    name: "disabled",
    type: "boolean",
    default: "false",
    description:
        "Stops the token answering the reader at all. Only a token that would have answered has anything to give up",
};

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. It is also what
// makes a token answer the reader at all: drawn as an anchor or a button it does, and drawn as the
// span it falls back to it does not
const polymorphic = {
    name: "as",
    type: "React.ElementType",
    default: '"span"',
    description:
        "The element or component this is drawn as, in place of its default. An anchor or a button is what makes the token answer the reader, so it is how a token that leads somewhere is asked for rather than a prop saying so",
};

// Every prop the two tokens take, under the one that takes it.
//
// The token comes first, since it is the one reached for wherever the thing being stood for has no
// colour of its own; the issue label follows, with the one prop that is its own.
//
// What each of them says comes first in both, since it is the whole of what a token stands for, and
// how much room it is given follows
const groups: ComponentPropGroup[] = [
    {
        name: "Token",
        props: [
            text,
            sizeProp,
            {
                name: "leadingVisual",
                type: visual,
                description:
                    "Stands before the words, drawn to whichever size the token is on rather than at the size it arrived at. The smallest size has no room to spare, so one given there is left out rather than drawn cramped",
            },
            onRemove,
            hideRemoveButton,
            isSelected,
            disabled,
            styling,
            polymorphic,
        ],
    },
    {
        name: "IssueLabelToken",
        props: [
            text,
            {
                name: "fillColor",
                type: "string",
                default: '"#999999"',
                description:
                    "The one colour every colour the label is drawn in is worked out from, written as hex or as rgb(). The words, the border, the ring around a picked one and the whole of it again for a dark theme all follow it, so the words stay readable whichever colour it is given",
            },
            sizeProp,
            onRemove,
            hideRemoveButton,
            isSelected,
            disabled,
            styling,
            polymorphic,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the token is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and
// only then wanting to know everything it will take
const Token = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                Token
            </Heading>
            <Text as="p" size="large">
                A short, rounded label standing for one thing that has been picked: a person, a
                topic, a file. It can lead somewhere, be taken back out, or both. What makes it
                answer the reader is being drawn as an anchor or a button rather than a prop saying
                so, and one that both leads somewhere and can be taken back out holds two things to
                press, so what it leads to moves onto the words and the button that removes it is
                left standing beside them.
            </Text>
        </Stack>
        <ComponentExamples component="Token" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default Token;
