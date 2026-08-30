import * as React from "react";
import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Button } from "../../../../packages/react/src/components/button";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";
import {
    ThemeProvider,
    useColorSchemeVar,
    useTheme,
} from "../../../../packages/react/src/providers/theme";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
    // The panel is painted from the design tokens rather than from colours written down here,
    // so what the provider settled on is what it is drawn in
    panel: "flex flex-col gap-[var(--base-size-8)] [border-radius:var(--border-radius-medium)] border-[length:var(--border-width-thin)] border-solid border-border-default bg-background-default p-[var(--base-size-16)] text-foreground-default",
    reading: "flex flex-wrap justify-between gap-[var(--base-size-8)]",
    muted: "text-foreground-muted",
    // A mode and a scheme are read as values rather than as prose, so they are set in the
    // monospace stack the rest of the library sets code in
    value: "text-foreground-muted font-[family-name:var(--font-stack-monospace)]",
};

const signature = `<ThemeProvider colorMode="auto">
    <App />
</ThemeProvider>`;

const modes = `<ThemeProvider colorMode="night" dayScheme="light" nightScheme="dark">
    <App />
</ThemeProvider>`;

const nested = `<ThemeProvider colorMode="day">
    <Editor />
    {/* Says only what it changes; the schemes come from the provider above */}
    <ThemeProvider colorMode="night">
        <Preview />
    </ThemeProvider>
</ThemeProvider>`;

const contextOnly = `<ThemeProvider contextOnly colorMode="night">
    <Row />
</ThemeProvider>`;

const reading = `const { colorScheme, resolvedColorMode, setColorMode } = useTheme();`;

const schemeVar = `const border = useColorSchemeVar(
    { light: "var(--base-color-blue-5)", dark: "var(--base-color-yellow-3)" },
    "currentColor",
);`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Providers/ThemeProvider",
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

// The readout every specimen on this page is written around. It is drawn inside whichever
// provider is being demonstrated, so the values it reports and the colours it is painted in
// both come from the same place
const Panel = ({ children }: React.PropsWithChildren) => {
    const { colorScheme, colorMode, resolvedColorMode } = useTheme();

    return (
        <div className={classes.panel}>
            <Reading label="colorMode" value={String(colorMode)} />
            <Reading label="resolvedColorMode" value={String(resolvedColorMode)} />
            <Reading label="colorScheme" value={String(colorScheme)} />
            {children}
        </div>
    );
};

// What the provider is for, which is smaller than it sounds and easy to miss: the tokens are
// in the bundle either way, and this is what brings them onto the page
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            ThemeProvider
        </Heading>
        <Text as="p">
            The design tokens every component is drawn from are scoped to <Code>[data-theme]</Code>.
            Importing the stylesheet puts them in the bundle; it does not put them on the page.{" "}
            <Code>ThemeProvider</Code> is what does that — it settles on one of the two colour
            schemes and writes it to the attribute the tokens are scoped to, so everything below it
            has colours to be drawn in.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{signature}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            One at the root of the application is usually the whole of it. What it renders is a{" "}
            <Code>div</Code> carrying <Code>data-theme</Code> and <Code>data-color-mode</Code>, and
            a context holding the same values for the components that have to read the scheme rather
            than be painted by it.
        </Text>
        <ThemeProvider>
            <Panel />
        </ThemeProvider>
    </Stack>
);

// Modes And Schemes, which is the one distinction the rest of the page turns on and the one
// worth reading slowly: a scheme is a set of tokens, a mode is a time of day
export const ModesAndSchemes: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Modes and schemes</Heading>
        <Text as="p">
            Two things are being named here, and they are not the same thing. A scheme is a set of
            tokens: there are two of them, <Code>light</Code> and <Code>dark</Code>, and they are
            the two <Code>styles/themes</Code> defines. A mode is what the subtree is currently in.{" "}
            <Code>day</Code> and <Code>night</Code> name a time of day rather than a set of colours,
            and which scheme each of them resolves to is the application&apos;s to decide.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{modes}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <List>
            <List.Item>
                <Code>colorMode</Code> is which mode the subtree is in, and the only one of the
                three most applications ever set
            </List.Item>
            <List.Item>
                <Code>dayScheme</Code> is the scheme day mode resolves to, and is <Code>light</Code>{" "}
                until something says otherwise
            </List.Item>
            <List.Item>
                <Code>nightScheme</Code> is the scheme night mode resolves to, and is{" "}
                <Code>dark</Code>
            </List.Item>
        </List>
        <Text as="p">
            The separation is what lets a reader who wants dark at night still be given dark by day:
            they set <Code>dayScheme</Code>, and the mode goes on following the clock. It is also
            why <Code>light</Code> and <Code>dark</Code> are accepted as modes but are not the same
            as the schemes they are named after — they are aliases for <Code>day</Code> and{" "}
            <Code>night</Code>, and still resolve through whichever schemes those were given.
        </Text>
        <Stack gap="condensed">
            <ThemeProvider colorMode="day">
                <Panel />
            </ThemeProvider>
            <ThemeProvider colorMode="night">
                <Panel />
            </ThemeProvider>
        </Stack>
    </Stack>
);

// Auto, which is the mode most applications should be reaching for, and the one that has an
// answer on the server as well as in the browser
export const Auto: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Auto</Heading>
        <Text as="p">
            <Code>colorMode=&quot;auto&quot;</Code> follows the operating system. The query behind
            it is <Code>prefers-color-scheme: dark</Code>, and it is subscribed to rather than read
            once, so a reader who changes their system setting with the page already open sees the
            page change with it.
        </Text>
        <Text as="p">
            What it settled on comes back as <Code>resolvedColorMode</Code>, which is always a mode
            and never <Code>auto</Code>. That is the value to read when something has to know what
            is actually on the screen — a nested provider taking the opposite of it, or a control
            drawing the state it would switch to.
        </Text>
        <ThemeProvider colorMode="auto">
            <Panel />
        </ThemeProvider>
        <Text as="p">
            On the server there is nothing to ask, so <Code>auto</Code> resolves to <Code>day</Code>
            . That is a decision about which markup is sent rather than a guess at the truth: the
            client hydrates against the same answer and corrects itself afterwards.
        </Text>
    </Stack>
);

// Nesting, which is where the inheritance matters: a provider inside another only has to say
// what it changes, and everything it does not say is already settled above
export const Nesting: StoryFn = () => {
    // A provider that takes the opposite of whatever the one above it settled on
    const Inverse = () => {
        const { resolvedColorMode } = useTheme();

        return (
            <ThemeProvider colorMode={resolvedColorMode === "day" ? "night" : "day"}>
                <Panel />
            </ThemeProvider>
        );
    };

    return (
        <Stack gap="normal">
            <Heading size="medium">Nesting</Heading>
            <Text as="p">
                Anything a provider is not given comes from the provider above it. So a second one
                inside the first says only what it changes, and the schemes, or the mode, or both,
                go on being whatever the application already settled.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{nested}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p">
                That is what a panel drawn in the opposite scheme is: a preview showing what the
                other half of the reader&apos;s audience will see, or a code sample kept dark on a
                page that is otherwise light. Below, the inner provider reads{" "}
                <Code>resolvedColorMode</Code> and inverts it, so it stays the opposite of the outer
                one whatever that one is set to.
            </Text>
            <ThemeProvider colorMode="day">
                <Stack gap="condensed">
                    <Panel />
                    <Inverse />
                </Stack>
            </ThemeProvider>
        </Stack>
    );
};

// Context Only, which is the escape hatch and comes with the one caveat that makes it an
// escape hatch: the element is what carries the tokens, so leaving it out leaves them behind
export const ContextOnly: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Context only</Heading>
        <Text as="p">
            The wrapping <Code>div</Code> is usually harmless and occasionally not — inside a table,
            or a grid, or anywhere the layout counts its children. <Code>contextOnly</Code> hands
            the theme down without it.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{contextOnly}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            What is given up is the part that does the painting. <Code>data-theme</Code> is written
            to the element, so with no element the tokens go on coming from whichever ancestor
            carries the attribute: the values a component reads change and the colours it is drawn
            in do not. It is for handing a scheme to components that read <Code>useTheme</Code> and
            decide something with it, not for putting a subtree into another scheme.
        </Text>
        <ThemeProvider colorMode="day">
            <Stack gap="condensed">
                <Panel />
                {/* Nothing is wrapped, so the panel below is still painted by the tokens above
                    and only the values it reports change */}
                <ThemeProvider contextOnly colorMode="night">
                    <Panel />
                </ThemeProvider>
            </Stack>
        </ThemeProvider>
    </Stack>
);

// Reading The Theme, which is the half of the provider that is not the attribute: the values a
// component can ask for, and the setters that make a theme switcher a few lines long
export const ReadingTheTheme: StoryFn = () => {
    // The control sits inside the provider it changes, which is what makes this the whole of a
    // theme switcher
    const Switch = () => {
        const { resolvedColorMode, setColorMode } = useTheme();

        return (
            <Button
                variant="primary"
                size="small"
                onClick={() => setColorMode(resolvedColorMode === "day" ? "night" : "day")}
            >
                Switch to {resolvedColorMode === "day" ? "night" : "day"}
            </Button>
        );
    };

    // For the handful of cases a design token cannot cover
    const Swatch = () => {
        const border = useColorSchemeVar(
            { light: "var(--base-color-blue-5)", dark: "var(--base-color-yellow-3)" },
            "currentColor",
        );

        return (
            <div className={classes.panel} style={{ borderColor: border }}>
                <Text size="small" className={classes.muted}>
                    A border the design tokens have no name for
                </Text>
            </div>
        );
    };

    return (
        <Stack gap="normal">
            <Heading size="medium">Reading the theme</Heading>
            <Text as="p">
                <Code>useTheme</Code> hands back what the provider settled on and the setters for
                changing it. It can be called anywhere — the context carries a default, so there is
                no provider to check for and no null to guard against.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{reading}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <Text as="p">
                The setters change the state of the nearest provider above, so a control that
                switches the theme is an ordinary component placed inside the provider it switches.
                Whatever the application passed as <Code>colorMode</Code> is the value the provider
                starts from and follows afterwards, which is what lets a stored preference be handed
                in as a prop and still be changed from inside.
            </Text>
            <ThemeProvider>
                <Panel>
                    <Switch />
                </Panel>
            </ThemeProvider>
            <Text as="p">
                <Code>useColorSchemeVar</Code> is for the handful of cases a token cannot answer: it
                takes a value per scheme and hands back the one in force. Anything a design token
                already has a name for should read the token instead, since a value written this way
                is one more place to remember when a scheme changes.
            </Text>
            <CodeBlock language="tsx">
                <CodeBlock.Content>
                    <CodeBlock.Code>{schemeVar}</CodeBlock.Code>
                </CodeBlock.Content>
            </CodeBlock>
            <ThemeProvider colorMode="auto">
                <Swatch />
            </ThemeProvider>
        </Stack>
    );
};
