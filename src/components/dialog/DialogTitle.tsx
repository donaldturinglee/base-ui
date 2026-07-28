import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogTitleProps } from "./Dialog.types";

const classes = {
    // The dialog is a document of its own while it is open, so its title reads as the
    // heading of one rather than taking the size that comes with it
    root: "m-0 [font-size:var(--text-body-size-medium)] [font-weight:var(--text-title-weight-large)]",
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
