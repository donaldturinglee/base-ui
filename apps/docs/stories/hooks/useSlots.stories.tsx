import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { useSlots } from "../../../../packages/react/src/hooks/useSlots";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    notice: "flex flex-col gap-[var(--base-size-8)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-16)]",
    // The header is what the slots are drawn into, and it is drawn whether or not they were
    // given: a slot that was not passed is undefined, which React renders as nothing
    header: "flex items-center justify-between gap-[var(--base-size-8)]",
    footer: "flex justify-end gap-[var(--base-size-8)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-16)]",
    muted: "text-foreground-muted",
};

const signature = `const [slots, rest] = useSlots(children, {
    title: NoticeTitle,
    action: NoticeAction,
});`;

const composed = `<Notice>
    <Notice.Action>
        <Button size="small">Dismiss</Button>
    </Notice.Action>
    <Text as="p">Two commits were pushed while this page was open.</Text>
    <Notice.Title>Out of date</Notice.Title>
</Notice>`;

const drawn = `<div className={classes.notice}>
    <div className={classes.header}>
        {slots.title}
        {slots.action}
    </div>
    {rest}
</div>`;

const matcher = `const [slots, rest] = useSlots(children, {
    confirm: [Button, (props) => props.variant === "primary"],
});`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useSlots",
    decorators: [withPage],
};

// The parts a Notice is assembled from. Each is an ordinary component; what makes one a slot is
// that the Notice names it in its config, and not anything the part itself carries
const NoticeTitle = ({ children }: React.PropsWithChildren) => (
    <Heading size="small">{children}</Heading>
);

const NoticeAction = ({ children }: React.PropsWithChildren) => <div>{children}</div>;

const Notice = ({ children }: React.PropsWithChildren) => {
    const [slots, rest] = useSlots(children, {
        title: NoticeTitle,
        action: NoticeAction,
    });

    return (
        <div className={classes.notice}>
            <div className={classes.header}>
                {slots.title}
                {slots.action}
            </div>
            {rest}
        </div>
    );
};

Notice.Title = NoticeTitle;
Notice.Action = NoticeAction;

// What the hook is for: a component that has to put some of its children somewhere particular,
// without making the caller pass them as props or write them in a fixed order
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useSlots
        </Heading>
        <Text as="p">
            A component built out of named parts has to find those parts among its children. It
            could take them as props instead — <Code>title</Code>, <Code>action</Code> — but a prop
            that holds an element is awkward to write and worse to read, and it puts the markup
            somewhere other than where the markup goes.
        </Text>
        <Text as="p">
            <Code>useSlots</Code> picks them out. It is given the children and a config naming what
            each slot is, and hands back the slots it found and everything it did not recognise.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The component then draws each part where it belongs, and the caller writes them in
            whatever order reads best. Below, the action is written first and the title last, and
            neither is drawn where it was written.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{composed}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Notice>
            <Notice.Action>
                <Button size="small">Dismiss</Button>
            </Notice.Action>
            <Text as="p">Two commits were pushed while this page was open.</Text>
            <Notice.Title>Out of date</Notice.Title>
        </Notice>
        <Text as="p">
            A slot that was not passed comes back <Code>undefined</Code>, which React draws as
            nothing. So the component can name every part it knows about and leave the caller to
            pass the ones they want, without a check around each.
        </Text>
    </Stack>
);

// What Is Left Over, which is the half of the return value that is easy to overlook and is what
// makes a slotted component still take ordinary children
export const WhatIsLeftOver: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">What is left over</Heading>
        <Text as="p">
            Everything not matched comes back as the second value, in the order it was written. A
            component draws it wherever its ordinary content goes, so a slotted component is still a
            component that takes children rather than one that only takes parts.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{drawn}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <List>
            <List.Item>
                Anything that is not an element — a string, a number, <Code>null</Code> — falls
                through to the rest, since there is nothing on it to match against
            </List.Item>
            <List.Item>
                Once every slot has been filled the search stops, and whatever is left goes to the
                rest without being looked at
            </List.Item>
            <List.Item>
                The rest keeps the order it was written in, which matters because it is usually
                prose
            </List.Item>
        </List>
    </Stack>
);

const Footer = ({ children }: React.PropsWithChildren) => {
    const [slots, rest] = useSlots(children, {
        confirm: [Button, (props) => props.variant === "primary"],
    });

    return (
        <div className={classes.footer}>
            {rest}
            {slots.confirm}
        </div>
    );
};

// Matching On Props, which is for the case where the part is not a component of its own: what
// distinguishes it is what it was given rather than what it is
export const MatchingOnProps: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Matching on props</Heading>
        <Text as="p">
            A slot is usually a component written for the purpose, and matching on the type is
            enough. Sometimes it is not: two of the same component are passed and one of them is the
            important one. A config entry given as a pair matches on the type and then asks the
            props.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{matcher}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Below, Save is written first and Cancel second. The footer takes the primary button out
            as its confirm slot and draws it after everything else, which is where a confirming
            action belongs whatever order it was passed in.
        </Text>
        <Footer>
            <Button variant="primary">Save</Button>
            <Button>Cancel</Button>
        </Footer>
    </Stack>
);

// Duplicates, which is worth knowing about because what happens is quiet: the second one is not
// drawn anywhere, and nothing says so
export const Duplicates: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Duplicates</Heading>
        <Text as="p">
            A slot holds one child. Where two children match the same slot the first is kept and the
            second is dropped — not moved to the rest, but dropped, so it is drawn nowhere at all.
        </Text>
        <Notice>
            <Notice.Title>The first title</Notice.Title>
            <Notice.Title>The second title</Notice.Title>
            <Text as="p">Two titles were passed. One of them is above.</Text>
        </Notice>
        <Text as="p">
            That is the right behaviour — a notice with two titles is a mistake, and drawing both
            would make a worse-looking mistake out of it — but it is silent, so a part that has gone
            missing from a component built this way is worth suspecting of being a second one of
            something.
        </Text>
    </Stack>
);
