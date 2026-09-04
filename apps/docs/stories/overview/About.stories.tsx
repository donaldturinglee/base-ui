import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../../../packages/react/src/components/code";
import { CodeBlock } from "../../../../packages/react/src/components/code-block";
import { Heading } from "../../../../packages/react/src/components/heading";
import { Link } from "../../../../packages/react/src/components/link";
import { List } from "../../../../packages/react/src/components/list";
import { Stack } from "../../../../packages/react/src/components/stack";
import { Text } from "../../../../packages/react/src/components/text";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
};

const layers = `@import "tailwindcss";
@import "tw-animate-css";
@import "./utilities/main.css";
@import "./base/main.css";
@import "./themes/main.css";
@import "./components/main.css";`;

const tokens = `[data-theme="light"] {
    --base-color-blue-5: #0969da;
}

[data-theme="dark"] {
    --base-color-blue-5: #1f6feb;
}

[data-theme] {
    --background-color-accent-emphasis: var(--base-color-blue-5);
}`;

const usage = '<Button variant="primary">Save</Button>';

const drawn = `.button-primary {
    background-color: var(--button-primary-background-color-rest);
    color: var(--button-primary-foreground-color-rest);
}`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Overview/About",
    decorators: [withPage],
};

// What the library is, said once and without qualification, since everything else on this page
// is an answer to a question a reader only has after this one
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            About
        </Heading>
        <Text as="p">
            Base UI is an implementation of GameCrafters&apos; Base UI Design System in React. It is
            published to npm as <Code>@gamecrafters/base-ui</Code> and developed in the open at{" "}
            <Link href="https://github.com/gamecrafters-io/base-ui">gamecrafters-io/base-ui</Link>.
        </Text>
        <Text as="p">
            What it is for is applications that would otherwise each answer the same questions
            again: what a button looks like when it is pressed, what a form says when it is filled
            in wrongly, what happens to a menu at the edge of the window. Those answers are given
            once here, and an application reaches for the component rather than making the decision
            a second time.
        </Text>
        <Text as="p">
            Storybook is not a site written about the library — it is the library, drawn. Every
            component has a page of its own, with a Playground story for its props and a Features
            section for each thing it can do, so what is read here is the component itself rather
            than an account of it.
        </Text>
    </Stack>
);

// What Is In It, which is worth saying plainly, since a component library is often taken to be
// only its components and the rest of it is then found by accident
export const WhatIsInIt: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">What is in it</Heading>
        <Text as="p">
            Everything is exported from the one entry point, and the stylesheet behind all of it is
            imported once. What comes out of that entry point is of three kinds:
        </Text>
        <List>
            <List.Item>
                More than a hundred components, from the small ones a page is built out of —{" "}
                <Code>Text</Code>, <Code>Stack</Code>, <Code>Button</Code> — up to the ones that are
                an interface in themselves, like <Code>DataTable</Code>, <Code>CommandPalette</Code>{" "}
                and <Code>RichTextEditor</Code>
            </List.Item>
            <List.Item>
                Providers, which say something a whole subtree is drawn under rather than any one
                component: <Code>ThemeProvider</Code> for the colour scheme,{" "}
                <Code>DirectionProvider</Code> for reading direction, and{" "}
                <Code>OverflowObserverProvider</Code> for whether an element has been clipped
            </List.Item>
            <List.Item>
                The hooks the components are themselves built out of — trapping focus, locking the
                scroll, merging refs, answering to a breakpoint — which are there because an
                application composing its own thing out of these components needs the same behaviour
                the library needed
            </List.Item>
        </List>
    </Stack>
);

// How It Is Put Together, which is the one thing worth understanding before changing anything,
// since almost every decision in the library follows from where a value is allowed to live
export const HowItIsPutTogether: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">How it is put together</Heading>
        <Text as="p">
            One stylesheet stands behind the library, and it is assembled in layers. The order they
            are imported in is the order they are drawn in, so what a caller passes still wins over
            what a component named for itself.
        </Text>
        <CodeBlock language="css">
            <CodeBlock.Header>
                <CodeBlock.Title>src/styles/main.css</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{layers}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The colours are not written where they are used. A palette is declared against{" "}
            <Code>[data-theme]</Code>, one file for each scheme and every token in one answered by a
            token of the same name in the other, and the tokens a component actually names are
            derived from that palette once, for both schemes at the same time.
        </Text>
        <CodeBlock language="css">
            <CodeBlock.Content>
                <CodeBlock.Code>{tokens}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            That is what makes a scheme a matter of one attribute rather than a second set of
            components: the reference is resolved against whichever palette the element carrying the
            attribute holds. A component names the token and never the colour, so it is drawn
            correctly under a scheme it was never written against.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Content>
                <CodeBlock.Code>{usage}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <CodeBlock language="css">
            <CodeBlock.Content>
                <CodeBlock.Code>{drawn}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// What It Is Built On, and the reason the list is as short as it is: what an application already
// has is asked for rather than carried
export const WhatItIsBuiltOn: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">What it is built on</Heading>
        <Text as="p">
            The components are TypeScript and React, styled with Tailwind and built into the package
            with Rolldown. React and <Code>react-dom</Code> are peer dependencies, so the components
            are drawn by the copy of React the application already has.
        </Text>
        <List>
            <List.Item>
                <Code>class-variance-authority</Code>, <Code>clsx</Code> and{" "}
                <Code>tailwind-merge</Code>, which are what a variant becomes a class name through,
                and what settles which of two conflicting classes is kept
            </List.Item>
            <List.Item>
                <Code>shiki</Code>, <Code>lexical</Code>, <Code>recharts</Code> and{" "}
                <Code>dayjs</Code>, each behind the one component that needs it —{" "}
                <Code>CodeBlock</Code>, <Code>RichTextEditor</Code>, <Code>Chart</Code>,{" "}
                <Code>Calendar</Code>
            </List.Item>
            <List.Item>
                Storybook, Vitest, Playwright and ESLint, none of which are shipped: they are what
                the library is developed, checked and read under
            </List.Item>
        </List>
        <Text as="p">
            The heavier dependencies are left external to the bundle rather than folded into it, so
            an application that never reaches for the component that needs one never pays for it.
        </Text>
    </Stack>
);

// The Licence, and the state the version number is honest about, which is the pair of things
// anyone deciding whether to depend on this has to know
export const Licence: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Licence</Heading>
        <Text as="p">
            Base UI is distributed under the{" "}
            <Link href="https://github.com/gamecrafters-io/base-ui/blob/main/LICENSE">
                MIT Licence
            </Link>
            , © 2026 Donald Lee. It may be used, changed and redistributed, in a commercial product
            as readily as anywhere else, so long as the notice is kept with it.
        </Text>
        <Text as="p">
            The version is still below <Code>1.0.0</Code>, and it is meant literally: the API is
            settled component by component as each is used in earnest, so a minor release can still
            change one. What has gone out and what changed with it is on the{" "}
            <Link href="https://github.com/gamecrafters-io/base-ui/releases">releases page</Link>.
        </Text>
    </Stack>
);
