import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ButtonBase from "../button/ButtonBase";
import type { ButtonSize } from "../button";
import type { IconButtonElementProps, IconButtonProps } from "./IconButton.types";

const classes = {
    // An icon button is square, with the icon centred rather than laid out on a grid. The
    // centring is spelled out longhand so that it replaces the button's own alignment rather
    // than sitting beside it
    root: "inline-grid justify-center content-center shrink-0 min-w-[unset] p-0",
    size: {
        small: "w-[var(--control-small-size)]",
        medium: "w-[var(--control-medium-size)]",
        large: "w-[var(--control-large-size)]",
    } satisfies Record<ButtonSize, string>,
};

function IconButton<As extends React.ElementType = "button">(
    props: IconButtonProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "button",
        className,
        size = "medium",
        ...rest
    } = props as unknown as IconButtonElementProps;

    return (
        <ButtonBase
            ref={ref}
            as={Component}
            type="button"
            size={size}
            data-component="IconButton"
            className={classNames(classes.root, classes.size[size], className)}
            {...rest}
        />
    );
}

IconButton.displayName = "IconButton";

export default fixedForwardRef(IconButton);
