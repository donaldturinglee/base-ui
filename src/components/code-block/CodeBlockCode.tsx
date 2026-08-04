import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CodeBlockContext } from "./CodeBlockContext";
import {
    DEFAULT_DARK_THEME,
    DEFAULT_LANGUAGE,
    DEFAULT_LIGHT_THEME,
    highlightLines,
    toPlainLines,
} from "./highlightCode";
import type { CodeBlockCodeProps, CodeBlockLine } from "./CodeBlock.types";

const classes = {
    root: "code-block-pre",
    code: "code-block-code",
    line: "code-block-line",
    token: "code-block-token",
};

// The coloured runs, together with the listing they were read from, so that runs left over
// from a listing that has since been replaced are never drawn against the new one
type Highlighted = {
    source: string;
    lines: CodeBlockLine[];
};

// The listing itself. Reading a grammar over it means fetching that grammar, which cannot be
// done in the time it takes to draw, so the listing is drawn as it was written first and the
// coloured runs take its place once they arrive. Both are the same shape, one run to a span
// and one newline between lines, so nothing moves and what a reader copies out is the listing
// as it was passed in
function CodeBlockCode(
    props: CodeBlockCodeProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { className, children = "", language, ...rest } = props;
    const {
        language: blockLanguage = DEFAULT_LANGUAGE,
        lightTheme = DEFAULT_LIGHT_THEME,
        darkTheme = DEFAULT_DARK_THEME,
    } = React.useContext(CodeBlockContext);

    const grammar = language ?? blockLanguage;

    // A listing written as a template literal ends on the newline before its closing backtick,
    // which stands for nothing a reader was meant to see, so one is dropped from the end
    const source = children.replace(/\n$/, "");

    const [highlighted, setHighlighted] = React.useState<Highlighted | null>(null);

    React.useEffect(() => {
        let cancelled = false;

        highlightLines(source, { language: grammar, lightTheme, darkTheme })
            .then((lines) => {
                if (!cancelled) {
                    setHighlighted({ source, lines });
                }
            })
            // A grammar or a theme that never arrives leaves the listing standing as it was
            // written, which is still the listing, rather than leaving nothing in its place
            .catch(() => {
                if (!cancelled) {
                    setHighlighted({ source, lines: toPlainLines(source) });
                }
            });

        return () => {
            cancelled = true;
        };
    }, [source, grammar, lightTheme, darkTheme]);

    const isHighlighted = highlighted?.source === source;
    const lines = isHighlighted ? highlighted.lines : toPlainLines(source);

    return (
        <pre
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="CodeBlock.Code"
            data-language={grammar}
            data-highlighted={isHighlighted}
            {...rest}
        >
            <code className={classes.code}>
                {lines.map((line, index) => (
                    // Lines, and the runs within them, are only ever told apart by where they
                    // fall in the listing, which is what the index stands for here
                    <React.Fragment key={index}>
                        {index > 0 ? "\n" : null}
                        <span className={classes.line}>
                            {line.map((token, position) => (
                                <span
                                    key={position}
                                    className={classes.token}
                                    // Both themes were read at once, so a run carries a custom
                                    // property for each rather than a colour of its own
                                    style={token.style as React.CSSProperties}
                                >
                                    {token.content}
                                </span>
                            ))}
                        </span>
                    </React.Fragment>
                ))}
            </code>
        </pre>
    );
}

CodeBlockCode.displayName = "CodeBlock.Code";

export default fixedForwardRef(CodeBlockCode);
