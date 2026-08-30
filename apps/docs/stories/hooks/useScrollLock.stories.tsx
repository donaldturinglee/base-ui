import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { useScrollLock } from "../../../../packages/react/src/hooks/useScrollLock";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    panel: "flex flex-col items-start gap-[var(--base-size-12)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default bg-background-muted p-[var(--base-size-16)]",
    // Something for the page to have to scroll, so the lock has a difference to make
    filler: "flex h-[24rem] w-full items-center justify-center [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-dashed border-border-muted",
    muted: "text-foreground-muted",
};

const signature = `// Held for as long as the component calling it is mounted
useScrollLock();`;

const layer = `const Dialog = ({ children }: DialogProps) => {
    useScrollLock();

    return <div role="dialog">{children}</div>;
};`;

const styling = `body[data-scroll-locked] .site-header {
    padding-inline-end: var(--scrollbar-width);
}`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useScrollLock",
    decorators: [withPage],
};

// The lock is a component of its own so that mounting it is what takes the lock, which is how a
// layer uses it: the hook is called unconditionally, and the layer is what comes and goes
const Lock = () => {
    useScrollLock();

    return null;
};

const Toggle = () => {
    const [isLocked, setIsLocked] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            {isLocked ? <Lock /> : null}
            <div className={classes.panel}>
                <Text size="small">The page is {isLocked ? "held still" : "free to scroll"}.</Text>
                <Button variant="primary" onClick={() => setIsLocked(!isLocked)}>
                    {isLocked ? "Let the page go" : "Hold the page still"}
                </Button>
            </div>
            <div className={classes.filler}>
                <Text size="small" className={classes.muted}>
                    Try to scroll the page
                </Text>
            </div>
        </Stack>
    );
};

// What the hook is for, which is a problem people notice only when it is not solved: an overlay
// that is scrolled to its end and then goes on scrolling the page behind it
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useScrollLock
        </Heading>
        <Text as="p">
            Reaching the bottom of a dialog and finding the page behind it scrolling instead is a
            small thing that feels like the interface coming apart. Worse, the page underneath keeps
            its scroll position badly: closing the dialog leaves the reader somewhere they never
            went. <Code>useScrollLock</Code> holds the page still for as long as the layer is
            mounted.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            It takes no ref and returns nothing. The lock is taken when the component calling it is
            mounted and handed back when it is taken down, so a layer calls it unconditionally and
            lets its own mounting be the switch.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{layer}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Toggle />
    </Stack>
);

// The Scrollbar, which is the detail that makes the difference between a lock that works and one
// that is noticed: hiding the overflow takes the scrollbar away, and the page moves sideways
export const TheScrollbar: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">The scrollbar</Heading>
        <Text as="p">
            Hiding the page&apos;s overflow removes its scrollbar, and on a platform that draws one
            in the layout that gives the page back a strip of width it did not have. Everything
            shifts sideways as the dialog opens, and shifts back as it closes.
        </Text>
        <Text as="p">
            So the width the scrollbar was taking is measured before it goes, and given back to the
            body as padding. Nothing moves, and the only thing that has changed is that the page no
            longer scrolls.
        </Text>
        <Text as="p">
            The body is also marked with <Code>data-scroll-locked</Code> while the lock is held,
            which is there for anything that has to answer to the same shift — a header pinned to
            the top of the window is laid out against the viewport rather than the body, so it does
            not get the padding and has to be given its own.
        </Text>
        <CodeBlock language="css">
            <CodeBlock.Content>
                <CodeBlock.Code>{styling}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Layers, which is the reason the lock is counted rather than set: two overlays open at once are
// two holds on the one page, and the first to close must not hand it back
export const Layers: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Layers</Heading>
        <Text as="p">
            The holds are counted. The first one to be taken is what actually stops the page and
            remembers what it was before; the ones after it only add to the count. The page is
            handed back when the last of them lets go, and to exactly what it was — not to{" "}
            <Code>auto</Code>, but to whatever the body was carrying beforehand.
        </Text>
        <Text as="p">
            That is what lets a dialog opened from a drawer close without the page starting to
            scroll underneath the drawer that is still open. Neither of them knows the other is
            there; the count is what they share.
        </Text>
    </Stack>
);

// Disabled, which is the same option as everywhere else in the library, and is here because a
// layer is sometimes rendered before it is open
export const Disabled: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Disabled</Heading>
        <Text as="p">
            <Code>useScrollLock(disabled)</Code> takes no hold at all. It is for a layer that is
            kept in the tree while closed — one that animates in and out, or one whose contents are
            expensive enough to be worth keeping — where the page should go on scrolling until the
            layer is actually in front of the reader.
        </Text>
        <Text as="p">
            A layer that is unmounted while closed needs nothing: the hold is taken when the
            component appears, which is the moment it opens.
        </Text>
    </Stack>
);
