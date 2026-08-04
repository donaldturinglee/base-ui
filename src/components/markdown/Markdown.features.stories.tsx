import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { CodeHighlightNode, CodeNode } from "@lexical/code-core";
import {
    $convertFromMarkdownString,
    $convertToMarkdownString,
    ELEMENT_TRANSFORMERS,
    TEXT_FORMAT_TRANSFORMERS,
} from "@lexical/markdown";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextEditor } from "../rich-text-editor";
import { Stack } from "../stack";
import { Text } from "../text";
import { Markdown, MARKDOWN_TRANSFORMERS } from ".";
import type { EditorState } from "lexical";

const classes = {
    box: "w-[var(--overlay-width-medium)]",
    // The writing and what it is read as, laid side by side so the one can be seen following
    // the other
    split: "grid grid-cols-2 gap-[var(--base-size-16)] w-[var(--overlay-width-large)]",
    pane: "flex flex-col gap-[var(--base-size-8)]",
};

// The kinds of writing a markdown listing needs beyond the ones a rich text editor already
// holds. They are added rather than replacing the editor's own
const CODE_NODES = [CodeNode, CodeHighlightNode];

export default {
    title: "Components/Markdown/Features",
    parameters: {
        layout: "centered",
    },
};

// Headings, at each of the six levels markdown has. The smallest has run out of sizes to be
// larger than the prose by, so it is set apart by its colour instead
export const Headings: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Markdown>
            {
                "# Level one\n\n## Level two\n\n### Level three\n\n#### Level four\n\n##### Level five\n\n###### Level six"
            }
        </Markdown>
    </div>
);

// The Marks Laid Over A Run Of Words
export const TextFormatting: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Markdown>
            {
                "Words can be **bold**, *italic*, ~~struck through~~, ==picked out== or written as `code`."
            }
        </Markdown>
    </div>
);

// Lists, of which markdown has three: bulleted, numbered, and the task list where each item
// says whether it is done
export const Lists: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Markdown>
            {
                "- Faster first paint\n- Fewer bytes shipped\n\n1. Read it\n2. Write it\n3. Read it again\n\n- [x] Shipped\n- [ ] Written up"
            }
        </Markdown>
    </div>
);

// A Quote, marked by a rule down its side rather than by quotation marks, which are the
// writer's to put in
export const Quote: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Markdown>{"> The best release is the one nobody notices.\n\nSaid elsewhere."}</Markdown>
    </div>
);

// A Fenced Listing, drawn plainly as the preformatted run it is. A listing that is to be read
// under a grammar, with its runs coloured, is the CodeBlock component instead
export const CodeBlocks: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Markdown>
            {
                "Call it like this:\n\n```\nconst editor = createEditor();\neditor.update(() => {});\n```"
            }
        </Markdown>
    </div>
);

// Keeping Every Line Break, for writing where the lines were laid out as they were meant to be
// read rather than as a paragraph to be joined back up
export const PreserveNewLines: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Stack gap="normal">
            <div className={classes.pane}>
                <Text size="small" weight="semibold">
                    Joined, the way markdown reads it
                </Text>
                <Markdown>{"Roses are red\nViolets are blue"}</Markdown>
            </div>
            <div className={classes.pane}>
                <Text size="small" weight="semibold">
                    Kept as written
                </Text>
                <Markdown preserveNewLines>{"Roses are red\nViolets are blue"}</Markdown>
            </div>
        </Stack>
    </div>
);

// Only Some Of The Syntax, for a field where a heading or a listing would be more than the
// writing calls for. What is left out is read as the words it was written with
export const LimitedSyntax: StoryFn<typeof Markdown> = () => (
    <div className={classes.box}>
        <Markdown transformers={[...ELEMENT_TRANSFORMERS, ...TEXT_FORMAT_TRANSFORMERS]}>
            {"## Headings and marks are read\n\nBut a [link](https://example.com) is not."}
        </Markdown>
    </div>
);

// Writing It, where the pair are put to work together: the editor is opened on markdown, reads
// the shortcuts as they are typed, and hands back markdown for this component to draw. Neither
// component knows about the other — what joins them is the string between them
export const WritingMarkdown: StoryFn<typeof Markdown> = () => {
    const [source, setSource] = React.useState(
        "## Try me\n\nType `## ` or `- ` at the start of a line, or wrap words in **stars**.",
    );

    const readMarkdown = (editorState: EditorState) => {
        editorState.read(() => {
            setSource($convertToMarkdownString(MARKDOWN_TRANSFORMERS));
        });
    };

    return (
        <div className={classes.split}>
            <div className={classes.pane}>
                <Text size="small" weight="semibold">
                    Written
                </Text>
                <RichTextEditor
                    aria-label="Release notes"
                    minHeight={220}
                    nodes={CODE_NODES}
                    defaultValue={() => $convertFromMarkdownString(source, MARKDOWN_TRANSFORMERS)}
                    onChange={readMarkdown}
                >
                    <RichTextEditor.Toolbar controls={["inline", "block", "list", "link"]} />
                    <RichTextEditor.Content />
                    <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
                </RichTextEditor>
            </div>
            <div className={classes.pane}>
                <Text size="small" weight="semibold">
                    Read
                </Text>
                <Markdown>{source}</Markdown>
            </div>
        </div>
    );
};
