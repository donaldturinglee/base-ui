import * as React from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { useTableOfContentsContext } from "./TableOfContentsContext";
import type { TableOfContentsTitleProps } from "./TableOfContents.types";

const classes = {
    root: "table-of-contents-title",
};

// What names the list: "On this page", or whatever the page would rather call it. A heading
// rather than a label, since it stands over the list the way any other heading stands over what
// follows it, and a reader working down the headings of the page meets it where they would
// expect to.
//
// The nav is told there is a title to name it by rather than assuming one, so a nav drawn without
// this part is left to be named some other way rather than named after nothing
function TableOfContentsTitle<As extends React.ElementType = "h2">(
    props: TableOfContentsTitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h2", className, ...rest } = props as TableOfContentsTitleProps<"h2">;

    const { ids, setHasTitle } = useTableOfContentsContext();

    useIsomorphicLayoutEffect(() => {
        setHasTitle?.(true);

        return () => setHasTitle?.(false);
    }, [setHasTitle]);

    return (
        <Component
            ref={ref}
            id={ids?.title}
            className={classNames(classes.root, className)}
            data-component="TableOfContents.Title"
            {...rest}
        />
    );
}

TableOfContentsTitle.displayName = "TableOfContents.Title";

export default fixedForwardRef(TableOfContentsTitle);
