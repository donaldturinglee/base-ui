import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogFooterProps } from "./Dialog.types";

const classes = {
    root: "dialog-footer",
    scroll: "dialog-footer-scroll",
};

function DialogFooter<As extends React.ElementType = "div">(
    props: DialogFooterProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as DialogFooterProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, classes.scroll, className)}
            data-component="Dialog.Footer"
            {...rest}
        />
    );
}

DialogFooter.displayName = "Dialog.Footer";

export default fixedForwardRef(DialogFooter);
