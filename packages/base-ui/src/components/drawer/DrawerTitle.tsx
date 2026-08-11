import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DrawerContext } from "./DrawerContext";
import type { DrawerTitleProps } from "./Drawer.types";

const classes = {
    root: "drawer-title",
};

function DrawerTitle<As extends React.ElementType = "h1">(
    props: DrawerTitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h1", className, id, ...rest } = props as DrawerTitleProps<"h1">;
    const { labelId } = React.useContext(DrawerContext);

    return (
        <Component
            ref={ref}
            // The drawer is named after this element, so it takes the id the drawer is already
            // pointing at unless the caller has named one of their own
            id={id ?? labelId}
            className={classNames(classes.root, className)}
            data-component="Drawer.Title"
            {...rest}
        />
    );
}

DrawerTitle.displayName = "Drawer.Title";

export default fixedForwardRef(DrawerTitle);
