import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { useFocusTrap } from "../../../../packages/react/src/hooks/useFocusTrap";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    // Every demo here is opened rather than left standing. A trap reaches for focus the moment
    // it is mounted, and a page of them standing open would be several things pulling at the
    // one thing there is only one of
    panel: "flex flex-col gap-[var(--base-size-12)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default bg-background-muted p-[var(--base-size-16)]",
    row: "flex flex-wrap gap-[var(--base-size-8)]",
    muted: "text-foreground-muted",
};

const signature = `const containerRef = React.useRef<HTMLDivElement>(null);

useFocusTrap({ containerRef });

return <div ref={containerRef}>{children}</div>;`;

const options = `useFocusTrap({
    // The element focus is held within
    containerRef,
    // What takes focus as the trap opens, in place of the first thing inside it that can
    initialFocusRef,
    // Where focus lands once the trap closes, in place of whatever held it beforehand
    returnFocusRef,
    // Leaves focus where it is, for a container mounted before it is ready to hold it
    disabled,
});`;

const mounting = `{isOpen ? <Panel onClose={close} /> : null}`;

const initialFocus = `const containerRef = React.useRef<HTMLDivElement>(null);
const confirmRef = React.useRef<HTMLButtonElement>(null);

useFocusTrap({ containerRef, initialFocusRef: confirmRef });`;

const returnFocus = `const containerRef = React.useRef<HTMLDivElement>(null);

useFocusTrap({ containerRef, returnFocusRef: rowRef });`;

const disabled = `useFocusTrap({ containerRef, disabled: !isReady });`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useFocusTrap",
    decorators: [withPage],
};

// The panel the first demo opens: a container, a ref, and the hook. Nothing else is arranged —
// what the trap needs to know is where its edges are
const Panel = ({ onClose }: { onClose: () => void }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useFocusTrap({ containerRef });

    return (
        <div ref={containerRef} className={classes.panel}>
            <Heading size="small">Panel</Heading>
            <Text size="small" className={classes.muted}>
                Tab through these and focus comes round rather than leaving. Close, and it goes back
                to the button that opened this.
            </Text>
            <div className={classes.row}>
                <Button>First</Button>
                <Button>Second</Button>
                <Button variant="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
};

const Held = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack gap="condensed" align="start">
            <Button onClick={() => setIsOpen(true)}>Open panel</Button>
            {isOpen ? <Panel onClose={() => setIsOpen(false)} /> : null}
        </Stack>
    );
};

// What the hook is for, which is the one thing a layer drawn over the page cannot do without:
// focus is single, and a layer that does not hold it has the page underneath answering for it
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useFocusTrap
        </Heading>
        <Text as="p">
            A dialog that does not hold focus is a dialog only to look at. Tab once from inside one
            and the next thing focused is a link on the page behind it — reachable, invisible, and
            no longer part of what the person came to do. <Code>useFocusTrap</Code> keeps the tab
            key inside a container for as long as it is mounted, and hands focus back to whatever
            held it when the container is taken down.
        </Text>
        <Text as="p">
            It is given a ref and nothing else has to be arranged. Focus moves to the first thing
            inside that can take it as the trap opens, tabbing off either end comes round to the
            other, and tabbing at all while focus has been left outside brings it back in.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The trap is opened by mounting the container rather than by a prop, since the effect
            runs when the element it is watching appears. A layer that is rendered while closed
            reaches for <Code>disabled</Code> instead.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{mounting}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Held />
    </Stack>
);

// The Options, written out together, since three of the four are refs and the shape is easier to
// hold in mind whole than a paragraph at a time
export const Options: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Options</Heading>
        <Text as="p">
            Only <Code>containerRef</Code> is required. The rest are answers to questions the
            default already has an answer for, and are given where that answer is the wrong one.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{options}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Where there is nothing inside the container that can take focus, the container itself
            takes it. That is a last resort rather than a design, but it is a better one than
            leaving focus on the page underneath, which is the only other place for it to be.
        </Text>
    </Stack>
);

// Initial Focus, which is a question about what the layer is for: the first thing in it is the
// right answer for a form and the wrong one for anything asking to be confirmed
const Confirm = ({ onClose }: { onClose: () => void }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const confirmRef = React.useRef<HTMLButtonElement>(null);

    useFocusTrap({ containerRef, initialFocusRef: confirmRef });

    return (
        <div ref={containerRef} className={classes.panel}>
            <Heading size="small">Delete branch</Heading>
            <Text size="small" className={classes.muted}>
                Focus opens on Delete rather than on Cancel, which is the first thing in the panel
                that could have taken it.
            </Text>
            <div className={classes.row}>
                <Button onClick={onClose}>Cancel</Button>
                <Button ref={confirmRef} variant="danger" onClick={onClose}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export const InitialFocus: StoryFn = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack gap="normal">
            <Heading size="medium">Initial focus</Heading>
            <Text as="p">
                Focus lands on the first thing inside the container that can take it, which is right
                for a panel that is filled in from the top and wrong for one that is a question.{" "}
                <Code>initialFocusRef</Code> names what takes it instead.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{initialFocus}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Stack gap="condensed" align="start">
                <Button onClick={() => setIsOpen(true)}>Delete branch</Button>
                {isOpen ? <Confirm onClose={() => setIsOpen(false)} /> : null}
            </Stack>
        </Stack>
    );
};

// Return Focus, which matters most when the thing that opened the layer is not there to go back
// to, since focus that has nowhere to return to falls to the body and the keyboard starts again
export const ReturnFocus: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Return focus</Heading>
        <Text as="p">
            Whatever held focus when the trap opened is where focus goes when it closes, so a person
            is put back where they were rather than at the top of the page. That is the right answer
            nearly always, and wrong when the thing they came from has gone: a row deleted by the
            dialog that was confirming it cannot be returned to.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{returnFocus}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            <Code>returnFocusRef</Code> names somewhere that will still be standing — the row above
            the deleted one, or the control the list is filtered by.
        </Text>
    </Stack>
);

// Disabled, which is the option for a container that exists before it is ready, and is worth
// separating from unmounting: one leaves the markup standing, the other does not
export const Disabled: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Disabled</Heading>
        <Text as="p">
            <Code>disabled</Code> leaves focus alone. It is for a container that is mounted before
            it is ready to hold anything — one that animates in, or one whose contents are still
            being fetched — where taking focus at the moment the element appears would take it to
            something not yet worth focusing.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{disabled}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Where the layer is not rendered at all until it opens, none of this is needed: the
            effect runs when the container appears, which is the same moment.
        </Text>
    </Stack>
);

// The inner layer of the last demo. It is rendered inside the outer panel, so the outer trap can
// see everything in it — which is exactly the case the register of open traps is there for
const InnerPanel = ({ onClose }: { onClose: () => void }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useFocusTrap({ containerRef });

    return (
        <div ref={containerRef} className={classes.panel}>
            <Heading size="small">Second panel</Heading>
            <Text size="small" className={classes.muted}>
                Tab is answered here now. Close this and focus goes back to the button in the panel
                behind, which is still holding its own.
            </Text>
            <div className={classes.row}>
                <Button>Inner</Button>
                <Button variant="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
};

const OuterPanel = ({ onClose }: { onClose: () => void }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    useFocusTrap({ containerRef });

    return (
        <div ref={containerRef} className={classes.panel}>
            <Heading size="small">First panel</Heading>
            <div className={classes.row}>
                <Button onClick={() => setIsOpen(true)}>Open a second</Button>
                <Button variant="primary" onClick={onClose}>
                    Close
                </Button>
            </div>
            {isOpen ? <InnerPanel onClose={() => setIsOpen(false)} /> : null}
        </div>
    );
};

// Layers, which is the reason the hook keeps a register at all: two traps open at once are not
// two traps arguing, they are one answering and one waiting
export const Layers: StoryFn = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Stack gap="normal">
            <Heading size="medium">Layers</Heading>
            <Text as="p">
                Every open trap is kept in one list, in the order they opened, and only the last of
                them answers the tab key. A dialog opened from a dialog holds focus to itself while
                the one behind it stays open and stays quiet, and closing it hands focus back to the
                layer it was opened from.
            </Text>
            <Text as="p">
                The register is what makes that work without either layer knowing the other exists.
                One document listener stands behind all of them, so the order they answer in is the
                order they were opened in rather than the order the browser happened to bind them.
            </Text>
            <Stack gap="condensed" align="start">
                <Button onClick={() => setIsOpen(true)}>Open panel</Button>
                {isOpen ? <OuterPanel onClose={() => setIsOpen(false)} /> : null}
            </Stack>
        </Stack>
    );
};
