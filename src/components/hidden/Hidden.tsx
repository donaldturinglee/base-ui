import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { HiddenProps, HiddenViewport } from "./Hidden.types";

const classes = {
    when: {
        narrow: "hidden-narrow",
        regular: "hidden-regular",
        wide: "hidden-wide",
    } satisfies Record<HiddenViewport, string>,
};

function Hidden<As extends React.ElementType = "div">(
    props: HiddenProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        when,
        ...rest
        // `when` is required, so the resolved props do not overlap with the generic ones
    } = props as unknown as HiddenProps<"div">;

    const viewports = Array.isArray(when) ? when : [when];

    return (
        <Component
            ref={ref}
            className={classNames(
                viewports.map((viewport) => classes.when[viewport]),
                className,
            )}
            data-component="Hidden"
            data-when={viewports.join(" ")}
            {...rest}
        />
    );
}

Hidden.displayName = "Hidden";

export default fixedForwardRef(Hidden);
