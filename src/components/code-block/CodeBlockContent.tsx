import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { useOverflow } from "../../hooks/useOverflow";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CodeBlockContentProps } from "./CodeBlock.types";

const classes = {
    root: "code-block-content",
};

// What the listing is read through. A listing keeps its lines as long as they were written,
// so this is where anything that will not fit is scrolled to rather than wrapped
function CodeBlockContent<As extends React.ElementType = "div">(
    props: CodeBlockContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as CodeBlockContentProps<"div">;

    const contentRef = React.useRef<HTMLElement>(null);
    const mergedRef = useMergedRefs(ref, contentRef);
    const hasOverflow = useOverflow(contentRef);

    return (
        <Component
            ref={mergedRef}
            // Only a listing that actually scrolls is reached by the keyboard, so a reader is
            // not stopped at one they could not have moved within
            tabIndex={hasOverflow ? 0 : undefined}
            className={classNames(classes.root, className)}
            data-component="CodeBlock.Content"
            {...rest}
        />
    );
}

CodeBlockContent.displayName = "CodeBlock.Content";

export default fixedForwardRef(CodeBlockContent);
