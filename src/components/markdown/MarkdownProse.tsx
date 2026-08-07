import * as React from "react";
import { $convertFromMarkdownString } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MarkdownProseProps } from "./Markdown.types";

const classes = {
    root: "markdown",
};

// The element Lexical draws what it has read into. It is handed over as it stands rather than
// wrapped in an editable surface: there is nothing here to write in, so there is nothing that
// has to be a contenteditable, and the prose is left as ordinary content for a reader to move
// through the way they would any other
function MarkdownProse(
    props: MarkdownProseProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, source, transformers, preserveNewLines = false, ...rest } = props;

    const [editor] = useLexicalComposerContext();

    const setRootElement = React.useCallback(
        (element: HTMLElement | null) => {
            editor.setRootElement(element);
        },
        [editor],
    );
    const mergedRef = useMergedRefs(ref, setRootElement);

    // The markdown is read again whenever it changes, which is what a component that only shows
    // it is for. Reading it clears what was drawn before, so nothing is left over from the last
    // reading. It is done discretely so that what has been read is drawn before the page is
    // painted rather than a tick after it, which would show as a flicker
    useIsomorphicLayoutEffect(() => {
        editor.update(
            () => {
                $convertFromMarkdownString(source, transformers, undefined, preserveNewLines);
            },
            { discrete: true },
        );
    }, [editor, source, transformers, preserveNewLines]);

    return (
        <div
            ref={mergedRef}
            className={classNames(classes.root, className)}
            data-component="Markdown"
            {...rest}
        />
    );
}

MarkdownProse.displayName = "MarkdownProse";

export default fixedForwardRef(MarkdownProse);
