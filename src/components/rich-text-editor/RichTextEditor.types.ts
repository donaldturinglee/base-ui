import type * as React from "react";
import type { InitialEditorStateType } from "@lexical/react/LexicalComposer";
import type {
    EditorState,
    Klass,
    LexicalEditor,
    LexicalNode,
    LexicalNodeReplacement,
} from "lexical";

// Which run of controls the toolbar draws, with a divider between one run and the next
export type RichTextEditorControl = "history" | "inline" | "block" | "list" | "link";

// What the writing the cursor sits in is, which is what the block and list buttons are read
// against so that each says whether it is the one in force
export type RichTextEditorBlockType =
    "paragraph" | "h1" | "h2" | "h3" | "quote" | "bullet" | "number";

// The marks a run of text can carry, which the inline buttons turn on and off
export type RichTextEditorTextFormat = "bold" | "italic" | "underline" | "strikethrough" | "code";

export type RichTextEditorProps = Omit<React.ComponentPropsWithoutRef<"div">, "onChange"> & {
    // What the editor holds to begin with, as the JSON an editor state was written out as, as a
    // state itself, or as a function that lays the writing in. Lexical reads it once, when the
    // editor is built, so the editor is not one whose contents the caller holds: an editor told
    // what to hold on every render would lose the cursor on every keystroke
    defaultValue?: InitialEditorStateType;
    // Called with the state the editor has moved to, and with the editor it moved in
    onChange?: (editorState: EditorState, editor: LexicalEditor) => void;
    // What is shown in the editor's place while nothing has been written in it
    placeholder?: string;
    // Leaves what is written to be read and copied but not changed. This is the one state
    // Lexical keeps, so there is no second, greyed-out one beside it
    readOnly?: boolean;
    // Kinds of writing beyond the ones the editor already knows, for a caller who has nodes and
    // plugins of their own to add
    nodes?: readonly (Klass<LexicalNode> | LexicalNodeReplacement)[];
    // Tells one editor's clipboard from another's. Only worth setting where two editors on a
    // page are meant to pass nodes between them
    namespace?: string;
    // Called where Lexical could not carry out an update. The editor throws by default, since
    // an editor that has quietly stopped working is worse than one that says so
    onError?: (error: Error, editor: LexicalEditor) => void;
    // How tall the writing area stands before it has been written in, and how tall it is let
    // grow before what is written is scrolled through instead
    minHeight?: number;
    maxHeight?: number;
    className?: string;
};

export type RichTextEditorToolbarProps = React.ComponentPropsWithoutRef<"div"> & {
    // Which runs of controls are drawn, in the order they are named
    controls?: readonly RichTextEditorControl[];
    // Controls of the caller's own, drawn after the ones the toolbar comes with
    children?: React.ReactNode;
    // What a screen reader hears the toolbar called
    "aria-label"?: string;
    className?: string;
};

// What is written belongs to the editor, so there is nothing for a caller to put inside the
// writing area. The placeholder is named on the editor rather than here, since the words shown
// in its place and the words heard in their place have to be the same ones
export type RichTextEditorContentProps = Omit<
    React.ComponentPropsWithoutRef<"div">,
    "children" | "placeholder" | "aria-placeholder"
> & {
    className?: string;
};

// What the editor answers for the parts drawn inside it, so that neither the toolbar nor the
// writing area has to be told again what the editor was already told
export type RichTextEditorContextValue = {
    readOnly?: boolean;
    placeholder?: string;
    minHeight?: number;
    maxHeight?: number;
    ariaLabel?: string;
    ariaLabelledBy?: string;
    ariaDescribedBy?: string;
};
