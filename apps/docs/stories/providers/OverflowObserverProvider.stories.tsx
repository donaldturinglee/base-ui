import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { classNames } from "../../../../packages/react/src/lib/classnames";
import { useIsClipped } from "../../../../packages/react/src/hooks/useIsClipped";
import { OverflowObserverProvider } from "../../../../packages/react/src/providers/overflow-observer";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    // The row is held to a single line and hides whatever runs past it, which is the clipping the
    // shared observer is scoped to. It is left resizable so the point at which each item is cut
    // off can be found by dragging the corner
    row: "flex w-[24rem] max-w-full resize-x items-center gap-[var(--base-size-8)] overflow-hidden [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-8)]",
    item: "shrink-0 whitespace-nowrap [border-radius:var(--border-radius-medium)] px-[var(--base-size-8)] py-[var(--base-size-4)]",
    fits: "bg-background-accent-muted text-foreground-accent",
    clipped: "bg-background-danger-muted text-foreground-danger",
    muted: "text-foreground-muted",
};

const items = ["Code", "Issues", "Pull requests", "Actions", "Projects", "Settings"];

const signature = `<div ref={rootRef} className={row}>
    <OverflowObserverProvider rootRef={rootRef}>
        {items.map((item) => (
            <Item key={item} label={item} />
        ))}
    </OverflowObserverProvider>
</div>`;

const item = `const Item = ({ label }: ItemProps) => {
    const ref = React.useRef<HTMLSpanElement>(null);
    const isClipped = useIsClipped({ ref });

    return <span ref={ref}>{label}</span>;
};`;

const observe = `const observe = useOverflowObserver();

// Null where there is no provider above, which is what tells a caller to watch on its own
const stop = observe?.(element, (isClipped) => { /* ... */ });`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Providers/OverflowObserverProvider",
    decorators: [withPage],
};

// One item of the row. It says nothing about where it stands, only whether the row still shows
// the whole of it, and it is written the same way whether or not a provider stands above it
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

const Row = ({ shared, legend }: { shared?: boolean; legend: string }) => {
    const rootRef = React.useRef<HTMLDivElement>(null);

    const children = items.map((label) => (
        <Item key={label} label={label} rootRef={shared ? undefined : rootRef} />
    ));

    return (
        <Stack gap="condensed" align="start">
            <div ref={rootRef} className={classes.row}>
                {shared ? (
                    <OverflowObserverProvider rootRef={rootRef}>
                        {children}
                    </OverflowObserverProvider>
                ) : (
                    children
                )}
            </div>
            <Text size="small" className={classes.muted}>
                {legend}
            </Text>
        </Stack>
    );
};

// What the provider is, which is not a feature so much as an economy: the same answer, arrived
// at once for everything below instead of once per thing
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            OverflowObserverProvider
        </Heading>
        <Text as="p">
            A row of things that has run out of room has to know which of them no longer fit — that
            is how a toolbar decides what to fold into an overflow menu, and how a set of tabs
            decides which of them to hide. Each of those things can watch itself with an{" "}
            <Code>IntersectionObserver</Code>, and a row of twenty then costs twenty observers.
        </Text>
        <Text as="p">
            <Code>OverflowObserverProvider</Code> holds one for all of them. Everything below it is
            put on that single observer, and each notification is handed on to whoever asked about
            the element it was about.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Row
            shared
            legend="Six items, one observer between them. Drag the corner to narrow the row"
        />
    </Stack>
);

// The Root, which is the one prop and the one thing that has to be got right: what the clipping
// is measured against decides what the answer means
export const TheRoot: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">The root</Heading>
        <Text as="p">
            <Code>rootRef</Code> is the element that does the clipping — whatever holds the row and
            hides what runs past it. The observer is scoped to that element rather than to the
            window, which is what makes the answer the useful one: an item pushed off the end of a
            row that is itself scrolled out of sight is cut off by the row, and it is the row the
            component has to answer for.
        </Text>
        <List>
            <List.Item>
                Anything less than the whole of an element counts as cut off, since half a button is
                no more use than none of it
            </List.Item>
            <List.Item>
                Until the root is attached the provider does nothing at all. Falling back to the
                viewport would answer about the window rather than about the row, which is a
                different question
            </List.Item>
            <List.Item>
                The root is usually attached on the render after the first, so anything that
                subscribed before there was one to watch it against is picked up as soon as there is
            </List.Item>
        </List>
        <Text as="p">
            The provider renders nothing of its own. It goes inside the element it is given rather
            than around it, so the row it is scoped to is a row the layout already had.
        </Text>
    </Stack>
);

// Subscribing, which is almost always useIsClipped and only occasionally the observe function
// underneath it
export const Subscribing: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Subscribing</Heading>
        <Text as="p">
            Nothing subscribes to the provider directly in the ordinary case.{" "}
            <Code>useIsClipped</Code> does it: given a ref, it finds the nearest provider and puts
            the element on the observer that provider holds.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{item}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The item is written the same way whether or not a provider stands above it. With one, it
            joins the shared observer and <Code>rootRef</Code> is not read at all — the provider
            already knows what the clipping is done by. Without one, it builds an observer of its
            own against the <Code>rootRef</Code> it was given, and reports <Code>false</Code> if it
            was given neither.
        </Text>
        <Row legend="The same six items, each watching itself against the row" />
        <Text as="p">
            Both rows above behave identically, and the difference is entirely in what it costs to
            run them. That is what lets a component be written once and still be cheap in whichever
            row it ends up in.
        </Text>
        <Text as="p">
            <Code>useOverflowObserver</Code> is the layer underneath, for anything that has to watch
            an element without holding it in React state. It hands back the subscribe function, or{" "}
            <Code>null</Code> where there is no provider above, which is what tells a caller to
            watch on its own instead.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{observe}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Subscribing hands back the way to stop. The same element can be watched by more than one
            caller, so it is taken off the observer only once the last of them has let go.
        </Text>
    </Stack>
);
