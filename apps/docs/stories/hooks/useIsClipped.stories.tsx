import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { classNames } from "../../../../packages/react/src/lib/classnames";
import { OverflowObserverProvider } from "../../../../packages/react/src/providers/overflow-observer";
import { useIsClipped } from "../../../../packages/react/src/hooks/useIsClipped";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    // The row is held to a single line and hides whatever runs past it, which is the clipping
    // being reported on. It is left resizable so the point at which each item is cut off can be
    // found by dragging the corner
    row: "flex w-[24rem] max-w-full resize-x items-center gap-[var(--base-size-8)] overflow-hidden [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-8)]",
    item: "shrink-0 whitespace-nowrap [border-radius:var(--border-radius-medium)] px-[var(--base-size-8)] py-[var(--base-size-4)]",
    fits: "bg-background-accent-muted text-foreground-accent",
    clipped: "bg-background-danger-muted text-foreground-danger",
    muted: "text-foreground-muted",
};

const items = ["Code", "Issues", "Pull requests", "Actions", "Projects", "Settings"];

const signature = `const ref = React.useRef<HTMLSpanElement>(null);

const isClipped = useIsClipped({ ref, rootRef });`;

const options = `useIsClipped({
    // The element being watched
    ref,
    // The element it is clipped by, read only where there is no provider above
    rootRef,
    // Leaves the element unwatched, for one already known to be out of the way
    disabled,
});`;

const shared = `<div ref={rootRef} className={row}>
    <OverflowObserverProvider rootRef={rootRef}>
        {items.map((item) => (
            <Item key={item} label={item} />
        ))}
    </OverflowObserverProvider>
</div>`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useIsClipped",
    decorators: [withPage],
};

// One item of the row. It says nothing about where it stands, only whether the row still shows
// the whole of it, which is the one question the hook answers
const Item = ({
    label,
    rootRef,
}: {
    label: string;
    rootRef?: React.RefObject<HTMLElement | null>;
}) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isClipped = useIsClipped({ ref, rootRef });

    return (
        <span
            ref={ref}
            className={classNames(classes.item, isClipped ? classes.clipped : classes.fits)}
        >
            {label}
        </span>
    );
};

const Row = () => {
    const rootRef = React.useRef<HTMLDivElement>(null);

    return (
        <Stack gap="condensed" align="start">
            <div ref={rootRef} className={classes.row}>
                {items.map((item) => (
                    <Item key={item} label={item} rootRef={rootRef} />
                ))}
            </div>
            <Text size="small" className={classes.muted}>
                Drag the corner of the row to narrow it
            </Text>
        </Stack>
    );
};

// What the hook answers, which is narrower than it first sounds: not whether the element is on
// screen, but whether the thing holding it is still showing the whole of it
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useIsClipped
        </Heading>
        <Text as="p">
            A row of things that has run out of room has to do something about it, and the first
            thing it needs is to know which of them no longer fit. <Code>useIsClipped</Code> answers
            that for one element: whether whatever holds it is still showing the whole of it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The question is asked of the container rather than of the window, which is what makes
            the answer useful. An item pushed off the end of a row that is scrolled out of sight is
            cut off by the row and not by the viewport, and it is the row the component overflowing
            has to answer for.
        </Text>
        <Text as="p">
            Anything less than the whole of the element counts as cut off, since half a button is no
            more use than none of it.
        </Text>
        <Row />
    </Stack>
);

// The Options, and the one thing about them worth saying twice: the root is not optional in
// practice, it is only optional in the signature
export const Options: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Options</Heading>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{options}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <List>
            <List.Item>
                <Code>ref</Code> is the element being watched, and is the only one always needed
            </List.Item>
            <List.Item>
                <Code>rootRef</Code> is what does the clipping. Given neither it nor a provider
                above, the hook reports <Code>false</Code> and watches nothing: falling back to the
                viewport would answer a different question rather than the one that was asked
            </List.Item>
            <List.Item>
                <Code>disabled</Code> takes the element off the observer and reports{" "}
                <Code>false</Code>, for one already known to be out of the way
            </List.Item>
        </List>
    </Stack>
);

const SharedRow = () => {
    const rootRef = React.useRef<HTMLDivElement>(null);

    return (
        <Stack gap="condensed" align="start">
            <div ref={rootRef} className={classes.row}>
                <OverflowObserverProvider rootRef={rootRef}>
                    {items.map((item) => (
                        <Item key={item} label={item} />
                    ))}
                </OverflowObserverProvider>
            </div>
            <Text size="small" className={classes.muted}>
                Six items, one observer between them
            </Text>
        </Stack>
    );
};

// The Shared Observer, which is the reason the provider exists at all: the hook on its own is
// correct and does not scale, and the provider is what makes the same call cheap
export const SharedObserver: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">The shared observer</Heading>
        <Text as="p">
            Left to itself the hook builds an <Code>IntersectionObserver</Code> of its own, which is
            fine for one element and wasteful for twenty. Where an{" "}
            <Code>OverflowObserverProvider</Code> stands above, the element is put on the single
            observer it holds instead, and <Code>rootRef</Code> is not read at all — the provider
            already knows what the clipping is done by.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{shared}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <SharedRow />
        <Text as="p">
            Nothing in the item changes between the two. It asks the same question the same way, and
            what answers it is settled above by whether there is a provider there — which is what
            lets a component be written once and still be cheap in the row it ends up in.
        </Text>
    </Stack>
);
