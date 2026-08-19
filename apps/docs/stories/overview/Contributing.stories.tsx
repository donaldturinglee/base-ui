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

const fork = `git clone https://github.com/your_username/base-ui.git
cd base-ui
npm install
git checkout -b feature/amazing-feature`;

const layout = `package.json           the workspace root, private and never published
turbo.json             the task pipeline, and what each task caches
.prettierrc            shared by every package
apps/docs/             @gamecrafters/docs, the Storybook the components are read in
packages/react/        @gamecrafters/base-ui, the published package
packages/react/e2e/    @gamecrafters/e2e, the suites driven through a browser
packages/config/       a package per tool, the config the packages are checked under`;

const checks = `npm run lint
npm test
npm run test:e2e`;

const commit = `git commit -m "feat: add StatusDot component with stories, tests, and styles"
git push origin feature/amazing-feature`;

const files = `packages/react/src/components/status-dot/
    StatusDot.tsx                    the component
    StatusDot.types.ts               the props, and the unions they are drawn from
    StatusDot.test.tsx               the Vitest suite
    StatusDot.stories.tsx            Default and Playground
    StatusDot.features.stories.tsx   one story for each thing it can do
    index.ts                         the component and its types, named

packages/react/src/styles/components/status-dot.css`;

const barrel = 'export * from "./status-dot";';

const stylesheet = '@import "./status-dot.css";';

const component = `function StatusDot<As extends React.ElementType = "span">(
    props: StatusDotProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as, className, status = "ready", ...rest } = props as StatusDotProps<"span">;

    const Component: React.ElementType = as ?? "span";

    return (
        <Component
            ref={ref}
            className={classNames(statusDotVariants({ status }), className)}
            data-component="StatusDot"
            data-status={status}
            {...rest}
        />
    );
}`;

const scripts = `npm run storybook        Runs Storybook on port 9000
npm run storybook:build  Builds the static Storybook
npm test                 Runs the Vitest suites
npm run test:e2e         Runs the Playwright suites against Storybook
npm run build            Builds the package with Rolldown into packages/react/build/
npm run lint             Lints each package's own sources with ESLint
npm run format           Applies both the ESLint and Prettier fixes
npm run clean            Removes the build output`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Overview/Contributing",
    decorators: [withPage],
};

// The whole of a contribution, in the order it happens. Everything below this is one of these
// steps gone into at length
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            Contributing
        </Heading>
        <Text as="p">
            A change arrives as a pull request from a fork. The repository is{" "}
            <Link href="https://github.com/donaldturinglee/base-ui">donaldturinglee/base-ui</Link>,
            and a fork of it is cloned, installed and branched the way any other project would be.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{fork}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The repository is an npm workspace. The library is a package inside it rather than the
            repository itself, and the root holds only what every package shares: the Prettier
            configuration, and the Turbo pipeline the scripts are run through. Configuration that
            belongs to a tool rather than to the root is a package per tool beside the library, and
            the end to end suites are a package inside it, since what they are run against is its
            own Storybook. The scripts are still run from the root, and Turbo caches each task
            against its inputs so an unchanged package is not built or tested twice.
        </Text>
        <CodeBlock language="text">
            <CodeBlock.Content>
                <CodeBlock.Code>{layout}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The work itself is done in Storybook, which is where the components are both developed
            and read. What is then asked of the branch before it is opened as a pull request is only
            that it passes what the repository already checks on its own.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{checks}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Commits are written the way the history already reads, which is Conventional Commits: a{" "}
            <Code>feat</Code>, <Code>fix</Code>, <Code>refactor</Code> or <Code>chore</Code> against
            a summary of what the change does.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{commit}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Adding A Component, which is the most common contribution and the one with the most parts to
// it, since a component is a directory rather than a file
export const AddingAComponent: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Adding a component</Heading>
        <Text as="p">
            A new component follows the shape of the ones already there. The directory is named in
            kebab case and everything inside it is named after the component, so a file can be found
            from the component and the component from the file.
        </Text>
        <CodeBlock language="text">
            <CodeBlock.Content>
                <CodeBlock.Code>{files}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Nothing is exported until it is added to the two barrels. The first is what an
            application imports the component from, and the second is what the stylesheet the
            component is drawn by is carried in by.
        </Text>
        <CodeBlock language="typescript">
            <CodeBlock.Header>
                <CodeBlock.Title>packages/react/src/components/index.ts</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{barrel}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <CodeBlock language="css">
            <CodeBlock.Header>
                <CodeBlock.Title>packages/react/src/styles/components/main.css</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{stylesheet}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// How A Component Is Written, which is the part a reviewer will otherwise have to say out loud,
// since every one of these is already true of every component in the library
export const HowAComponentIsWritten: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">How a component is written</Heading>
        <Text as="p">
            The components are consistent with each other rather than each written to its own taste.
            What that consistency is made of:
        </Text>
        <List>
            <List.Item>
                An <Code>as</Code> prop, so the element a component is drawn as is the caller&apos;s
                to settle
            </List.Item>
            <List.Item>A forwarded ref, reaching the root element</List.Item>
            <List.Item>
                A <Code>className</Code> merged onto that root rather than replacing what is already
                there
            </List.Item>
            <List.Item>
                A <Code>data-component</Code> attribute naming the component, and a{" "}
                <Code>data-*</Code> attribute for each variant it was drawn under
            </List.Item>
            <List.Item>
                Semantic class names from <Code>cva</Code>, so the stylesheet holds what the
                component is drawn from and the implementation only names it
            </List.Item>
        </List>
        <CodeBlock language="tsx">
            <CodeBlock.Header>
                <CodeBlock.Title>StatusDot.tsx</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{component}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Comments are written for the reader who is asking why rather than what. What a line does
            is already there in the line; what it is for, and what it would cost to do it the
            obvious way instead, is not.
        </Text>
    </Stack>
);

// What Is Checked, and the one thing that is deliberately not, since a check that is known to
// fail is worse than no check at all
export const WhatIsChecked: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">What is checked</Heading>
        <Text as="p">
            A component is expected to carry a Vitest suite, and the suites are held to what a
            reader of the component would ask of it: that it draws the element it says it draws,
            that each variant reaches the element, that a ref and a <Code>className</Code> get
            through, and that a screen reader is told what it needs to be told. Everything a browser
            has the last word on — where focus lands, what the top layer holds, what colour the
            cascade came out with — is held to a Playwright suite instead, driven against the
            component&apos;s own story.
        </Text>
        <List>
            <List.Item>
                <Code>npm run lint</Code> — ESLint over each package&apos;s own sources
            </List.Item>
            <List.Item>
                <Code>npm test</Code> — the Vitest suites, run under the config in{" "}
                <Code>packages/react/src/tests</Code>
            </List.Item>
            <List.Item>
                <Code>npm run test:e2e</Code> — the Playwright suites in{" "}
                <Code>packages/react/e2e</Code>, run against a Storybook brought up for them
            </List.Item>
            <List.Item>
                <Code>npm run format</Code> — the ESLint and Prettier fixes, applied rather than
                only reported
            </List.Item>
        </List>
        <Text as="p">
            Lint and tests are run again on the way to npm, and so is the build. Prettier is left
            out of that workflow on purpose: it currently fails on the generated stylesheets under{" "}
            <Code>packages/react/src/styles</Code>, and a check that is known to fail would stop
            every publish rather than catch anything. It goes back in once those files are
            formatted.
        </Text>
        <CodeBlock language="text">
            <CodeBlock.Content>
                <CodeBlock.Code>{scripts}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Releasing, which is not part of a contribution but is what happens to one afterwards, and is
// the answer to how long it takes for a merged change to be installable
export const Releasing: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Releasing</Heading>
        <Text as="p">
            A merged change is not published by being merged. What sends the package to npm is a
            published GitHub release, so a release is cut once the version in{" "}
            <Code>packages/react/package.json</Code> has been raised to what is going out.
        </Text>
        <Text as="p">
            The tag the release is cut from is held against that version before anything is
            uploaded, and a tag that disagrees with it stops the workflow. Lint, the tests and the
            build are all run first, so a release can only ever ship something that builds and
            passes its tests.
        </Text>
        <Text as="p">
            The workflow can be run by hand as a dry run, which does everything a publish does but
            the upload and lists what would have been sent.
        </Text>
    </Stack>
);
