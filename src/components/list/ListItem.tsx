import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { ListItemProps } from "./List.types";

const classes = {
    root: "list-item",
};

// One of the things the list holds. Whatever it is given to hold sits in the run rather than
// parting it, so how far apart the items stand is the list's to settle and not each item's
function ListItem<As extends React.ElementType = "li">(
    props: ListItemProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "li", className, ...rest } = props as ListItemProps<"li">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="List.Item"
            {...rest}
        />
    );
}

ListItem.displayName = "List.Item";

export default fixedForwardRef(ListItem);
