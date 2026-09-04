import * as React from "react";
import { fixedForwardRef } from "../../utilities/polymorphic";
import ButtonBase from "./ButtonBase";
import type { ButtonProps } from "./Button.types";

function Button<As extends React.ElementType = "button">(
    props: ButtonProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "button", type, ...rest } = props as ButtonProps<"button">;

    // A button that was not told which kind it is submits whatever form it stands in, so one is
    // named here rather than left to the browser. It is written only where a button is what is
    // being drawn: an anchor takes the same attribute to say what is at the other end of it, and
    // one told "button" would be naming that as the type of the thing it leads to
    const buttonType = Component === "button" ? (type ?? "button") : type;

    return <ButtonBase ref={ref} as={Component} type={buttonType} {...rest} />;
}

Button.displayName = "Button";

export default fixedForwardRef(Button);
