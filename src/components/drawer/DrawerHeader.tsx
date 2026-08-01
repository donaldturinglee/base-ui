import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DrawerHeaderProps } from "./Drawer.types";

const classes = {
    // The header stays put while the body scrolls under it, and the shadow stands in for a
    // border so a long title never pushes the body down by a pixel.
    //
    // Its parts are laid out in a row by the header itself, so that a header built by hand
    // stands a close button beside the title rather than beneath it. The row is read from the
    // top, so a title running onto a second line leaves the button where it started
    root: "z-1 shrink-0 flex items-start gap-[var(--base-size-8)] max-h-[35vh] p-[var(--base-size-8)] overflow-y-auto [box-shadow:0_1px_0_var(--border-color-default)]",
    // The default header groups its title and subtitle in a block of its own, and that block
    // is what holds them off the edge and gives them the height the close button stands at. A
    // title written straight into the header has no such block, so it is given the same rhythm
    // here — and being a direct child is what the rule turns on, so it cannot reach the grouped
    // title, which sits a step further down
    directTitle:
        "[&>[data-component='Drawer.Title']]:px-[var(--base-size-8)] [&>[data-component='Drawer.Title']]:py-[var(--base-size-6)]",
};

function DrawerHeader<As extends React.ElementType = "div">(
    props: DrawerHeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as DrawerHeaderProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.directTitle, className)}
            data-component="Drawer.Header"
            {...rest}
        />
    );
}

DrawerHeader.displayName = "Drawer.Header";

export default fixedForwardRef(DrawerHeader);
