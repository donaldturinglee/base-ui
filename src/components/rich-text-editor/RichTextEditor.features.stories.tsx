import * as React from "react";
import type { StoryFn } from "@storybook/react-vite";
import { MentionRegular } from "@gamecrafters/base-ui-icons";
import { $createListItemNode, $createListNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import {
    $createParagraphNode,
    $createTextNode,
    $getRoot,
    $getSelection,
    $isRangeSelection,
} from "lexical";
import { IconButton } from "../icon-button";
import { Stack } from "../stack";
import { Text } from "../text";
import { RichTextEditor } from ".";
import type { EditorState } from "lexical";

const classes = {
    box: "w-[var(--overlay-width-medium)]",
    // A caption sits under the field it describes, the way a form control's does
    caption: "flex flex-col gap-[var(--base-size-4)]",
};

// A page of writing to open an editor on, laid in the way Lexical lays writing in: a run of
// nodes appended to the root rather than a string of markup to be read back out
const seedArticle = () => {
    const root = $getRoot();

    const heading = $createHeadingNode("h2");
    heading.append($createTextNode("Release notes"));

    const paragraph = $createParagraphNode();
    const lead = $createTextNode("This release is mostly housekeeping. ");
    const emphasis = $createTextNode("Nothing here changes an API.");
    emphasis.toggleFormat("bold");
    paragraph.append(lead, emphasis);

    const list = $createListNode("bullet");
    for (const item of ["Faster first paint", "Fewer bytes shipped", "A quieter console"]) {
        const listItem = $createListItemNode();
        listItem.append($createTextNode(item));
        list.append(listItem);
    }

    const quote = $createQuoteNode();
    quote.append($createTextNode("The best release is the one nobody notices."));

    root.append(heading, paragraph, list, quote);
};

export default {
    title: "Components/RichTextEditor/Features",
    parameters: {
        layout: "centered",
    },
};

// With Writing Already In It, laid in once when the editor is built
export const WithInitialContent: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <RichTextEditor aria-label="Release notes" defaultValue={seedArticle} minHeight={220}>
            <RichTextEditor.Toolbar />
            <RichTextEditor.Content />
        </RichTextEditor>
    </div>
);

// A Reading, where what was written is left to be read and copied but not changed. The toolbar
// is kept so that its controls can be seen to be out of use, though an editor that will never
// be written in is better off without one
export const ReadOnly: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <RichTextEditor readOnly aria-label="Release notes" defaultValue={seedArticle}>
            <RichTextEditor.Toolbar />
            <RichTextEditor.Content />
        </RichTextEditor>
    </div>
);

// Only Some Of The Controls, for a field where a heading or a quote would be more than the
// writing calls for
export const LimitedControls: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <RichTextEditor aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
            <RichTextEditor.Toolbar controls={["inline", "list", "link"]} />
            <RichTextEditor.Content />
        </RichTextEditor>
    </div>
);

// The Toolbar Underneath, which is what the parts being named by the caller is for
export const ToolbarBelow: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <RichTextEditor aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
            <RichTextEditor.Content />
            <RichTextEditor.Toolbar controls={["inline", "link"]} />
        </RichTextEditor>
    </div>
);

// Held To A Height, where what is written past it is scrolled through rather than pushing the
// page down
export const WithAHeight: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <RichTextEditor
            aria-label="Release notes"
            defaultValue={seedArticle}
            minHeight={120}
            maxHeight={200}
        >
            <RichTextEditor.Toolbar />
            <RichTextEditor.Content />
        </RichTextEditor>
    </div>
);

// With A Caption, which the writing area is described by
export const WithACaption: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <Stack gap="condensed">
            <div className={classes.caption}>
                <Text id="notes-label" weight="semibold">
                    Release notes
                </Text>
                <Text id="notes-caption" size="small">
                    Markdown is not read here; use the toolbar above the field
                </Text>
            </div>
            <RichTextEditor
                aria-labelledby="notes-label"
                aria-describedby="notes-caption"
                placeholder="Write the notes"
                minHeight={140}
            >
                <RichTextEditor.Toolbar />
                <RichTextEditor.Content />
            </RichTextEditor>
        </Stack>
    </div>
);

// Reading What Has Been Written, which is reported as the state the editor moved to rather than
// as markup. What is made of it — stored as JSON, counted, sent somewhere — is the caller's
export const ReadingTheContent: StoryFn<typeof RichTextEditor> = () => {
    const [words, setWords] = React.useState(0);

    const countWords = (editorState: EditorState) => {
        editorState.read(() => {
            const written = $getRoot().getTextContent().trim();

            setWords(written === "" ? 0 : written.split(/\s+/).length);
        });
    };

    return (
        <div className={classes.box}>
            <Stack gap="condensed">
                <RichTextEditor
                    aria-label="Description"
                    placeholder="Write a description"
                    minHeight={140}
                    onChange={countWords}
                >
                    <RichTextEditor.Toolbar controls={["inline", "list"]} />
                    <RichTextEditor.Content />
                </RichTextEditor>
                <Text size="small">
                    {words} {words === 1 ? "word" : "words"}
                </Text>
            </Stack>
        </div>
    );
};

// A control of the caller's own. It reaches the editor the same way the toolbar's own controls
// do, through the context Lexical puts it in, so nothing has to be threaded down to it
const MentionButton = () => {
    const [editor] = useLexicalComposerContext();

    return (
        <IconButton
            icon={MentionRegular}
            size="small"
            variant="invisible"
            aria-label="Mention someone"
            onClick={() =>
                editor.update(() => {
                    const selection = $getSelection();

                    if ($isRangeSelection(selection)) {
                        selection.insertText("@");
                    }
                })
            }
        />
    );
};

// Controls Of The Caller's Own, drawn after the ones the toolbar comes with
export const WithCustomControls: StoryFn<typeof RichTextEditor> = () => (
    <div className={classes.box}>
        <RichTextEditor aria-label="Comment" placeholder="Leave a comment" minHeight={120}>
            <RichTextEditor.Toolbar controls={["inline"]}>
                <MentionButton />
            </RichTextEditor.Toolbar>
            <RichTextEditor.Content />
        </RichTextEditor>
    </div>
);
