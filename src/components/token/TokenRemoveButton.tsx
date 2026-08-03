import * as React from "react";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { classNames, cva } from "../../utilities/classnames";
import { DEFAULT_TOKEN_SIZE } from "./TokenBase";
import type { TokenRemoveButtonProps, TokenSize } from "./Token.types";

const tokenRemoveButtonVariants = cva(
    [
        "inline-flex shrink-0 items-center justify-center p-0 m-0 appearance-none bg-transparent border-0 rounded-[var(--border-radius-full)] [color:currentColor] [font-family:inherit] no-underline cursor-pointer select-none hover:bg-[var(--control-transparent-background-color-hover)] focus:bg-[var(--control-transparent-background-color-hover)] active:bg-[var(--control-transparent-background-color-active)]",
        // The token is drawn with a border, so the button is moved out by as much to sit against
        // the edge rather than inside it
        "translate-x-[var(--border-width-thin)] -translate-y-[var(--border-width-thin)]",
    ],
    {
        variants: {
            size: {
                small: "size-[var(--base-size-16)] ml-[var(--base-size-4)] [&_svg]:size-[var(--base-size-12)]",
                medium: "size-[var(--base-size-20)] ml-[var(--base-size-4)] [&_svg]:size-[var(--base-size-12)]",
                large: "size-[var(--base-size-24)] ml-[var(--base-size-6)] [&_svg]:size-[var(--base-size-16)]",
                xlarge: "size-[var(--base-size-32)] ml-[var(--base-size-6)] [&_svg]:size-[var(--base-size-16)]",
            } satisfies Record<TokenSize, string>,
            // The text of an interactive token is stretched over the whole of it, so the button
            // is lifted back above that to stay something the reader can press
            raised: {
                true: "relative z-1",
                false: "",
            },
        },
    },
);

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
