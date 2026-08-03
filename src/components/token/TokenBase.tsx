import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TokenBaseProps, TokenInteractiveProps, TokenSize } from "./Token.types";

const tokenBaseVariants = cva("token", {
    variants: {
        size: {
            small: "token-small",
            medium: "token-medium",
            large: "token-large",
            xlarge: "token-xlarge",
        } satisfies Record<TokenSize, string>,
        interactive: {
            true: "token-interactive",
            false: "token-static",
        },
    },
});

export const DEFAULT_TOKEN_SIZE: TokenSize = "medium";

// Whether the token answers the reader. It decides where the token's own handlers go, and
// how the remove button standing beside them is rendered
export const isTokenInteractive = ({
    as = "span",
    onClick,
    onFocus,
    tabIndex = -1,
    disabled,
}: TokenInteractiveProps) => {
    if (disabled) {
        return false;
    }

    return Boolean(onFocus || onClick || tabIndex > -1 || as === "a" || as === "button");
};

// The shell every token is drawn in: the shape, the size, and the keys that remove it. What
// it is made of is left to the token itself
function TokenBase<As extends React.ElementType = "span">(
    props: React.PropsWithChildren<TokenBaseProps<As>>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        size = DEFAULT_TOKEN_SIZE,
        isSelected,
        onRemove,
        onKeyDown,
        ...rest
    } = props as TokenBaseProps<React.ElementType>;

    const interactive = isTokenInteractive({
        as: Component,
        onClick: rest.onClick,
        onFocus: rest.onFocus,
        tabIndex: rest.tabIndex,
        disabled: rest.disabled,
    });

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        onKeyDown?.(event);

        // A token is taken back out the way a word is
        if (event.key === "Backspace" || event.key === "Delete") {
            onRemove?.();
        }
    };

    return (
        <Component
            ref={ref}
            onKeyDown={handleKeyDown}
            className={classNames(tokenBaseVariants({ size, interactive }), className)}
            data-component="Token"
            data-size={size}
            data-interactive={interactive ? "" : undefined}
            data-selected={isSelected ? "" : undefined}
            {...(Component === "button" ? { type: "button" } : {})}
            {...rest}
        />
    );
}

TokenBase.displayName = "TokenBase";

export default fixedForwardRef(TokenBase);
