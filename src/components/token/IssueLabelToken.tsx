import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import TokenBase, { DEFAULT_TOKEN_SIZE, isTokenInteractive } from "./TokenBase";
import TokenRemoveButton from "./TokenRemoveButton";
import TokenText from "./TokenText";
import { DEFAULT_ISSUE_LABEL_FILL_COLOR, getIssueLabelColors } from "./issueLabelColor";
import type { IssueLabelTokenProps } from "./Token.types";

const classes = {
    // Every colour the label is drawn in is worked out from the one it was given and carried
    // in variables, so the theme it is read in is left to CSS to pick
    root: "max-w-full border-solid border-[length:var(--border-width-thin)] bg-[var(--issue-label-background)] [color:var(--issue-label-foreground)] border-[color:var(--issue-label-border)] [[data-theme='dark']_&]:bg-[var(--issue-label-dark-background)] [[data-theme='dark']_&]:[color:var(--issue-label-dark-foreground)] [[data-theme='dark']_&]:border-[color:var(--issue-label-dark-border)]",
    interactive:
        "hover:bg-[var(--issue-label-background-hover)] hover:[box-shadow:var(--shadow-resting-medium)] [[data-theme='dark']_&]:hover:bg-[var(--issue-label-dark-background-hover)]",
    // A label that has been picked is ringed in its own colour, standing clear of it
    selected:
        "outline-none [box-shadow:0_0_0_var(--base-size-2)_var(--issue-label-ring)] [[data-theme='dark']_&]:[box-shadow:0_0_0_var(--base-size-2)_var(--issue-label-dark-ring)]",
    withRemoveButton: "pr-0",
    srOnly: "sr-only",
};

// A label standing for one of the things an issue has been marked with. It is drawn in a
// colour of its own, which every other colour on it is worked out from
function IssueLabelToken<As extends React.ElementType = "span">(
    props: IssueLabelTokenProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as,
        className,
        style,
        text,
        size = DEFAULT_TOKEN_SIZE,
        fillColor = DEFAULT_ISSUE_LABEL_FILL_COLOR,
        onRemove,
        hideRemoveButton,
        isSelected,
        href,
        onClick,
        ...rest
    } = props as IssueLabelTokenProps<React.ElementType> & { href?: string };

    const colors = React.useMemo(() => getIssueLabelColors(fillColor), [fillColor]);

    const interactive = isTokenInteractive({
        as,
        onClick,
        onFocus: rest.onFocus,
        tabIndex: rest.tabIndex,
        disabled: rest.disabled,
    });
    const showRemoveButton = Boolean(onRemove) && !hideRemoveButton;
    // A label that both leads somewhere and can be taken back out holds two things to press,
    // so what it leads to moves onto the text
    const hasMultipleActionTargets = interactive && showRemoveButton;

    const interactiveProps = { as, href, onClick };

    const handleRemoveClick = (event: React.MouseEvent<HTMLElement>) => {
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
                classes.root,
                interactive && classes.interactive,
                isSelected && classes.selected,
                showRemoveButton && classes.withRemoveButton,
                className,
            )}
            style={
                {
                    ...style,
                    "--issue-label-background": colors.light.background,
                    "--issue-label-foreground": colors.light.foreground,
                    "--issue-label-border": colors.light.border,
                    "--issue-label-ring": colors.light.ring,
                    "--issue-label-background-hover": colors.light.backgroundHover,
                    "--issue-label-dark-background": colors.dark.background,
                    "--issue-label-dark-foreground": colors.dark.foreground,
                    "--issue-label-dark-border": colors.dark.border,
                    "--issue-label-dark-ring": colors.dark.ring,
                    "--issue-label-dark-background-hover": colors.dark.backgroundHover,
                } as React.CSSProperties
            }
            data-component="IssueLabelToken"
            data-has-remove-button={showRemoveButton ? "" : undefined}
            {...(hasMultipleActionTargets ? {} : interactiveProps)}
            {...rest}
        >
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

IssueLabelToken.displayName = "IssueLabelToken";

export default fixedForwardRef(IssueLabelToken);
