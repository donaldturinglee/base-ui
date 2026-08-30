import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import {
    useMedia,
    useResponsiveValue,
    viewportRanges,
} from "../../../../packages/react/src/hooks/useResponsive";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    panel: "flex flex-col gap-[var(--base-size-8)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default p-[var(--base-size-16)]",
    reading: "flex flex-wrap justify-between gap-[var(--base-size-8)]",
    muted: "text-foreground-muted",
    // A query and its answer are read as values rather than as prose, so they are set in the
    // monospace stack the rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

const ranges = `export const viewportRanges = {
    narrow: "(max-width: calc(768px - 0.02px))", // < 768px
    regular: "(min-width: 768px)",               // >= 768px
    wide: "(min-width: 1400px)",                 // >= 1400px
};`;

const media = `const isNarrow = useMedia(viewportRanges.narrow, false);`;

const responsive = `const columns = useResponsiveValue({ narrow: 1, regular: 2, wide: 3 }, 1);`;

const passthrough = `// A plain value is handed straight back
const columns = useResponsiveValue(2, 1);`;

const matchMedia = `<MatchMediaContext.Provider value={{ [viewportRanges.narrow]: true }}>
    <Sidebar />
</MatchMediaContext.Provider>`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Hooks/useResponsive",
    decorators: [withPage],
};

const Reading = ({ label, value }: { label: string; value: string }) => (
    <div className={classes.reading}>
        <Text size="small" className={classes.value}>
            {label}
        </Text>
        <Text size="small" weight="semibold">
            {value}
        </Text>
    </div>
);

// The live readout the page is written around. Resizing the preview is the whole demonstration,
// so what it shows is the three ranges and what a value given per range resolves to
const Viewport = () => {
    const isNarrow = useMedia(viewportRanges.narrow, false);
    const isRegular = useMedia(viewportRanges.regular, false);
    const isWide = useMedia(viewportRanges.wide, false);
    const resolved = useResponsiveValue(
        { narrow: "narrow", regular: "regular", wide: "wide" },
        "none",
    );

    return (
        <div className={classes.panel}>
            <Reading label="narrow" value={String(isNarrow)} />
            <Reading label="regular" value={String(isRegular)} />
            <Reading label="wide" value={String(isWide)} />
            <Reading label="useResponsiveValue" value={resolved} />
        </div>
    );
};

// What the module holds, which is two hooks rather than one: a subscription to a query, and a
// value chosen by which query is answering
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            useResponsive
        </Heading>
        <Text as="p">
            Most of what changes with the width of a window belongs in CSS, where it costs nothing
            and needs no JavaScript to run. What is left is the part CSS cannot reach: how many
            items a component renders, whether a panel is drawn as a sidebar or a drawer, which of
            two components is mounted at all.
        </Text>
        <Text as="p">
            Two hooks answer that. <Code>useMedia</Code> subscribes to a media query, and{" "}
            <Code>useResponsiveValue</Code> takes a value given per viewport range and hands back
            the one in force.
        </Text>
        <Text as="p">Both are live. Resize the preview and the readout below follows it.</Text>
        <Viewport />
    </Stack>
);

// The Viewport Ranges, which are three names and two numbers, and are worth reading once because
// everything else on this page is expressed in them
export const ViewportRanges: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Viewport ranges</Heading>
        <Text as="p">
            Three ranges are named, and they are the same three the components are written against.
            They are exported rather than kept private, so an application asking about the viewport
            asks the same question the library does.
        </Text>
        <CodeBlock language="ts">
            <CodeBlock.Content>
                <CodeBlock.Code>{ranges}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            They are not exclusive. <Code>regular</Code> and <Code>wide</Code> both match anything
            at 1400px and over, which is deliberate: <Code>regular</Code> means &quot;at least a
            tablet&quot; rather than &quot;a tablet&quot;, so a value given only for{" "}
            <Code>regular</Code> holds all the way up.
        </Text>
        <Text as="p">
            The half-pixel taken off <Code>narrow</Code> is so that the two do not both match at
            exactly 768px, which is the width at which a browser would otherwise answer yes twice.
        </Text>
    </Stack>
);

// useMedia, which is the smaller of the two and the one an application reaches for when it has a
// query of its own rather than one of the three
export const UseMedia: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">useMedia</Heading>
        <Text as="p">
            <Code>useMedia</Code> takes any media query and reports whether it matches, following it
            as the window changes. It is built on <Code>useSyncExternalStore</Code>, so the answer
            is read from the browser rather than kept in state and pushed at it — there is no render
            in which the component and the window disagree.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{media}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The second argument is what to say on the server, where there is no window to ask. It is
            not a guess at the truth so much as a decision about which markup is sent: the server
            renders that answer, and the client hydrates against the same one before correcting
            itself. Leaving it out answers <Code>false</Code>.
        </Text>
        <Text as="p">
            The query is not restricted to width. <Code>prefers-reduced-motion</Code>,{" "}
            <Code>prefers-color-scheme</Code> and <Code>pointer: coarse</Code> are all asked the
            same way.
        </Text>
    </Stack>
);

// useResponsiveValue, which is the one components actually use. It is a small function around
// useMedia, and the value of it is that a caller writes what it wants rather than which query
export const ResponsiveValues: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Responsive values</Heading>
        <Text as="p">
            <Code>useResponsiveValue</Code> takes an object keyed by range and gives back the one
            that applies. A prop written this way says what it should be at each width, and nothing
            in the component has to know about media queries at all.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{responsive}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">The keys are read in a fixed order, and the first one that answers wins:</Text>
        <List variant="number">
            <List.Item>
                <Code>narrow</Code>, if the viewport is narrow and the key was given
            </List.Item>
            <List.Item>
                <Code>wide</Code>, if the viewport is wide and the key was given
            </List.Item>
            <List.Item>
                <Code>regular</Code>, if the viewport is regular and the key was given
            </List.Item>
            <List.Item>the fallback, if none of them answered</List.Item>
        </List>
        <Text as="p">
            <Code>wide</Code> is asked before <Code>regular</Code> because both match on a wide
            screen, and the more specific of the two is the one that was meant. A value given only
            for <Code>regular</Code> therefore holds at every width from 768px up.
        </Text>
        <Text as="p">
            Anything that is not an object of those keys is handed straight back, which is what lets
            a prop take either form. A caller writes <Code>2</Code> or{" "}
            <Code>{"{ narrow: 1, regular: 2 }"}</Code> and the component reads it the same way.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{passthrough}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// MatchMedia, which is how a query is answered without a window: for a test, for a story, and for
// a frame that is narrow while the window it is in is not
export const MatchMedia: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">MatchMedia</Heading>
        <Text as="p">
            A query given through <Code>MatchMediaContext</Code> is answered from the context and
            nothing is subscribed to at all. It is how a component is put into a viewport it is not
            in: a test that renders a narrow layout in a full-sized window, or a preview that has to
            be drawn as it would be on a phone.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{matchMedia}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The context is keyed by the query string itself, so what is pinned is exactly the
            question being asked. A query the context says nothing about goes on being asked of the
            browser as usual.
        </Text>
    </Stack>
);
