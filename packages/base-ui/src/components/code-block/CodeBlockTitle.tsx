import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CodeBlockTitleProps } from "./CodeBlock.types";

const classes = {
    root: "code-block-title",
};

// What the listing below is: a file name, a path, or the name of the grammar it is read
// under. It is read as a label rather than as a heading, so nothing is added to the outline
// of the page around it; a block that stands as a section of its own can say so with `as`
function CodeBlockTitle<As extends React.ElementType = "span">(
    props: CodeBlockTitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "span", className, ...rest } = props as CodeBlockTitleProps<"span">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="CodeBlock.Title"
            {...rest}
        />
    );
}

CodeBlockTitle.displayName = "CodeBlock.Title";

export default fixedForwardRef(CodeBlockTitle);
