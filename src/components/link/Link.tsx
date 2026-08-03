import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { LinkProps } from "./Link.types";

const classes = {
    root: "text-foreground-accent no-underline [text-underline-offset:0.05rem] hover:underline",
    // Reset for button tags, so `as="button"` still reads as a link
    button: "[&:is(button)]:inline-block [&:is(button)]:p-0 [&:is(button)]:[font-size:inherit] [&:is(button)]:whitespace-nowrap [&:is(button)]:cursor-pointer [&:is(button)]:select-none [&:is(button)]:bg-transparent [&:is(button)]:border-0 [&:is(button)]:appearance-none",
    // Inline links are underlined only when an ancestor opts into the accessibility setting
    inline: "[[data-a11y-link-underlines='true']_&]:underline [[data-a11y-link-underlines='true']_&]:hover:no-underline",
    muted: "text-foreground-muted hover:text-foreground-accent hover:no-underline",
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
                classes.button,
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
