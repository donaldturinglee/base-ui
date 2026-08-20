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

const install = "npm install @gamecrafters/base-ui";

const packageManagers = `npm install @gamecrafters/base-ui
yarn add @gamecrafters/base-ui
pnpm add @gamecrafters/base-ui`;

const peerDependencies = `{
    "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0",
        "react-dom": "^18.0.0 || ^19.0.0"
    }
}`;

const stylesheet = 'import "@gamecrafters/base-ui/main.css";';

const themed = `import type { ReactNode } from "react";
import { ThemeProvider } from "@gamecrafters/base-ui/react";
import "@gamecrafters/base-ui/main.css";

const App = ({ children }: { children: ReactNode }) => (
    <ThemeProvider colorMode="auto">{children}</ThemeProvider>
);`;

const clone = `git clone https://github.com/donaldturinglee/base-ui.git
cd base-ui
npm install
npm run storybook`;

const remote = `git remote set-url origin https://github.com/your_username/base-ui.git
git remote -v`;

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Overview/Installation",
    decorators: [withPage],
};

// The two things an application does to be able to draw anything: the package is installed,
// and the stylesheet the components are drawn by is imported
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            Installation
        </Heading>
        <Text as="p">
            Base UI is published to npm as <Code>@gamecrafters/base-ui</Code>. An application
            installs the package and imports its stylesheet once, and everything after that is a
            component import.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{install}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <CodeBlock language="tsx">
            <CodeBlock.Header>
                <CodeBlock.Title>main.tsx</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{stylesheet}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Package Managers, since the package is nothing but a package and is asked for the way the
// project already asks for the rest of them
export const PackageManagers: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Package managers</Heading>
        <Text as="p">
            Nothing about the package is tied to one manager, so it is installed by whichever one
            the project is already kept under.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{packageManagers}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Peer Dependencies, which are asked for rather than carried, so the application keeps the one
// copy of React it was already building against
export const PeerDependencies: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Peer dependencies</Heading>
        <Text as="p">
            React and <Code>react-dom</Code> are peer dependencies. They are asked for rather than
            carried, so the components are drawn by the copy of React the application already has
            instead of a second one bundled beside it.
        </Text>
        <CodeBlock language="json">
            <CodeBlock.Header>
                <CodeBlock.Title>package.json</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{peerDependencies}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// The Stylesheet, and the reason importing it is not on its own enough: what it carries is
// scoped to a scheme, and it is a provider that says which scheme is in force
export const TheStylesheet: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">The stylesheet</Heading>
        <Text as="p">
            One stylesheet stands behind the whole library, and it is imported once at the root of
            the application. It carries:
        </Text>
        <List>
            <List.Item>The design tokens both colour schemes are drawn from</List.Item>
            <List.Item>The styles every component is drawn by</List.Item>
            <List.Item>The base and utility layers those styles are built on</List.Item>
        </List>
        <Text as="p">
            The tokens are scoped to <Code>[data-theme]</Code>, so they resolve only once something
            has set the attribute. That is what <Code>ThemeProvider</Code> is for: wrap the
            application in one and the subtree beneath it has a scheme to read the tokens under.{" "}
            <Code>colorMode</Code> takes <Code>day</Code>, <Code>night</Code> or <Code>auto</Code>,
            and <Code>auto</Code> follows the operating system.
        </Text>
        <CodeBlock language="tsx">
            <CodeBlock.Header>
                <CodeBlock.Title>App.tsx</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{themed}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Working On The Library, which is a clone rather than an install, since Storybook is where
// the components are developed and read
export const WorkingOnTheLibrary: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Working on the library</Heading>
        <Text as="p">
            The components are developed and read in Storybook, so a clone is set up by installing
            the dependencies and starting it. It is served on port 3001.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{clone}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            Working from a fork, point the remote at the fork so that nothing is pushed to the base
            project by accident. The repository is{" "}
            <Link href="https://github.com/donaldturinglee/base-ui">donaldturinglee/base-ui</Link>.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{remote}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);
