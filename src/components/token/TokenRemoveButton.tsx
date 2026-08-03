import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../utilities/classnames";
import { DEFAULT_TOKEN_SIZE } from "./TokenBase";
import type { TokenRemoveButtonProps, TokenSize } from "./Token.types";

const tokenRemoveButtonVariants = cva("token-remove-button", {
    variants: {
        size: {
            small: "token-remove-button-small",
            medium: "token-remove-button-medium",
            large: "token-remove-button-large",
            xlarge: "token-remove-button-xlarge",
        } satisfies Record<TokenSize, string>,
        raised: {
            true: "token-remove-button-raised",
            false: "",
        },
    },
});

// Takes the token back out. Where the token already answers the reader it cannot be a button
// of its own, since one cannot stand inside another, so it is drawn as the same mark and
// left out of the accessibility tree — Backspace and Delete are what remove the token there
function TokenRemoveButton(props: TokenRemoveButtonProps) {
    const { className, size = DEFAULT_TOKEN_SIZE, isParentInteractive, ...rest } = props;

    const buttonClassName = classNames(
        tokenRemoveButtonVariants({ size, raised: isParentInteractive }),
        className,
    );

    if (isParentInteractive) {
        return (
            <span
                aria-hidden="true"
                tabIndex={-1}
                className={buttonClassName}
                data-component="Token.RemoveButton"
                data-size={size}
                {...rest}
            >
                <DismissRegular />
            </span>
        );
    }

    return (
        <button
            type="button"
            aria-label="Remove token"
            className={buttonClassName}
            data-component="Token.RemoveButton"
            data-size={size}
            {...rest}
        >
            <DismissRegular />
        </button>
    );
}

TokenRemoveButton.displayName = "Token.RemoveButton";

export default TokenRemoveButton;
