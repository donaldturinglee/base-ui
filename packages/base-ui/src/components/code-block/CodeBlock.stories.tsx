import type { Decorator, StoryFn, Meta } from "@storybook/react-vite";
import { CodeBlock } from ".";
import type { CodeBlockLanguage, CodeBlockTheme, CodeBlockWrap } from "./CodeBlock.types";

const classes = {
    // A block fills its container, so the stories give it one to fill
    container: "max-w-[34rem]",
};

const source = `import { useState } from "react";

export function Counter({ start = 0 }: { start?: number }) {
    const [count, setCount] = useState(start);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}`;

const withContainer: Decorator = (Story) => (
    <div className={classes.container}>
        <Story />
    </div>
);

export default {
    title: "Components/CodeBlock",
    component: CodeBlock,
    decorators: [withContainer],
} as Meta<typeof CodeBlock>;

export const Default: StoryFn<typeof CodeBlock> = () => (
    <CodeBlock language="tsx">
        <CodeBlock.Header>
            <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{source}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

type PlaygroundArgs = {
    language?: CodeBlockLanguage;
    lightTheme?: CodeBlockTheme;
    darkTheme?: CodeBlockTheme;
    showLineNumbers?: boolean;
    wrap?: CodeBlockWrap;
};

export const Playground: StoryFn<PlaygroundArgs> = ({
    language,
    lightTheme,
    darkTheme,
    showLineNumbers,
    wrap,
}) => (
    <CodeBlock
        language={language}
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        showLineNumbers={showLineNumbers}
        wrap={wrap}
    >
        <CodeBlock.Header>
            <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{source}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
);

Playground.args = {
    language: "tsx",
    lightTheme: "github-light",
    darkTheme: "github-dark",
    showLineNumbers: false,
    wrap: "nowrap",
};

Playground.argTypes = {
    language: {
        control: {
            type: "select",
        },
        options: ["tsx", "ts", "json", "css", "shellscript", "text"],
        description: "The grammar every listing in the block is read under",
    },
    lightTheme: {
        control: {
            type: "select",
        },
        options: ["github-light", "min-light", "vitesse-light"],
        description: "The theme the runs take their colour from under the light scheme",
    },
    darkTheme: {
        control: {
            type: "select",
        },
        options: ["github-dark", "min-dark", "vitesse-dark"],
        description: "The theme the runs take their colour from under the dark scheme",
    },
    showLineNumbers: {
        control: {
            type: "boolean",
        },
        description: "Numbers the lines of every listing in the block",
    },
    wrap: {
        control: {
            type: "radio",
        },
        options: ["wrap", "nowrap"],
        description: "Whether a line too long for the block runs on to the next one",
    },
};
