import * as React from "react";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useTableOfContentsContext } from "./TableOfContentsContext";
import type { TableOfContentsContentProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-content",
};

// The document the contents are drawn from. It is a part rather than something the caller keeps
// aside, since what the document is scrolled in is what the headings have to be watched against:
// a heading is on screen when it is within the panel it is read in, not when it is within the
// window the panel happens to be standing in.
//
// The element is handed back to the contents alongside whatever ref the caller asked for, so a
// page that scrolls inside a panel is written no differently from one whose window does the
// scrolling — there is simply a content in the one and none in the other
function TableOfContentsContent<As extends React.ElementType = "article">(
    props: TableOfContentsContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "article",
        className,
        ...rest
    } = props as TableOfContentsContentProps<"article">;

    const { setScrollElement } = useTableOfContentsContext();

    const mergedRef = useMergedRefs(ref, setScrollElement);

    return (
        <Component
            ref={mergedRef}
            className={classNames(classes.root, className)}
            data-component="TableOfContents.Content"
            {...rest}
        />
    );
}

TableOfContentsContent.displayName = "TableOfContents.Content";

export default fixedForwardRef(TableOfContentsContent);
