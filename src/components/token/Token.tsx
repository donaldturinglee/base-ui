import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import TokenBase, { DEFAULT_TOKEN_SIZE, isTokenInteractive } from "./TokenBase";
import TokenRemoveButton from "./TokenRemoveButton";
import TokenText from "./TokenText";
import type { ButtonVisual } from "../button";
import type { TokenProps, TokenSize } from "./Token.types";

const classes = {
    srOnly: "sr-only",
};

const tokenVariants = cva("token-default", {
    variants: {
        interactive: {
            true: "token-default-interactive",
            false: "",
        },
        selected: {
            true: "token-default-selected",
            false: "",
        },
        withRemoveButton: {
            true: "token-with-remove-button",
            false: "",
        },
    },
});

const tokenLeadingVisualVariants = cva("token-visual", {
    variants: {
        size: {
            // A small token has no room to spare between its visual and its text
            small: "",
            medium: "token-visual-medium",
            large: "token-visual-large",
            xlarge: "token-visual-xlarge",
        } satisfies Record<TokenSize, string>,
    },
});

const renderVisual = (visual: NonNullable<ButtonVisual>) => {
    if (React.isValidElement(visual)) {
        return visual;
    }

    const Visual = visual as React.ElementType;
    return <Visual />;
};

// A short, rounded label standing for one thing that has been picked: a person, a topic, a
// file. It can lead somewhere, be taken back out, or both
function Token<As extends React.ElementType = "span">(
    props: TokenProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        className,
        text,
        size = DEFAULT_TOKEN_SIZE,
        leadingVisual,
        onRemove,
        hideRemoveButton,
        isSelected,
        href,
        onClick,
        ...rest
    } = props as TokenProps<"span"> & { href?: string };

    const interactive = isTokenInteractive({
        as,
        onClick,
        onFocus: rest.onFocus,
        tabIndex: rest.tabIndex,
        disabled: rest.disabled,
    });
    const showRemoveButton = Boolean(onRemove) && !hideRemoveButton;
    // A token that both leads somewhere and can be taken back out holds two things to press,
    // so what it leads to moves onto the text and the remove button is left standing beside
    // it rather than inside it
    const hasMultipleActionTargets = interactive && showRemoveButton;

    const interactiveProps = { as, href, onClick };

    const handleRemoveClick = (event: React.MouseEvent<HTMLElement>) => {
        // The token itself is left alone, so taking it out is not also following it
        event.stopPropagation();
        onRemove?.();
    };

    return (
        <TokenBase
            ref={ref}
            size={size}
            isSelected={isSelected}
            onRemove={onRemove}
            className={classNames(
                tokenVariants({
                    interactive,
                    selected: isSelected,
                    withRemoveButton: showRemoveButton,
                }),
                className,
            )}
            data-has-remove-button={showRemoveButton ? "" : undefined}
            {...(hasMultipleActionTargets ? {} : interactiveProps)}
            {...rest}
        >
            {leadingVisual && size !== "small" ? (
                <span
                    className={classNames(tokenLeadingVisualVariants({ size }))}
                    data-component="Token.LeadingVisual"
                >
                    {renderVisual(leadingVisual)}
                </span>
            ) : null}
            <TokenText
                interactive={hasMultipleActionTargets}
                {...(hasMultipleActionTargets ? interactiveProps : {})}
            >
                {text}
                {onRemove ? (
                    <span className={classes.srOnly}> (press backspace or delete to remove)</span>
                ) : null}
            </TokenText>
            {showRemoveButton ? (
                <TokenRemoveButton
                    size={size}
                    isParentInteractive={interactive}
                    onClick={handleRemoveClick}
                />
            ) : null}
        </TokenBase>
    );
}

Token.displayName = "Token";

export default fixedForwardRef(Token);
