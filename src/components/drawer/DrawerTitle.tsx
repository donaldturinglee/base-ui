import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DrawerContext } from "./DrawerContext";
import type { DrawerTitleProps } from "./Drawer.types";

const classes = {
    // The drawer is a document of its own while it is open, so its title reads as the heading
    // of one rather than taking the size that comes with it
    root: "m-0 [font-size:var(--text-body-size-medium)] [font-weight:var(--text-title-weight-large)]",
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
