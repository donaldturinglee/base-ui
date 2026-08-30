import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import { useFocusZone } from "../../../../packages/react/src/hooks/useFocusZone";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    // A zone is read as one thing with an inside and an outside, so every demo is drawn with an
    // edge: what the arrow keys reach is what is within it
    zone: "flex w-[18rem] flex-col gap-[var(--base-size-4)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-8)]",
    toolbar:
        "flex flex-wrap items-center gap-[var(--base-size-4)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-8)]",
    muted: "text-foreground-muted",
};

const items = ["Open", "Save", "Rename", "Duplicate", "Archive"];

const signature = `const containerRef = React.useRef<HTMLDivElement>(null);

useFocusZone({ containerRef });

return <div ref={containerRef}>{items}</div>;`;

const options = `useFocusZone({
    // The element focus is moved around within
    containerRef,
    // Which pair of arrow keys the zone answers to
    direction: "vertical",
    // Whether moving off one end comes round to the other
    wrap: false,
    // Leaves the arrow keys alone, for a zone that is not open yet
    disabled: false,
    // Narrows what the arrow keys reach
    focusableFilter,
});`;

const horizontal = `useFocusZone({ containerRef, direction: "horizontal" });`;

const wrapping = `useFocusZone({ containerRef, wrap: true });`;

// The filter is read by an effect, so it is declared once out here rather than rebuilt on every
// render and taking the listener down and up again each time. An inactive button carries
// `data-inactive`, which is the mark the library already puts on something that reads as
// unavailable while staying where the tab key can reach it
const isAvailable = (element: HTMLElement) => element.dataset.inactive === undefined;

const filtering = `// Declared outside the component, so the effect is not taken down on every render
const isAvailable = (element: HTMLElement) => element.dataset.inactive === undefined;

useFocusZone({ containerRef, focusableFilter: isAvailable });`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useFocusZone",
    decorators: [withPage],
};

const Menu = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useFocusZone({ containerRef });

    return (
        <div ref={containerRef} className={classes.zone}>
            {items.map((item) => (
                <Button key={item} variant="invisible" block alignContent="start">
                    {item}
                </Button>
            ))}
        </div>
    );
};

// What a zone is, which is a claim about what the container is rather than about the keys: a set
// of things read together is one stop on the way through the page, not five
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useFocusZone
        </Heading>
        <Text as="p">
            Tab moves between the things on a page. Inside a menu, a toolbar or a list of tabs it is
            the wrong key: those are one thing read together, and tabbing through them makes a
            reader pass five stops to leave what they never meant to enter.{" "}
            <Code>useFocusZone</Code> gives the container the arrow keys, so the set is moved around
            within and left in one step.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The listener is put on the container rather than on the document, so the keys are
            answered only while focus is inside it and the page is left alone the rest of the time.
            Home and End go to either end whichever direction the zone is set to, and a key pressed
            with Alt, Control or Command belongs to the browser and is passed over.
        </Text>
        <Text as="p">Focus the first item below and move down the list with the arrow keys.</Text>
        <Menu />
        <Text as="p">
            What the hook does not do is take the items out of the tab order. It moves focus; it
            does not manage <Code>tabIndex</Code>. A component that wants one tab stop for the whole
            set holds that itself, and reaches for the zone for the movement within it.
        </Text>
    </Stack>
);

// The Options, written out together, since what a zone is is settled by four small answers and
// they are easier to hold in mind whole
export const Options: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Options</Heading>
        <Text as="p">
            Only <Code>containerRef</Code> is required. What the zone reaches is worked out each
            time a key is pressed rather than once when it is set up, so a list that is filtered,
            added to or reordered needs to say nothing.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{options}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <List>
            <List.Item>
                Arriving from outside — tabbing in, or clicking the container itself — the first
                item is where focus lands
            </List.Item>
            <List.Item>
                The event is taken, so the page does not scroll out from under a zone being read
                with the arrow keys
            </List.Item>
            <List.Item>
                An event something else has already answered is left alone, so a zone inside a zone
                does not answer twice
            </List.Item>
        </List>
    </Stack>
);

const Toolbar = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useFocusZone({ containerRef, direction: "horizontal" });

    return (
        <div ref={containerRef} className={classes.toolbar}>
            {items.map((item) => (
                <Button key={item} variant="invisible">
                    {item}
                </Button>
            ))}
        </div>
    );
};

// Direction, which follows how the set is drawn rather than what it is: the arrows a person
// reaches for are the ones pointing the way the items go
export const Direction: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Direction</Heading>
        <Text as="p">
            A zone answers to one pair of arrow keys, and which pair is settled by how the set is
            laid out. <Code>vertical</Code> is the default and takes Up and Down; a row of things
            takes <Code>horizontal</Code>, and Left and Right with it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{horizontal}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Toolbar />
        <Text as="p">
            Only one pair is taken, so the other is left to the page. A row inside a column is two
            zones rather than one, each answering to the keys that point along it.
        </Text>
    </Stack>
);

const Wrapping = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useFocusZone({ containerRef, wrap: true });

    return (
        <div ref={containerRef} className={classes.zone}>
            {items.map((item) => (
                <Button key={item} variant="invisible" block alignContent="start">
                    {item}
                </Button>
            ))}
        </div>
    );
};

// Wrap, which is a smaller decision than it looks: it settles what the end of the list means,
// and the answer is different for a menu than for a set of tabs
export const Wrap: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Wrap</Heading>
        <Text as="p">
            By default the ends are ends: pressing down on the last item leaves focus where it is.{" "}
            <Code>wrap</Code> makes them meet, so moving off one comes round to the other.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{wrapping}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Wrapping />
        <Text as="p">
            Wrapping suits a set with no beginning — a menu, a row of tabs — where coming round is
            quicker than going back. A list long enough that a reader is keeping their place in it
            is better left with ends, since the end of it is information.
        </Text>
    </Stack>
);

const Filtered = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useFocusZone({ containerRef, focusableFilter: isAvailable });

    return (
        <div ref={containerRef} className={classes.zone}>
            {items.map((item, index) => (
                <Button
                    key={item}
                    variant="invisible"
                    block
                    alignContent="start"
                    inactive={index === 2}
                >
                    {item}
                </Button>
            ))}
        </div>
    );
};

// Focusable Filter, which is how a zone says that something in it is in the tab order and still
// not one of the things the arrows are for
export const FocusableFilter: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Focusable filter</Heading>
        <Text as="p">
            A zone reaches everything inside it that can take focus, which is usually what was
            wanted and sometimes more than was meant. <Code>focusableFilter</Code> narrows it: the
            element is passed in, and what comes back says whether the arrows should stop there.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{filtering}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Rename below is inactive. It stays in the tab order so it can still be reached and
            explained, and the arrows pass over it.
        </Text>
        <Filtered />
        <Text as="p">
            The filter is read by the effect that binds the listener, so it is declared outside the
            component or held in a <Code>useCallback</Code>. One rebuilt on every render takes the
            listener down and puts it up again each time.
        </Text>
    </Stack>
);

// Disabled, which is the same thought as everywhere else in the library: a thing that is mounted
// but not yet open should not be answering for keys
export const Disabled: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Disabled</Heading>
        <Text as="p">
            <Code>disabled</Code> leaves the arrow keys alone. It is for a zone that is rendered
            before it is open — a menu kept in the tree between openings, a panel behind a
            transition — where the keys belong to whatever is actually in front of the reader.
        </Text>
        <Text as="p">
            A zone unmounted while closed needs none of this. The listener goes up when the
            container appears and comes down when it does, which is the same moment.
        </Text>
    </Stack>
);
