import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TokenTextProps } from "./Token.types";

const classes = {
    // Whatever the text is rendered as, it is stripped back to text: an anchor keeps none of
    // its underline and a button none of its box
    root: "grow w-auto min-w-0 m-0 p-0 overflow-hidden text-ellipsis whitespace-nowrap [font:inherit] leading-[var(--base-text-line-height-normal)] [color:currentColor] no-underline text-start bg-transparent border-0 appearance-none",
    // Stretched over the whole token, so that a click anywhere on it lands on the same thing
    // rather than only on the words
    interactive: "cursor-pointer after:content-[''] after:absolute after:inset-0",
};

// What the token says. Where the token both leads somewhere and can be removed, this is the
// part that leads somewhere, so that the remove button is not left standing inside it
function TokenText<As extends React.ElementType = "span">(
    props: React.PropsWithChildren<TokenTextProps<As>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        interactive,
        ...rest
    } = props as TokenTextProps<React.ElementType>;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, interactive && classes.interactive, className)}
            data-component="Token.Text"
            {...(Component === "button" ? { type: "button" } : {})}
            {...rest}
        />
    );
}

TokenText.displayName = "Token.Text";

export default fixedForwardRef(TokenText);
