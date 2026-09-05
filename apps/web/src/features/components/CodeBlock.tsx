import {
    Clipboard,
    CodeBlock as CodeBlockComponent,
    Heading,
    Stack,
    Text,
} from "@gamecrafters/base-ui/react";
import ComponentExamples from "./ComponentExamples";
import ComponentProps from "./ComponentProps";
import type { ComponentExample } from "./ComponentExamples.types";
import type { ComponentPropGroup } from "./ComponentProps.types";

const classes = {
    // The prose is read, the tables below it are looked through, so only the prose is held to a
    // measure
    prose: "max-w-[46rem]",
    // A block fills whatever it was put in, and across the whole of the card its lines would run
    // further than they are meant to be read. It is given a width to be read at instead
    preview: "max-w-[34rem]",
};

// What the examples are a listing of. It is a component small enough to be taken in at a glance and
// long enough to have something in it for a grammar to find, and it is written once and read out
// into each of them, since what the examples are about is the block rather than the code inside it.
//
// React is reached for on the namespace it was imported under, as the rest of the library does it,
// so the hook it calls is already in hand rather than being read as one more thing to import
const source = `import * as React from "react";

export function Counter({ start = 0 }: { start?: number }) {
    const [count, setCount] = React.useState(start);

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

const longLine = `const themes = ["github-light", "github-dark", "min-light", "min-dark", "nord", "vitesse-light"];`;

// What the examples have to have in hand before they can be drawn. The listing is one string, so
// each is written out as the literal it was declared as, and a reader copying an example out is
// handed the thing the block is given rather than a name with nothing behind it
const sourceSetup = `const source = \`import * as React from "react";

export function Counter({ start = 0 }: { start?: number }) {
    const [count, setCount] = React.useState(start);

    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}\`;`;

const jsonSetup = `const json = \`{
    "name": "@gamecrafters/base-ui",
    "peerDependencies": {
        "react": "^18.0.0 || ^19.0.0"
    }
}\`;`;

const cssSetup = `const css = \`.code-block {
    display: flex;
    flex-direction: column;
    overflow: hidden;
}\`;`;

const shellSetup = `const shell = \`npm install @gamecrafters/base-ui
npm run storybook\`;`;

const longLineSetup = `const longLine = \`${longLine}\`;`;

// The plainest block there is: a strip saying what the listing is, and the listing under it. The
// grammar is named on the block rather than on the listing, so a block holding more than one only
// has to say it once.
//
// The width it is held to is the page's own furniture, as the card around it is, so the listing
// beneath is of the block alone: standing in an application, it fills whatever it was put in.
//
// The page and the component it is about are both called CodeBlock, so the component is brought in
// under a name saying which of the two it is. The listing beneath says CodeBlock, as an application
// importing it would
const defaultPreview = (
    <CodeBlockComponent language="tsx" className={classes.preview}>
        <CodeBlockComponent.Header>
            <CodeBlockComponent.Title>Counter.tsx</CodeBlockComponent.Title>
        </CodeBlockComponent.Header>
        <CodeBlockComponent.Content>
            <CodeBlockComponent.Code>{source}</CodeBlockComponent.Code>
        </CodeBlockComponent.Content>
    </CodeBlockComponent>
);

// The same example as it is written, which is what a reader takes away with them. Nothing on the
// page runs what it is showing, so the two are kept in step by hand
const defaultCode = `<CodeBlock language="tsx">
    <CodeBlock.Header>
        <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
    </CodeBlock.Header>
    <CodeBlock.Content>
        <CodeBlock.Code>{source}</CodeBlock.Code>
    </CodeBlock.Content>
</CodeBlock>`;

// A block with nothing said above the listing, for one there is nothing to say about. The strip is
// left out rather than emptied, so the listing meets the frame with no rule left hanging over it
const withoutHeaderPreview = (
    <CodeBlockComponent language="shellscript" className={classes.preview}>
        <CodeBlockComponent.Content>
            <CodeBlockComponent.Code>{shell}</CodeBlockComponent.Code>
        </CodeBlockComponent.Content>
    </CodeBlockComponent>
);

const withoutHeaderCode = `<CodeBlock language="shellscript">
    <CodeBlock.Content>
        <CodeBlock.Code>{shell}</CodeBlock.Code>
    </CodeBlock.Content>
</CodeBlock>`;

// Something done to the listing, standing in the strip beside what the listing is called. The title
// is set at the start and everything else at the end, so the two lay out without being told where
// to stand.
//
// What copies is handed the listing itself rather than reading it back off the page, so what is
// taken is what was passed in: the runs the grammar found are drawn one to a span, and a reader
// copying from the page would be handed those instead
const withActionPreview = (
    <CodeBlockComponent language="tsx" className={classes.preview}>
        <CodeBlockComponent.Header>
            <CodeBlockComponent.Title>Counter.tsx</CodeBlockComponent.Title>
            <Clipboard value={source}>
                <Clipboard.Trigger variant="invisible" size="small" label="Copy the listing" />
            </Clipboard>
        </CodeBlockComponent.Header>
        <CodeBlockComponent.Content>
            <CodeBlockComponent.Code>{source}</CodeBlockComponent.Code>
        </CodeBlockComponent.Content>
    </CodeBlockComponent>
);

const withActionCode = `<CodeBlock language="tsx">
    <CodeBlock.Header>
        <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
        <Clipboard value={source}>
            <Clipboard.Trigger variant="invisible" size="small" label="Copy the listing" />
        </Clipboard>
    </CodeBlock.Header>
    <CodeBlock.Content>
        <CodeBlock.Code>{source}</CodeBlock.Code>
    </CodeBlock.Content>
</CodeBlock>`;

// The lines numbered down the side of the listing. The numbers are drawn rather than written into
// the listing, so what a reader copies out is the code and not the gutter beside it
const lineNumbersPreview = (
    <CodeBlockComponent language="tsx" showLineNumbers className={classes.preview}>
        <CodeBlockComponent.Header>
            <CodeBlockComponent.Title>Counter.tsx</CodeBlockComponent.Title>
        </CodeBlockComponent.Header>
        <CodeBlockComponent.Content>
            <CodeBlockComponent.Code>{source}</CodeBlockComponent.Code>
        </CodeBlockComponent.Content>
    </CodeBlockComponent>
);

const lineNumbersCode = `<CodeBlock language="tsx" showLineNumbers>
    <CodeBlock.Header>
        <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
    </CodeBlock.Header>
    <CodeBlock.Content>
        <CodeBlock.Code>{source}</CodeBlock.Code>
    </CodeBlock.Content>
</CodeBlock>`;

// Where the grammar is named. The block names the one every listing in it is read under, and a
// listing read under another says so itself, which is what a block holding a file and a fragment of
// something else comes to.
//
// The two are drawn together rather than one to an example, since what is being shown is the choice
// between saying it once above and saying it on the listing, and apart they are two blocks
const languagesPreview = (
    <Stack gap="normal" className={classes.preview}>
        <CodeBlockComponent language="json">
            <CodeBlockComponent.Header>
                <CodeBlockComponent.Title>package.json</CodeBlockComponent.Title>
            </CodeBlockComponent.Header>
            <CodeBlockComponent.Content>
                <CodeBlockComponent.Code>{json}</CodeBlockComponent.Code>
            </CodeBlockComponent.Content>
        </CodeBlockComponent>
        <CodeBlockComponent>
            <CodeBlockComponent.Header>
                <CodeBlockComponent.Title>code-block.css</CodeBlockComponent.Title>
            </CodeBlockComponent.Header>
            <CodeBlockComponent.Content>
                <CodeBlockComponent.Code language="css">{css}</CodeBlockComponent.Code>
            </CodeBlockComponent.Content>
        </CodeBlockComponent>
    </Stack>
);

const languagesSetup = `${jsonSetup}

${cssSetup}`;

const languagesCode = `<Stack gap="normal">
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
</Stack>`;

// The two themes the runs take their colour from. Both are read over the listing at once and every
// run carries the colour each of them gave it, so the scheme in force picks between them and
// nothing is read a second time when the reader changes it
const themesPreview = (
    <CodeBlockComponent
        language="tsx"
        lightTheme="vitesse-light"
        darkTheme="vitesse-dark"
        className={classes.preview}
    >
        <CodeBlockComponent.Header>
            <CodeBlockComponent.Title>Counter.tsx</CodeBlockComponent.Title>
        </CodeBlockComponent.Header>
        <CodeBlockComponent.Content>
            <CodeBlockComponent.Code>{source}</CodeBlockComponent.Code>
        </CodeBlockComponent.Content>
    </CodeBlockComponent>
);

const themesCode = `<CodeBlock language="tsx" lightTheme="vitesse-light" darkTheme="vitesse-dark">
    <CodeBlock.Header>
        <CodeBlock.Title>Counter.tsx</CodeBlock.Title>
    </CodeBlock.Header>
    <CodeBlock.Content>
        <CodeBlock.Code>{source}</CodeBlock.Code>
    </CodeBlock.Content>
</CodeBlock>`;

// What becomes of a line too long for the block. It keeps the length it was written at and is left
// to be scrolled to, or it runs on to the next line instead.
//
// The two are drawn together because neither says anything on its own: what is being shown is the
// same line under both, and only the pair says which of the two a block was given
const wrapPreview = (
    <Stack gap="normal" className={classes.preview}>
        <CodeBlockComponent language="ts">
            <CodeBlockComponent.Header>
                <CodeBlockComponent.Title>Scrolled to</CodeBlockComponent.Title>
            </CodeBlockComponent.Header>
            <CodeBlockComponent.Content>
                <CodeBlockComponent.Code>{longLine}</CodeBlockComponent.Code>
            </CodeBlockComponent.Content>
        </CodeBlockComponent>
        <CodeBlockComponent language="ts" wrap="wrap">
            <CodeBlockComponent.Header>
                <CodeBlockComponent.Title>Run on</CodeBlockComponent.Title>
            </CodeBlockComponent.Header>
            <CodeBlockComponent.Content>
                <CodeBlockComponent.Code>{longLine}</CodeBlockComponent.Code>
            </CodeBlockComponent.Content>
        </CodeBlockComponent>
    </Stack>
);

const wrapCode = `<Stack gap="normal">
    <CodeBlock language="ts">
        <CodeBlock.Header>
            <CodeBlock.Title>Scrolled to</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{longLine}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
    <CodeBlock language="ts" wrap="wrap">
        <CodeBlock.Header>
            <CodeBlock.Title>Run on</CodeBlock.Title>
        </CodeBlock.Header>
        <CodeBlock.Content>
            <CodeBlock.Code>{longLine}</CodeBlock.Code>
        </CodeBlock.Content>
    </CodeBlock>
</Stack>`;

// A listing no grammar is read over, which is what a block is given where the caller names none. It
// is still set apart from the prose around it and still keeps its line breaks, and nothing in it is
// picked out
const plainPreview = (
    <CodeBlockComponent className={classes.preview}>
        <CodeBlockComponent.Header>
            <CodeBlockComponent.Title>CHANGELOG.txt</CodeBlockComponent.Title>
        </CodeBlockComponent.Header>
        <CodeBlockComponent.Content>
            <CodeBlockComponent.Code>{shell}</CodeBlockComponent.Code>
        </CodeBlockComponent.Content>
    </CodeBlockComponent>
);

const plainCode = `<CodeBlock>
    <CodeBlock.Header>
        <CodeBlock.Title>CHANGELOG.txt</CodeBlock.Title>
    </CodeBlock.Header>
    <CodeBlock.Content>
        <CodeBlock.Code>{shell}</CodeBlock.Code>
    </CodeBlock.Content>
</CodeBlock>`;

// The block as it is reached for, drawn and written out one above the other. The plainest one comes
// first, and whatever has to be said with a prop follows it
const examples: ComponentExample[] = [
    {
        name: "Default",
        setup: sourceSetup,
        preview: defaultPreview,
        code: defaultCode,
    },
    {
        name: "Without a header",
        description:
            "A block with nothing said above the listing, for one there is nothing to say about. The strip is left out rather than emptied, so the listing meets the frame with no rule left hanging over it.",
        setup: shellSetup,
        preview: withoutHeaderPreview,
        code: withoutHeaderCode,
    },
    {
        name: "With an action",
        description:
            "Something done to the listing, standing in the strip beside what the listing is called. The title is set at the start of the header and everything else at the end, so the two lay out without being told where to stand. What copies is handed the listing itself rather than reading it back off the page, so what is taken is what was passed in.",
        setup: sourceSetup,
        preview: withActionPreview,
        code: withActionCode,
    },
    {
        name: "Line numbers",
        description:
            "The lines numbered down the side of the listing. They are drawn beside it rather than written into it, so what a reader copies out is the code and not the gutter.",
        setup: sourceSetup,
        preview: lineNumbersPreview,
        code: lineNumbersCode,
    },
    {
        name: "Where the grammar is named",
        description:
            "The block names the grammar every listing in it is read under, so a block holding more than one listing only has to say it once. A listing read under another grammar says so itself, which is what a block holding a file and a fragment of something else comes to. A grammar is fetched by name as it is asked for, so only the ones a page actually reads are ever loaded.",
        setup: languagesSetup,
        preview: languagesPreview,
        code: languagesCode,
    },
    {
        name: "Themes",
        description:
            "The two themes the runs take their colour from, one to each scheme. Both are read over the listing at once and every run carries the colour each of them gave it, so the scheme in force picks between them and nothing is read a second time when the reader changes it. Only the runs take their colour from the theme: the frame and the ground are the design system's own, so a block sits with the rest of the page rather than opening a window of its own onto it.",
        setup: sourceSetup,
        preview: themesPreview,
        code: themesCode,
    },
    {
        name: "A line too long for the block",
        description:
            "What becomes of a line longer than there is room for. It keeps the length it was written at and is left to be scrolled to, which is what a listing is given unless it is told otherwise, or it runs on to the next line instead. Only a listing that actually scrolls is reachable by the keyboard, so a reader is not stopped at one they could not have moved within.",
        setup: longLineSetup,
        preview: wrapPreview,
        code: wrapCode,
    },
    {
        name: "Plain text",
        description:
            "A listing no grammar is read over, which is what a block is given where the caller names none. It is still set apart from the prose around it and still keeps its line breaks and its indentation, and nothing in it is picked out. A name or a command read inside a line of prose is the Code component instead.",
        setup: shellSetup,
        preview: plainPreview,
        code: plainCode,
    },
];

// What every part takes to be styled from outside. It is the same prop saying the same thing
// wherever it stands, so it is named once rather than written out under each of them
const styling = {
    name: "className",
    type: "string",
    description: "Class name for custom styling",
};

// What the element being drawn takes on top of what the library declares itself. Those props are
// the element's own and are documented wherever elements are, so what is said here is what the
// library adds to them
const polymorphic = (element: string) => ({
    name: "as",
    type: "React.ElementType",
    default: `"${element}"`,
    description: "The element or component this is drawn as, in place of its default",
});

// Every prop the block and its parts take, under the part that takes it.
//
// The block comes first, since the grammar, the themes and everything about how the lines are laid
// out are settled there and every listing in it reads them; the strip above the listing and what it
// is called follow; and the listing itself comes last, with the two props that are its own
const groups: ComponentPropGroup[] = [
    {
        name: "CodeBlock",
        props: [
            {
                name: "language",
                type: "CodeBlockLanguage",
                default: '"text"',
                description:
                    "The grammar every listing in the block is read under, named as shiki names it. It is fetched by name as it is asked for, so only the grammars a page actually reads are loaded, and text stands for no grammar at all and costs nothing to read under",
            },
            {
                name: "lightTheme",
                type: "CodeBlockTheme",
                default: '"github-light"',
                description:
                    "The theme the runs take their colour from under the light scheme. Only the runs are coloured by it: the frame around them and the ground they sit on are the design system's own",
            },
            {
                name: "darkTheme",
                type: "CodeBlockTheme",
                default: '"github-dark"',
                description:
                    "The theme the runs take their colour from under the dark scheme. Both themes are read over the listing at once, so the scheme in force picks between them and nothing is read a second time when it changes",
            },
            {
                name: "showLineNumbers",
                type: "boolean",
                default: "false",
                description:
                    "Numbers the lines of every listing in the block. The numbers are drawn beside the listing rather than written into it, so what a reader copies out is the code and not the gutter",
            },
            {
                name: "wrap",
                type: '"wrap" | "nowrap"',
                default: '"nowrap"',
                options: ["wrap", "nowrap"],
                description:
                    "What becomes of a line too long for the block: it runs on to the next line, or it keeps the length it was written at and is left to be scrolled to",
            },
            styling,
            polymorphic("div"),
        ],
    },
    {
        name: "CodeBlock.Header",
        props: [styling, polymorphic("div")],
    },
    {
        name: "CodeBlock.Title",
        props: [styling, polymorphic("span")],
    },
    {
        name: "CodeBlock.Content",
        props: [styling, polymorphic("div")],
    },
    {
        name: "CodeBlock.Code",
        props: [
            {
                name: "children",
                type: "string",
                description:
                    "The listing itself, as one string. Its line breaks and its indentation are kept as they were written, so what is drawn is what was passed. It is a string rather than anything drawn, since the grammar is read over the text and there would be nothing to read over an element",
            },
            {
                name: "language",
                type: "CodeBlockLanguage",
                description:
                    "The grammar this one listing is read under, in place of the block's own. It is for a block holding a listing that is not what the rest of it is; a block whose listings are all read the same way names the grammar once, above them",
            },
            styling,
        ],
    },
];

// The page stands on its own rather than being handed a name and answering for whichever component
// was asked for, so what the block is is said on the page itself, beside the examples it is reached
// for in and the props it takes.
//
// The examples come before the tables, since a reader arrives wanting to use the component and only
// then wanting to know everything it will take
const CodeBlock = () => (
    <Stack gap="spacious" paddingBlock="spacious">
        <Stack gap="normal" className={classes.prose}>
            <Heading as="h1" size="large">
                CodeBlock
            </Heading>
            <Text as="p" size="large">
                A listing set apart from the prose around it, with its line breaks and its
                indentation kept as they were written and a grammar read over it. The listing is
                drawn as it was written first and the coloured runs take its place once the grammar
                has arrived, so nothing moves and what a reader copies out is the listing as it was
                passed in. A name or a command read inside a line of prose is the Code component
                instead.
            </Text>
        </Stack>
        <ComponentExamples component="CodeBlock" examples={examples} />
        <ComponentProps groups={groups} />
    </Stack>
);

export default CodeBlock;
