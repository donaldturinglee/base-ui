import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogTitleProps } from "./Dialog.types";

const classes = {
    root: "dialog-title",
};

function DialogTitle<As extends React.ElementType = "h1">(
    props: DialogTitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h1", className, ...rest } = props as DialogTitleProps<"h1">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Dialog.Title"
            {...rest}
        />
    );
}

DialogTitle.displayName = "Dialog.Title";

export default fixedForwardRef(DialogTitle);
