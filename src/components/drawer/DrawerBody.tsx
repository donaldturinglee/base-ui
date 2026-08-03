import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DrawerBodyProps } from "./Drawer.types";

const classes = {
    root: "drawer-body",
};

function DrawerBody<As extends React.ElementType = "div">(
    props: DrawerBodyProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as DrawerBodyProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Drawer.Body"
            {...rest}
        />
    );
}

DrawerBody.displayName = "Drawer.Body";

export default fixedForwardRef(DrawerBody);
