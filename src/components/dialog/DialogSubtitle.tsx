import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { DialogSubtitleProps } from "./Dialog.types";

const classes = {
    root: "m-0 mt-[var(--base-size-4)] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-normal)] [color:var(--foreground-color-muted)]",
};

function DialogSubtitle<As extends React.ElementType = "h2">(
    props: DialogSubtitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h2", className, ...rest } = props as DialogSubtitleProps<"h2">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Dialog.Subtitle"
            {...rest}
        />
    );
}

DialogSubtitle.displayName = "Dialog.Subtitle";

export default fixedForwardRef(DialogSubtitle);
