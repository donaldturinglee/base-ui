import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogHeaderProps } from "./Dialog.types";

const classes = {
    // The header stays put while the body scrolls under it, and the shadow stands in for
    // a border so a long title never pushes the body down by a pixel
    root: "z-1 shrink-0 max-h-[35vh] p-[var(--base-size-8)] overflow-y-auto [box-shadow:0_1px_0_var(--border-color-default)]",
};

function DialogHeader<As extends React.ElementType = "div">(
    props: DialogHeaderProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as DialogHeaderProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Dialog.Header"
            {...rest}
        />
    );
}

DialogHeader.displayName = "Dialog.Header";

export default fixedForwardRef(DialogHeader);
