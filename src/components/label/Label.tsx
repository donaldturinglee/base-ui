import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { LabelProps, LabelSize, LabelVariant } from "./Label.types";

const classes = {
    root: "inline-flex items-center whitespace-nowrap bg-transparent leading-none text-foreground-default [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-medium)]",
    border: "border-solid [border-width:var(--border-width-thin)] rounded-[var(--border-radius-full)]",
    size: {
        small: "h-[var(--base-size-20)] px-[var(--base-size-6)] py-0",
        medium: "h-[var(--base-size-24)] px-[var(--base-size-6)] py-0",
        large: "h-[var(--base-size-24)] px-[var(--base-size-8)] py-0",
    } satisfies Record<LabelSize, string>,
    variant: {
        default: "border-border-default",
        primary: "border-foreground-default",
        secondary: "text-foreground-muted border-border-muted",
        accent: "text-foreground-accent border-background-accent-emphasis",
        success: "text-foreground-success border-background-success-emphasis",
        attention: "text-foreground-attention border-background-attention-emphasis",
        severe: "text-foreground-severe border-background-severe-emphasis",
        danger: "text-foreground-danger border-border-danger-emphasis",
        done: "text-foreground-done border-background-done-emphasis",
        sponsors: "text-foreground-sponsors border-background-sponsors-emphasis",
    } satisfies Record<LabelVariant, string>,
};

function Label<As extends React.ElementType = "span">(
    props: LabelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        size = "small",
        variant = "default",
        ...rest
    } = props as LabelProps<"span">;

    return (
        <Component
            ref={ref}
            className={classNames(
                classes.root,
                classes.border,
                classes.size[size],
                classes.variant[variant],
                className,
            )}
            data-component="Label"
            data-size={size}
            data-variant={variant}
            {...rest}
        />
    );
}

Label.displayName = "Label";

export default fixedForwardRef(Label);
