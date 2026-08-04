import { createContext } from "react";
import type { RichTextEditorContextValue } from "./RichTextEditor.types";

export const RichTextEditorContext = createContext<RichTextEditorContextValue>({});
