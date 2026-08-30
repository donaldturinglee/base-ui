import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { TextInput } from "../../../../packages/react/src/components/text-input";
import { useId } from "../../../../packages/react/src/hooks/useId";
import { useMergedRefs } from "../../../../packages/react/src/hooks/useMergedRefs";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    field: "max-w-[24rem]",
    row: "flex flex-wrap gap-[var(--base-size-8)]",
    muted: "text-foreground-muted",
};

const signature = `const innerRef = React.useRef<HTMLInputElement>(null);
const mergedRef = useMergedRefs(ref, innerRef);

return <input ref={mergedRef} />;`;

const problem = `// The element can only be handed to one of them
return <input ref={ref} />;
return <input ref={innerRef} />;`;

const forwarded = `const Field = React.forwardRef<HTMLInputElement, FieldProps>(
    function Field({ label }, ref) {
        const innerRef = React.useRef<HTMLInputElement>(null);
        const mergedRef = useMergedRefs(ref, innerRef);

        // The component clears through its own ref
        const clear = () => {
            const input = innerRef.current;

            if (input) {
                input.value = "";
                input.focus();
            }
        };

        return <input ref={mergedRef} />;
    },
);`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useMergedRefs",
    decorators: [withPage],
};

// A field that keeps hold of its own element — it clears and refocuses itself — while still
// handing that element to whoever asked it for a ref
const Field = React.forwardRef<HTMLInputElement, { label: string }>(function Field({ label }, ref) {
    const innerRef = React.useRef<HTMLInputElement>(null);
    const mergedRef = useMergedRefs(ref, innerRef);
    const id = useId();

    const clear = () => {
        const input = innerRef.current;

        if (!input) {
            return;
        }

        input.value = "";
        input.focus();
    };

    return (
        <Stack gap="condensed" align="start" className={classes.field}>
            <Text as="label" htmlFor={id}>
                {label}
            </Text>
            <TextInput block id={id} ref={mergedRef} placeholder="base-ui" />
            <Button onClick={clear}>Clear</Button>
        </Stack>
    );
});

const Demo = () => {
    const ref = React.useRef<HTMLInputElement>(null);

    return (
        <Stack gap="normal" align="start">
            <Field ref={ref} label="Repository" />
            <div className={classes.row}>
                <Button onClick={() => ref.current?.focus()}>Focus from outside</Button>
                <Button
                    onClick={() => {
                        if (ref.current) {
                            ref.current.value = "base-ui";
                        }
                    }}
                >
                    Fill from outside
                </Button>
            </div>
        </Stack>
    );
};

// The problem, which is not obvious until it is met: a ref is a single slot, and a component that
// forwards one has already given away the only place it had to put the element
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useMergedRefs
        </Heading>
        <Text as="p">
            An element takes one ref. A component that forwards its caller&apos;s ref has therefore
            given away the only place it had to keep the element for itself — and it usually needs
            one, to measure the element, to focus it, or to put an observer on it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{problem}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            <Code>useMergedRefs</Code> makes one ref out of two. What goes on the element is a
            single callback that writes the node into both, so the caller has the element and the
            component keeps it too.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Below, the field clears itself through its own ref and the page focuses and fills it
            through the ref it was given. Both are pointing at the same input.
        </Text>
        <Demo />
    </Stack>
);

// Forwarding, which is where nearly every use of the hook is: it is the second line of a
// component that forwards a ref and does anything at all with the element itself
export const Forwarding: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Forwarding</Heading>
        <Text as="p">
            The shape is always the same. The component takes the forwarded ref, keeps one of its
            own, merges them, and puts the result on the element. Nothing else about the component
            has to know that two things are watching.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{forwarded}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            <Code>TextInput</Code> is written exactly this way, and so is{" "}
            <Code>ScrollableRegion</Code>: one keeps the input to manage focus and selection, the
            other keeps the region to watch it for overflow, and both still hand the element on.
        </Text>
    </Stack>
);

// What It Accepts, which is worth writing down because a caller does not choose what kind of ref
// it is given: whatever React hands the component is what has to be merged
export const WhatItAccepts: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">What it accepts</Heading>
        <Text as="p">
            Both arguments take a ref of any kind, which matters because a component does not decide
            what it is passed. A caller may hold an object, or a callback, or nothing at all, and
            the same code has to work for all three.
        </Text>
        <List>
            <List.Item>
                An object ref has the node written to its <Code>current</Code>
            </List.Item>
            <List.Item>A callback ref is called with the node</List.Item>
            <List.Item>
                <Code>null</Code> and <Code>undefined</Code> are passed over, so a component that
                was given no ref merges nothing and behaves as though it had one argument
            </List.Item>
        </List>
        <Text as="p">
            The merged callback is held against the two refs it was made from, so it is the same
            function between renders and React is not detaching and reattaching the element every
            time the component draws.
        </Text>
    </Stack>
);

// Cleanup, which is the part that is about React rather than about the library: what happens when
// the element goes away changed in React 19, and the hook answers for both
export const Cleanup: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Cleanup</Heading>
        <Text as="p">
            A callback ref in React 19 may return a cleanup function, which React calls when the
            element is detached instead of calling the ref again with <Code>null</Code>. That is a
            better arrangement, and it means a merged ref has two cleanups to look after rather than
            one.
        </Text>
        <Text as="p">
            The hook returns a cleanup that calls whichever of the two returned one of their own,
            and clears the others by hand. Under React 18 no cleanup is returned at all, so React
            goes on doing what it always did and calls the ref again with <Code>null</Code>.
        </Text>
        <Text as="p">
            The version is read once, when the module is loaded, so nothing is being checked per
            render. None of it is visible to a caller: merging two refs is the same call either way,
            and the difference is only in what the callback hands back.
        </Text>
    </Stack>
);
