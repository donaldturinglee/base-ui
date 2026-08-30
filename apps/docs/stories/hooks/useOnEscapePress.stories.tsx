import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { useOnEscapePress } from "../../../../packages/react/src/hooks/useOnEscapePress";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    // Every demo here is opened rather than left standing, since a handler that is mounted is a
    // handler that is listening, and a page of them would all answer the one key press
    panel: "flex flex-col items-start gap-[var(--base-size-12)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default bg-background-muted p-[var(--base-size-16)]",
    muted: "text-foreground-muted",
};

const signature = `useOnEscapePress((event) => {
    event.preventDefault();
    close();
});`;

const layered = `// The innermost layer answers first and takes the event
useOnEscapePress((event) => {
    event.preventDefault();
    setIsOpen(false);
});`;

const latest = `const latest = useRef(onEscape);

useEffect(() => {
    latest.current = onEscape;
}, [onEscape]);`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useOnEscapePress",
    decorators: [withPage],
};

const Panel = ({ onClose }: { onClose: () => void }) => {
    useOnEscapePress((event) => {
        event.preventDefault();
        onClose();
    });

    return (
        <div className={classes.panel}>
            <Heading size="small">Panel</Heading>
            <Text size="small" className={classes.muted}>
                Press Escape to close this. Focus does not have to be inside it — the key is
                answered wherever it is pressed.
            </Text>
            <Button variant="primary" onClick={onClose}>
                Close
            </Button>
        </div>
    );
};

// What the hook is for, and the one thing about it that is not obvious: it listens to the
// document rather than to a container, because Escape is about what is open and not about what
// is focused
export const Default: StoryFn = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack gap="normal">
            <Heading as="h1" size="large">
                useOnEscapePress
            </Heading>
            <Text as="p">
                Escape closes whatever is open. That is one of the few keyboard conventions a person
                can rely on everywhere, and a layer that does not answer it is a layer they have to
                find their way out of. <Code>useOnEscapePress</Code> calls back when the key is
                pressed anywhere in the document.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{signature}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p">
                The listener is on the document rather than on a container, and deliberately: a
                popover is dismissed by Escape whether focus is inside it, on the button that opened
                it, or somewhere else on the page entirely. Scoping it to the layer would answer
                only in the case where the person had already found their way in.
            </Text>
            <Text as="p">
                The hook is called by whatever is open, so it is mounted with the layer rather than
                standing in the page waiting for one.
            </Text>
            <Stack gap="condensed" align="start">
                <Button onClick={() => setIsOpen(true)}>Open panel</Button>
                {isOpen ? <Panel onClose={() => setIsOpen(false)} /> : null}
            </Stack>
        </Stack>
    );
};

const InnerLayer = ({ onClose }: { onClose: () => void }) => {
    useOnEscapePress((event) => {
        event.preventDefault();
        onClose();
    });

    return (
        <div className={classes.panel}>
            <Heading size="small">Second panel</Heading>
            <Text size="small" className={classes.muted}>
                Escape closes this one and stops there. The panel behind stays open.
            </Text>
            <Button variant="primary" onClick={onClose}>
                Close
            </Button>
        </div>
    );
};

const OuterLayer = ({ onClose }: { onClose: () => void }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    useOnEscapePress((event) => {
        event.preventDefault();
        onClose();
    });

    return (
        <div className={classes.panel}>
            <Heading size="small">First panel</Heading>
            <Button onClick={() => setIsOpen(true)}>Open a second</Button>
            {isOpen ? <InnerLayer onClose={() => setIsOpen(false)} /> : null}
            <Button variant="primary" onClick={onClose}>
                Close
            </Button>
        </div>
    );
};

// Layers, which is the whole reason the hook keeps a register instead of leaving each caller to
// bind a listener: two layers open at once must not both close on one key press
export const Layers: StoryFn = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack gap="normal">
            <Heading size="medium">Layers</Heading>
            <Text as="p">
                Every handler is kept in one list, in the order they started listening, and one
                document listener stands in for all of them. When Escape is pressed the list is
                walked backwards, so the innermost layer — the one opened last — answers first.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{layered}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p">
                A handler that calls <Code>preventDefault</Code> stops there: the layers around it
                are not called at all. That is what keeps one key press from closing a dialog and
                the menu it was opened from together, and it is why a layer that closes should
                always take the event.
            </Text>
            <Text as="p">
                An event something else has already answered is passed over entirely, so a native
                control that handles Escape for itself is left to it.
            </Text>
            <Stack gap="condensed" align="start">
                <Button onClick={() => setIsOpen(true)}>Open panel</Button>
                {isOpen ? <OuterLayer onClose={() => setIsOpen(false)} /> : null}
            </Stack>
        </Stack>
    );
};

// The Latest Callback, which is the reason the hook is more than four lines: the position in the
// queue belongs to the layer, and a new function on every render must not change it
export const TheLatestCallback: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">The latest callback</Heading>
        <Text as="p">
            The callback passed in is almost always written inline, so it is a different function on
            every render. If that function were what the register held, a layer would leave the
            queue and rejoin it at the back every time its component drew — and a layer that had not
            rendered recently would end up answering before one in front of it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{latest}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            So the register holds one stable handler for as long as the layer is open, and that
            handler reads the newest callback out of a ref when it is called. The order is the order
            the layers opened in, which is the order they should be closed in, and a caller does not
            have to remember to hold its callback still.
        </Text>
    </Stack>
);
