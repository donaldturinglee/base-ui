import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogBodyProps } from "./Dialog.types";

const classes = {
    root: "dialog-body",
};

function DialogBody<As extends React.ElementType = "div">(
    props: DialogBodyProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as DialogBodyProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Dialog.Body"
            {...rest}
        />
    );
}

DialogBody.displayName = "Dialog.Body";

export default fixedForwardRef(DialogBody);
