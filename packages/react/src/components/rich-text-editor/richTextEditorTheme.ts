import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { EditorThemeClasses, Klass, LexicalNode } from "lexical";

// What a namespace is for is telling one editor's clipboard from another's, so that a copy taken
// out of one is pasted back into the other as text rather than as nodes it has never heard of
export const DEFAULT_RICH_TEXT_EDITOR_NAMESPACE = "RichTextEditor";

// The kinds of writing the editor knows how to hold. Lexical drops anything whose kind was not
// registered here, so this list is what settles which of the toolbar's buttons can do their work
export const RICH_TEXT_EDITOR_NODES: readonly Klass<LexicalNode>[] = [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
];

// Which class Lexical hangs on each kind of node as it draws it. The names are the stylesheet's
// own, so what is written in the editor is styled in the same place as the rest of the design
// system rather than by a theme of Lexical's
export const richTextEditorTheme: EditorThemeClasses = {
    paragraph: "rich-text-editor-paragraph",
    heading: {
        h1: "rich-text-editor-heading-1",
        h2: "rich-text-editor-heading-2",
        h3: "rich-text-editor-heading-3",
    },
    quote: "rich-text-editor-quote",
    link: "rich-text-editor-link",
    list: {
        ul: "rich-text-editor-list-bullet",
        ol: "rich-text-editor-list-number",
        listitem: "rich-text-editor-list-item",
        // A list inside a list is drawn without a marker of its own, since the item it hangs
        // under already carries one
        nested: {
            listitem: "rich-text-editor-list-item-nested",
        },
    },
    text: {
        bold: "rich-text-editor-bold",
        italic: "rich-text-editor-italic",
        underline: "rich-text-editor-underline",
        strikethrough: "rich-text-editor-strikethrough",
        // Both marks at once are drawn in one declaration, since a line through and a line
        // under are the same property
        underlineStrikethrough: "rich-text-editor-underline-strikethrough",
        code: "rich-text-editor-inline-code",
    },
    ltr: "rich-text-editor-ltr",
    rtl: "rich-text-editor-rtl",
};
