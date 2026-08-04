import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { Mark } from "../mark";
import { splitHighlightChunks } from "./highlightMatches";
import type { HighlightProps } from "./Highlight.types";

// Text with the runs a search stood for picked out of it, so that a reader can see what a
// result was found on. The picking out is the Mark component's, so a run reads and is drawn as
// any other marked one, and everything between the runs is left as it was written
function Highlight<As extends React.ElementType = "span">(
    props: HighlightProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        children = "",
        match,
        caseSensitive = false,
        variant = "attention",
        ...rest
    } = props as HighlightProps<"span">;

    const chunks = React.useMemo(
        () => splitHighlightChunks(children, match, caseSensitive),
        [children, match, caseSensitive],
    );

    return (
        <Component
            ref={ref}
            data-component="Highlight"
            data-variant={variant}
            data-case-sensitive={caseSensitive}
            {...rest}
        >
            {chunks.map((chunk, index) =>
                chunk.matched ? (
                    // The runs are only ever told apart by where they fall in the text, which
                    // is what the index stands for here
                    <Mark key={index} variant={variant}>
                        {chunk.text}
                    </Mark>
                ) : (
                    chunk.text
                ),
            )}
        </Component>
    );
}

Highlight.displayName = "Highlight";

export default fixedForwardRef(Highlight);
