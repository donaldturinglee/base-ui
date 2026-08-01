import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import { DrawerContext } from "./DrawerContext";
import type { DrawerSubtitleProps } from "./Drawer.types";

const classes = {
    root: "m-0 mt-[var(--base-size-4)] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-normal)] [color:var(--foreground-color-muted)]",
};

function DrawerSubtitle<As extends React.ElementType = "h2">(
    props: DrawerSubtitleProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "h2", className, id, ...rest } = props as DrawerSubtitleProps<"h2">;
    const { descriptionId } = React.useContext(DrawerContext);

    return (
        <Component
            ref={ref}
            // The drawer is described by this element, so it takes the id the drawer is already
            // pointing at unless the caller has named one of their own
            id={id ?? descriptionId}
            className={classNames(classes.root, className)}
            data-component="Drawer.Subtitle"
            {...rest}
        />
    );
}

DrawerSubtitle.displayName = "Drawer.Subtitle";

export default fixedForwardRef(DrawerSubtitle);
