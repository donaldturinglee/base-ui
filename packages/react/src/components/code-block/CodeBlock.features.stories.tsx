import type { Decorator, StoryFn } from "@storybook/react-vite";
import { CopyRegular } from "@gamecrafters/base-ui-icons";
import { IconButton } from "../icon-button";
import { Stack } from "../stack";
import { CodeBlock } from ".";

const classes = {
    // A block fills its container, so the stories give it one to fill
    container: "max-w-[34rem]",
};

const source = `import { useState } from "react";

export function Counter({ start = 0 }: { start?: number }) {
    const [count, setCount] = useState(start);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`;

const json = `{
    "name": "@gamecrafters/base-ui",
    "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0"
    }
}`;

const css = `.code-block {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}`;

const shell = `npm install @gamecrafters/base-ui
npm run storybook`;

const longLine = `const themes = ["github-light", "github-dark", "min-light", "min-dark", "nord", "vitesse-light", "vitesse-dark"];`;

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/CodeBlock/Features",
    decorators: [withContainer],
};

// Without A Header, for a listing that needs nothing said about it
export const WithoutAHeader: StoryFn<typeof CodeBlock> = () => (
    <CodeBlock language="shellscript">
        <CodeBlock.Content>
            <CodeBlock.Code>{shell}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

// With An Action, where the title is set at the start of the header and everything else at
// the end, so a button beside a file name lays out without being told where to stand
export const WithAnAction: StoryFn<typeof CodeBlock> = () => (
    <CodeBlock language="tsx">
        <CodeBlock.Header>
            <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
            <IconButton
                icon={CopyRegular}
                variant="invisible"
                size="small"
                aria-label="Copy the listing"
            />
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{source}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

// Line Numbers, drawn beside the listing rather than written into it, so what a reader copies
// out is the listing and not the gutter
export const LineNumbers: StoryFn<typeof CodeBlock> = () => (
    <CodeBlock language="tsx" showLineNumbers>
        <CodeBlock.Header>
            <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{source}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

// Languages, where the grammar is named once on the block and a listing that is read under
// another one says so itself
export const Languages: StoryFn<typeof CodeBlock> = () => (
    <Stack gap="normal">
        <CodeBlock language="json">
            <CodeBlock.Header>
                <CodeBlock.Title>package.json</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{json}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <CodeBlock>
            <CodeBlock.Header>
                <CodeBlock.Title>code-block.css</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code language="css">{css}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Themes, where the two the runs are coloured under are read over the listing at once, so the
// scheme in force picks between them and nothing is read a second time when it changes
export const Themes: StoryFn<typeof CodeBlock> = () => (
    <CodeBlock language="tsx" lightTheme="vitesse-light" darkTheme="vitesse-dark">
        <CodeBlock.Header>
            <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{source}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

// Overflowing, where a listing keeps its lines as long as they were written and anything that
// will not fit is scrolled to. Only a listing that actually scrolls is reachable by the
// keyboard, so a reader is not stopped at one they could not have moved within
export const Overflowing: StoryFn<typeof CodeBlock> = () => (
    <CodeBlock language="ts">
        <CodeBlock.Header>
            <CodeBlock.Title>themes.ts</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{longLine}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

// Wrapping, where a line too long for the block runs on to the next one rather than being
// left to be scrolled to. What runs on is set in beside the gutter when the lines are
// numbered, so it reads as the line it ran on from and not as a line of its own
export const Wrapping: StoryFn<typeof CodeBlock> = () => (
    <Stack gap="normal">
        <CodeBlock language="ts" wrap="wrap">
            <CodeBlock.Header>
                <CodeBlock.Title>themes.ts</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{longLine}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
        <CodeBlock language="ts" wrap="wrap" showLineNumbers>
            <CodeBlock.Header>
                <CodeBlock.Title>themes.ts</CodeBlock.Title>
            </CodeBlock.Header>
            <CodeBlock.Content>
                <CodeBlock.Code>{longLine}</CodeBlock.Code>
            </CodeBlock.Content>
        </CodeBlock>
    </Stack>
);

// Plain Text, for a listing no grammar is read over. It is still set apart from the prose
// around it and still keeps its line breaks, but nothing in it is picked out
export const PlainText: StoryFn<typeof CodeBlock> = () => (
    <CodeBlock>
        <CodeBlock.Header>
            <CodeBlock.Title>CHANGELOG.txt</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{shell}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);
