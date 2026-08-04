import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CodeBlockHeaderProps } from "./CodeBlock.types";

const classes = {
    root: "code-block-header",
};

// The strip above the listing, saying what is below it and holding whatever is done to it.
// The title is set at the start and everything else at the end, so a block with a copy button
// beside its file name lays out without being told to
function CodeBlockHeader<As extends React.ElementType = "div">(
    props: CodeBlockHeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as CodeBlockHeaderProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="CodeBlock.Header"
            {...rest}
        />
    );
}

CodeBlockHeader.displayName = "CodeBlock.Header";

export default fixedForwardRef(CodeBlockHeader);
