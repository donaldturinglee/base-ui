import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ListProps, ListSpacing, ListVariant } from "./List.types";

const listVariants = cva("list", {
    variants: {
        variant: {
            bullet: "list-bullet",
            number: "list-number",
            plain: "list-plain",
        } satisfies Record<ListVariant, string>,
        spacing: {
            condensed: "list-condensed",
            normal: "list-normal",
            spacious: "list-spacious",
        } satisfies Record<ListSpacing, string>,
    },
});

// A run of related things, drawn with a bullet against each of them, a number, or nothing at
// all. What the list is for settles what it is drawn as: a numbered list is an ordered one, so
// that a reader who is told the items rather than shown them is told the order as well.
//
// A list nested inside an item carries on from the one above it: its markers change so the two
// runs are told apart, and it is set off by the same step the items are spaced by
function List<As extends React.ElementType = "ul">(
    props: ListProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        className,
        variant = "bullet",
        spacing = "normal",
        ...rest
    } = props as ListProps<"ul">;

    const Component: React.ElementType = as ?? (variant === "number" ? "ol" : "ul");

    return (
        <Component
            ref={ref}
            // Safari takes the list semantics away from a list with no markers, so a plain one
            // says it is a list rather than leaving it to the element. A marked list is left to
            // speak for itself, and either can be overruled by a caller with a role of their own
            role={variant === "plain" ? "list" : undefined}
            className={classNames(listVariants({ variant, spacing }), className)}
            data-component="List"
            data-variant={variant}
            data-spacing={spacing}
            {...rest}
        />
    );
}

List.displayName = "List";

export default fixedForwardRef(List);
