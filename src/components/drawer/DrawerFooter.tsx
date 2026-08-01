import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DrawerFooterProps } from "./Drawer.types";

const classes = {
    root: "z-1 shrink-0 flex flex-wrap justify-end p-[var(--base-size-16)] gap-[var(--base-size-8)]",
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
