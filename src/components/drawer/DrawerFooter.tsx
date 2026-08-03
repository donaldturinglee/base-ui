import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DrawerFooterProps } from "./Drawer.types";

const classes = {
    root: "drawer-footer",
};

function DrawerFooter<As extends React.ElementType = "div">(
    props: DrawerFooterProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as DrawerFooterProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Drawer.Footer"
            {...rest}
        />
    );
}

DrawerFooter.displayName = "Drawer.Footer";

export default fixedForwardRef(DrawerFooter);
