import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogFooterProps } from "./Dialog.types";

const classes = {
    root: "z-1 shrink-0 flex flex-wrap justify-end p-[var(--base-size-16)] gap-[var(--base-size-8)]",
    // Where the buttons would leave the body no room to speak of, the dialog says so and
    // they are scrolled through in one row instead of wrapping
    scroll: "[[data-footer-button-layout='scroll']_&]:flex-row [[data-footer-button-layout='scroll']_&]:flex-nowrap [[data-footer-button-layout='scroll']_&]:justify-start [[data-footer-button-layout='scroll']_&]:overflow-x-scroll",
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
