import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ButtonBase from "../button/ButtonBase";
import type { ButtonSize } from "../button";
import type { IconButtonElementProps, IconButtonProps } from "./IconButton.types";

const iconButtonVariants = cva("icon-button", {
    variants: {
        size: {
            small: "icon-button-small",
            medium: "icon-button-medium",
            large: "icon-button-large",
        } satisfies Record<ButtonSize, string>,
    },
});

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
            className={classNames(iconButtonVariants({ size }), className)}
            {...rest}
        />
    );
}

IconButton.displayName = "IconButton";

export default fixedForwardRef(IconButton);
