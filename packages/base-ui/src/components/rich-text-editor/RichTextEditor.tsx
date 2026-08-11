import * as React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RichTextEditorContext } from "./RichTextEditorContext";
import {
    DEFAULT_RICH_TEXT_EDITOR_NAMESPACE,
    RICH_TEXT_EDITOR_NODES,
    richTextEditorTheme,
} from "./richTextEditorTheme";
import type { RichTextEditorProps } from "./RichTextEditor.types";
import type { LexicalEditor } from "lexical";

const classes = {
    root: "rich-text-editor",
    readOnly: "rich-text-editor-read-only",
};

// Whether the editor can be written in is settled once, when it is built, so a caller who takes
// it back and forth has to say so again through the editor itself
const EditableState = ({ readOnly }: { readOnly?: boolean }) => {
    const [editor] = useLexicalComposerContext();

    React.useEffect(() => {
        editor.setEditable(!readOnly);
    }, [editor, readOnly]);

    return null;
};

// A field for writing prose in: headings, quotes, lists, links and the marks that can be laid
// over a run of words. Lexical holds what is written and answers for the typing, the undo stack
// and the clipboard; what is here is the frame around it, the buttons that give it its commands,
// and the stylesheet that says what the writing is drawn as.
//
// The parts are named by the caller rather than drawn here:
//
//     <RichTextEditor aria-label="Description">
//         <RichTextEditor.Toolbar />
//         <RichTextEditor.Content />
//     </RichTextEditor>
//
// so a toolbar can sit under the writing as readily as over it, and a caller with buttons of
// their own has somewhere to put them.
//
// What the editor holds is its own. Lexical reads the starting state once and keeps it from
// there, since an editor told again on every render what it should hold would lose the cursor
// with every keystroke; `onChange` is how what has been written is read back out
function RichTextEditor(
    props: RichTextEditorProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children,
        defaultValue,
        onChange,
        placeholder,
        readOnly,
        nodes,
        namespace = DEFAULT_RICH_TEXT_EDITOR_NAMESPACE,
        onError,
        minHeight,
        maxHeight,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
        ...rest
    } = props;

    // Lexical reads this once and builds the editor from it, so nothing said here can be taken
    // back later. What can be changed afterwards is changed through the editor instead
    const initialConfig = {
        namespace,
        theme: richTextEditorTheme,
        nodes: nodes ? [...RICH_TEXT_EDITOR_NODES, ...nodes] : RICH_TEXT_EDITOR_NODES,
        editable: !readOnly,
        editorState: defaultValue,
        // An editor that has quietly stopped working is worse than one that says so, so what
        // Lexical could not do is thrown for the boundary above to catch
        onError:
            onError ??
            ((error: Error) => {
                throw error;
            }),
    };

    const context = {
        readOnly,
        placeholder,
        minHeight,
        maxHeight,
        ariaLabel,
        ariaLabelledBy,
        ariaDescribedBy,
    };

    return (
        <div
            ref={ref}
            className={classNames(classes.root, readOnly && classes.readOnly, className)}
            data-component="RichTextEditor"
            data-read-only={readOnly}
            {...rest}
        >
            <LexicalComposer initialConfig={initialConfig}>
                <RichTextEditorContext.Provider value={context}>
                    {/* The commands the editor answers to. They render nothing of their own,
                        and are named here rather than by the caller so that every editor
                        understands the same keystrokes whatever its toolbar shows */}
                    <HistoryPlugin />
                    <ListPlugin />
                    <LinkPlugin />
                    <TabIndentationPlugin />
                    <EditableState readOnly={readOnly} />
                    {onChange ? (
                        <OnChangePlugin
                            onChange={(editorState, editor: LexicalEditor) =>
                                onChange(editorState, editor)
                            }
                        />
                    ) : null}
                    {children}
                </RichTextEditorContext.Provider>
            </LexicalComposer>
        </div>
    );
}

RichTextEditor.displayName = "RichTextEditor";

export default fixedForwardRef(RichTextEditor);
