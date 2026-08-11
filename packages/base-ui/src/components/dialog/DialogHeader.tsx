import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogHeaderProps } from "./Dialog.types";

const classes = {
    root: "dialog-header",
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
