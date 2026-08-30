import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { useOverflow } from "../../../../packages/react/src/hooks/useOverflow";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    // The box is given a size it can be dragged out of. What is watched is the box rather than
    // what is in it, so it is the box that has to change for the observer to say anything
    box: "h-[8rem] w-[24rem] max-w-full resize overflow-auto [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-12)]",
    muted: "text-foreground-muted",
    // The answer is read as a value rather than as prose, so it is set in the monospace stack
    // the rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

const passage =
    "One stylesheet stands behind the library, and it is assembled in layers. The order they are imported in is the order they are drawn in.";

const signature = `const ref = React.useRef<HTMLDivElement>(null);

const hasOverflow = useOverflow(ref);`;

const region = `const scrollableRef = React.useRef<HTMLElement>(null);
const hasOverflow = useOverflow(scrollableRef);

// Only content that actually scrolls becomes a landmark
const regionProps = hasOverflow ? { role: "region", tabIndex: 0 } : {};`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useOverflow",
    decorators: [withPage],
};

const Box = () => {
    const ref = React.useRef<HTMLDivElement>(null);
    const hasOverflow = useOverflow(ref);

    return (
        <Stack gap="condensed" align="start">
            <div ref={ref} className={classes.box}>
                <Text as="p">{passage}</Text>
            </div>
            <Text size="small" className={classes.value}>
                hasOverflow: {String(hasOverflow)}
            </Text>
            <Text size="small" className={classes.muted}>
                Drag the corner of the box until the passage no longer fits
            </Text>
        </Stack>
    );
};

// What the hook answers, which is a question about one element rather than about a page: has
// this been given less room than it needs
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useOverflow
        </Heading>
        <Text as="p">
            <Code>useOverflow</Code> reports whether an element holds more than it can show, on
            either axis. It watches the element with a <Code>ResizeObserver</Code> and compares what
            the content needs against what the box has: scroll height against client height, scroll
            width against client width.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            What is watched is the box, not what is in it. The observer answers when the element
            itself changes size, so a box that stays the same size while its contents grow is not
            asked again — a component whose content changes underneath it has to arrange to be told
            some other way.
        </Text>
        <Box />
    </Stack>
);

// Why It Is Asked, which is the case the hook was written for and is worth stating, since the
// answer is used to decide something about the markup rather than about the styling
export const Scrolling: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Scrolling</Heading>
        <Text as="p">
            The question is asked to decide what an element should be, not how it should look. A
            region that scrolls has to be reachable by keyboard, and is announced as a landmark so
            it can be found; a region that happens to fit is neither of those things, and marking it
            as one sends a keyboard user to somewhere they cannot move within.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{region}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            That is what <Code>ScrollableRegion</Code> does with it. The same reasoning covers a
            code block that needs a scrollbar, a table that runs past its column, and a panel that
            has to say it has more below.
        </Text>
    </Stack>
);

// A One-Way Answer, which is worth saying outright rather than leaving to be discovered: the
// value goes to true and stays there
export const OneWayAnswer: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">A one-way answer</Heading>
        <Text as="p">
            Once an element has been found not to fit, the hook goes on saying so. Widening the box
            again does not take the answer back — the demo above stays <Code>true</Code> however far
            it is dragged open afterwards.
        </Text>
        <Text as="p">
            That follows from what it is used for. The answer decides whether an element is a
            landmark and whether it is in the tab order, and taking those away again while someone
            is using them is worse than leaving a region that no longer needs to scroll still
            reachable. A component that needs the answer to fall back to <Code>false</Code> is
            asking a different question, and <Code>useIsClipped</Code> is the one that answers it.
        </Text>
    </Stack>
);
