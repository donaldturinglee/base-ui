import { CodeHighlightNode, CodeNode } from "@lexical/code-core";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { CHECK_LIST, TRANSFORMERS } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import type { Transformer } from "@lexical/markdown";
import type { EditorThemeClasses, Klass, LexicalNode } from "lexical";

// What a namespace is for is telling one editor's clipboard from another's. Nothing is written
// here, so the name only has to be one of its own
export const DEFAULT_MARKDOWN_NAMESPACE = "Markdown";

// The kinds of writing the markdown above can be read into. Anything whose kind is not
// registered here is dropped as the markdown is read, so this list is what settles which of the
// syntax below is understood
export const MARKDOWN_NODES: readonly Klass<LexicalNode>[] = [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    CodeNode,
    CodeHighlightNode,
];

// The syntax that is read, in the order it is looked for. A task list is read before an ordinary
// bulleted one, since "- [ ] " is a bullet with something more said about it and the plain
// bullet would otherwise take the line first
export const MARKDOWN_TRANSFORMERS: Transformer[] = [CHECK_LIST, ...TRANSFORMERS];

// Which class is hung on each kind of writing as it is drawn. The names are the stylesheet's
// own, so markdown is styled in the same place as the rest of the design system
export const markdownTheme: EditorThemeClasses = {
    paragraph: "markdown-paragraph",
    heading: {
        h1: "markdown-heading-1",
        h2: "markdown-heading-2",
        h3: "markdown-heading-3",
        h4: "markdown-heading-4",
        h5: "markdown-heading-5",
        h6: "markdown-heading-6",
    },
    quote: "markdown-quote",
    link: "markdown-link",
    code: "markdown-code-block",
    list: {
        ul: "markdown-list-bullet",
        ol: "markdown-list-number",
        listitem: "markdown-list-item",
        checklist: "markdown-list-check",
        listitemChecked: "markdown-list-item-checked",
        listitemUnchecked: "markdown-list-item-unchecked",
        // A list hanging under an item is drawn without a marker of its own, since the item it
        // hangs under already carries one
        nested: {
            listitem: "markdown-list-item-nested",
        },
    },
    text: {
        bold: "markdown-bold",
        italic: "markdown-italic",
        strikethrough: "markdown-strikethrough",
        highlight: "markdown-highlight",
        code: "markdown-code-inline",
    },
    ltr: "markdown-ltr",
    rtl: "markdown-rtl",
};
