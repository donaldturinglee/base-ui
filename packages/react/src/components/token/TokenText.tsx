import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TokenTextProps } from "./Token.types";

const classes = {
    root: "token-text",
    interactive: "token-text-interactive",
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
