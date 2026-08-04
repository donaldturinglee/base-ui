import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { CodeBlockContext } from "./CodeBlockContext";
import { DEFAULT_DARK_THEME, DEFAULT_LANGUAGE, DEFAULT_LIGHT_THEME } from "./highlightCode";
import type { CodeBlockProps } from "./CodeBlock.types";

const classes = {
    root: "code-block",
    numbered: "code-block-numbered",
    wrap: "code-block-wrap",
    nowrap: "code-block-nowrap",
};

// A listing set apart from the prose around it, with its line breaks and its indentation kept
// as they were written and a grammar read over it. A name or a command read inside a line of
// prose is the Code component instead.
//
// The grammar and the two themes are named here rather than on the listing, so that a block
// holding more than one listing only has to say them once, and the frame around them is the
// design system's own: only the colour of the runs inside comes from the theme, so a block
// sits with the rest of the page rather than opening a window of its own onto it
function CodeBlock<As extends React.ElementType = "div">(
    props: CodeBlockProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        language = DEFAULT_LANGUAGE,
        lightTheme = DEFAULT_LIGHT_THEME,
        darkTheme = DEFAULT_DARK_THEME,
        showLineNumbers = false,
        wrap = "nowrap",
        ...rest
    } = props as CodeBlockProps<"div">;

    const context = { language, lightTheme, darkTheme, showLineNumbers, wrap };

    return (
        <CodeBlockContext.Provider value={context}>
            <Component
                ref={ref}
                className={classNames(
                    classes.root,
                    showLineNumbers && classes.numbered,
                    classes[wrap],
                    className,
                )}
                data-component="CodeBlock"
                data-language={language}
                {...rest}
            />
        </CodeBlockContext.Provider>
    );
}

CodeBlock.displayName = "CodeBlock";

export default fixedForwardRef(CodeBlock);
