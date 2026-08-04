import RichTextEditorBase from "./RichTextEditor";
import RichTextEditorContent from "./RichTextEditorContent";
import RichTextEditorToolbar from "./RichTextEditorToolbar";

export const RichTextEditor = Object.assign(RichTextEditorBase, {
    Toolbar: RichTextEditorToolbar,
    Content: RichTextEditorContent,
});

export { RichTextEditorToolbar, RichTextEditorContent };
export { DEFAULT_RICH_TEXT_EDITOR_CONTROLS } from "./RichTextEditorToolbar";
export {
    DEFAULT_RICH_TEXT_EDITOR_NAMESPACE,
    RICH_TEXT_EDITOR_NODES,
    richTextEditorTheme,
} from "./richTextEditorTheme";
export * from "./RichTextEditor.types";
