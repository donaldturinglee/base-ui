import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ButtonBase from "./ButtonBase";
import type { ButtonProps } from "./Button.types";

function Button<As extends React.ElementType = "button">(
    props: ButtonProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "button", type = "button", ...rest } = props as ButtonProps<"button">;

    return <ButtonBase ref={ref} as={Component} type={type} {...rest} />;
}

Button.displayName = "Button";

export default fixedForwardRef(Button);
