import * as React from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { fixedForwardRef } from "../../utilities/polymorphic";
import MarkdownProse from "./MarkdownProse";
import {
    DEFAULT_MARKDOWN_NAMESPACE,
    markdownTheme,
    MARKDOWN_NODES,
    MARKDOWN_TRANSFORMERS,
} from "./markdownTheme";
import type { MarkdownProps } from "./Markdown.types";

// Markdown, drawn as the prose it stands for:
//
//     <Markdown>{"# Release notes\n\nNothing here changes an **API**."}</Markdown>
//
// Lexical reads the markdown into the same kinds of writing the rich text editor holds, and the
// same reconciler draws them, so what is written in an editor and what is read out of a file are
// drawn as one thing rather than two that have drifted apart. What is different is what it is
// for: this is content on a page rather than a field on a form, so it carries no frame, no focus
// ring and nothing to write in — only the prose.
//
// A fenced code block is drawn plainly, as the preformatted run it is. A listing that is to be
// read under a grammar, with its runs coloured, is the CodeBlock component instead
function Markdown(
    props: MarkdownProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        className,
        children = "",
        transformers = MARKDOWN_TRANSFORMERS,
        preserveNewLines = false,
        namespace = DEFAULT_MARKDOWN_NAMESPACE,
        onError,
        ...rest
    } = props;

    // Lexical reads this once and builds the editor from it. Nothing here is written in, only
    // read, so the editor behind the prose is never editable
    const initialConfig = {
        namespace,
        theme: markdownTheme,
        nodes: MARKDOWN_NODES,
        editable: false,
        // Markdown that has quietly failed to be read looks the same as markdown that was
        // empty, so what Lexical could not do is thrown for the boundary above to catch
        onError:
            onError ??
            ((error: Error) => {
                throw error;
            }),
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <MarkdownProse
                ref={ref}
                className={className}
                source={children}
                transformers={transformers}
                preserveNewLines={preserveNewLines}
                {...rest}
            />
        </LexicalComposer>
    );
}

Markdown.displayName = "Markdown";

export default fixedForwardRef(Markdown);
