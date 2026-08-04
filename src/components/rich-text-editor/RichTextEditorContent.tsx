import * as React from "react";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { RichTextEditorContext } from "./RichTextEditorContext";
import type { RichTextEditorContentProps } from "./RichTextEditor.types";

const classes = {
    scroll: "rich-text-editor-scroll",
    content: "rich-text-editor-content",
    placeholder: "rich-text-editor-placeholder",
};

// The surface the writing is done on. It is named and described by whatever named and described
// the editor around it, so a field and its caption are written once and read on the part that
// actually takes the focus.
//
// The scroller around it is what the two heights are set on: the writing area itself grows with
// what is written, and the box it sits in is what holds it to a height and scrolls the rest
function RichTextEditorContent(
    props: RichTextEditorContentProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, style, ...rest } = props;
    const { placeholder, minHeight, maxHeight, ariaLabel, ariaLabelledBy, ariaDescribedBy } =
        React.useContext(RichTextEditorContext);

    const editable = (
        <div
            className={classes.scroll}
            style={{
                minHeight: minHeight === undefined ? undefined : `${minHeight}px`,
                maxHeight: maxHeight === undefined ? undefined : `${maxHeight}px`,
            }}
            data-component="RichTextEditor.Scroll"
        >
            {/* A placeholder and the words a screen reader hears in its place go together, so
                either both are given or neither is */}
            {placeholder ? (
                <ContentEditable
                    ref={ref}
                    className={classNames(classes.content, className)}
                    style={style}
                    ariaLabel={ariaLabel}
                    ariaLabelledBy={ariaLabelledBy}
                    ariaDescribedBy={ariaDescribedBy}
                    aria-placeholder={placeholder}
                    placeholder={<div className={classes.placeholder}>{placeholder}</div>}
                    data-component="RichTextEditor.Content"
                    {...rest}
                />
            ) : (
                <ContentEditable
                    ref={ref}
                    className={classNames(classes.content, className)}
                    style={style}
                    ariaLabel={ariaLabel}
                    ariaLabelledBy={ariaLabelledBy}
                    ariaDescribedBy={ariaDescribedBy}
                    placeholder={null}
                    data-component="RichTextEditor.Content"
                    {...rest}
                />
            )}
        </div>
    );

    // The boundary is what keeps a node that could not be drawn from taking the whole editor,
    // and what is written with it down
    return <RichTextPlugin contentEditable={editable} ErrorBoundary={LexicalErrorBoundary} />;
}

RichTextEditorContent.displayName = "RichTextEditor.Content";

export default fixedForwardRef(RichTextEditorContent);
