import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { LinkProps } from "./Link.types";

const classes = {
    // The reset for button tags travels with the root class, so `as="button"` still reads as
    // a link without a second name for it
    root: "link",
    inline: "link-inline",
    muted: "link-muted",
};

function Link<As extends React.ElementType = "a">(
    props: LinkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "a", className, muted, inline, ...rest } = props as LinkProps<"a">;

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                inline && classes.inline,
                muted && classes.muted,
                className,
            )}
            data-component="Link"
            data-muted={muted}
            data-inline={inline}
            {...rest}
        />
    );
}

Link.displayName = "Link";

export default fixedForwardRef(Link);
