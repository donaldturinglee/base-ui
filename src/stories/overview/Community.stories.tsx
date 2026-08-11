import type { Decorator, StoryFn } from "@storybook/react-vite";
import { Code } from "../../components/code";
import { CodeBlock } from "../../components/code-block";
import { Heading } from "../../components/heading";
import { Link } from "../../components/link";
import { List } from "../../components/list";
import { Stack } from "../../components/stack";
import { Text } from "../../components/text";

const classes = {
    // The page is read as prose rather than looked at as a specimen, so it is held to a
    // measure instead of running out to the width of whatever it is opened in
    page: "max-w-[42rem]",
};

const report = `### What happened

Picking a date leaves the input empty.

### What was expected

The input holds the date that was picked.

### How to see it

1. Open a DatePicker
2. Pick any date
3. The input is still empty

### Versions

@gamecrafters/base-ui 0.0.14, react 19.2.0, Chrome 141`;

const version = "npm list @gamecrafters/base-ui react react-dom";

const withPage: Decorator = (Story) => (
    <div className={classes.page}>
        <Story />
    </div>
);

export default {
    title: "Overview/Community",
    decorators: [withPage],
};

// The one thing worth saying before any of the addresses: the work itself is carried out in
// the open on GitHub, and everywhere else is the conversation around it
export const Default: StoryFn = () => (
    <Stack gap="normal">
        <Heading as="h1" size="large">
            Community
        </Heading>
        <Text as="p">
            Base UI is developed in the open. Everything that becomes part of the library is raised,
            argued over and reviewed on GitHub, so that is where anything to do with the work itself
            belongs. The other places are for the conversation around it.
        </Text>
        <List>
            <List.Item>
                <Link href="https://github.com/donaldturinglee/base-ui/issues">Issues</Link> — bugs
                and proposals, and the record of what has already been asked
            </List.Item>
            <List.Item>
                <Link href="https://github.com/donaldturinglee/base-ui/pulls">Pull requests</Link> —
                the changes currently up for review
            </List.Item>
            <List.Item>
                <Link href="https://discord.gg/YsteKRjrSH">Discord</Link> — questions, and the
                things that are easier asked than written up
            </List.Item>
            <List.Item>
                <Link href="https://www.npmjs.com/package/@gamecrafters/base-ui">npm</Link> — what
                has actually been published
            </List.Item>
        </List>
    </Stack>
);

// Reporting A Bug, which is the same page as any other issue with one label on it, and is
// answered by what it carries rather than by how it is worded
export const ReportingABug: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Reporting a bug</Heading>
        <Text as="p">
            A bug is{" "}
            <Link href="https://github.com/donaldturinglee/base-ui/issues/new?labels=bug">
                opened as an issue
            </Link>{" "}
            under the <Code>bug</Code> label. What settles how quickly it is dealt with is not how
            it is worded but whether it can be reproduced, so a report is worth the three things
            that let someone else see it happen:
        </Text>
        <List>
            <List.Item>What was expected, and what happened instead</List.Item>
            <List.Item>The shortest run of steps that brings it about</List.Item>
            <List.Item>The versions it was seen under, and the browser it was seen in</List.Item>
        </List>
        <CodeBlock language="markdown">
            <CodeBlock.Content>
                <CodeBlock.Code>{report}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <Text as="p">
            The versions are read off the installed tree rather than remembered, since what is
            installed and what was asked for in <Code>package.json</Code> are not always the same
            thing.
        </Text>
        <CodeBlock language="shellscript">
            <CodeBlock.Content>
                <CodeBlock.Code>{version}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Requesting A Feature, which is a case rather than a specification: what the application was
// trying to do is what a component can be designed against
export const RequestingAFeature: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Requesting a feature</Heading>
        <Text as="p">
            A proposal is{" "}
            <Link href="https://github.com/donaldturinglee/base-ui/issues/new?labels=enhancement">
                opened as an issue
            </Link>{" "}
            under the <Code>enhancement</Code> label. The useful thing to write down is the case
            rather than the API: what the application was trying to do, what it does today instead,
            and what it costs to keep doing it that way. A case can be designed against, and it can
            be met by something better than what was asked for.
        </Text>
        <Text as="p">
            The issues are worth reading before one is opened. A proposal that has already been made
            is better added to than made again, since the two would otherwise be answered apart from
            each other.
        </Text>
    </Stack>
);

// Asking A Question, which is the one thing that does not belong on the issue tracker, since an
// answer closes it and leaves nothing behind that anyone would search for
export const AskingAQuestion: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Asking a question</Heading>
        <Text as="p">
            A question about how something is meant to be used is asked on{" "}
            <Link href="https://discord.gg/YsteKRjrSH">Discord</Link>. It is not an issue: an issue
            is a piece of work that is opened, done and closed, and a question that is answered
            leaves nothing behind for the tracker to hold.
        </Text>
        <Text as="p">
            A question that turns out to have no answer is a different matter. If a component cannot
            do the thing being asked of it, that is a proposal, and if it does the thing wrongly,
            that is a bug — either way it is worth opening once the question has settled which of
            the two it is.
        </Text>
    </Stack>
);

// Keeping Up, since what a reader of this page most often wants is not to take part but to know
// what changed and whether it affects them
export const KeepingUp: StoryFn = () => (
    <Stack gap="normal">
        <Heading size="medium">Keeping up</Heading>
        <Text as="p">
            The library is published to npm from a GitHub release, so a release is the record of
            what went out and when. Watching the repository is what brings one to notice as it
            happens rather than after it.
        </Text>
        <List>
            <List.Item>
                <Link href="https://github.com/donaldturinglee/base-ui/releases">Releases</Link> —
                what each published version carried
            </List.Item>
            <List.Item>
                <Link href="https://github.com/donaldturinglee/base-ui/commits/main">Commits</Link>{" "}
                — everything that has landed since
            </List.Item>
            <List.Item>
                <Link href="https://github.com/donaldturinglee/base-ui/graphs/contributors">
                    Contributors
                </Link>{" "}
                — who has worked on it
            </List.Item>
        </List>
        <Text as="p">
            The project is talked about away from the repository as well, on{" "}
            <Link href="https://www.linkedin.com/in/donaldturinglee/">LinkedIn</Link>,{" "}
            <Link href="https://x.com/donaldturinglee">X</Link> and{" "}
            <Link href="https://www.youtube.com/channel/UCOHOUOsJjGPBlov7FuwPDbA">YouTube</Link>,
            which is where the larger changes are gone over rather than only listed.
        </Text>
    </Stack>
);
