import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { LabelProps, LabelSize, LabelVariant } from "./Label.types";

const classes = {
    root: "inline-flex items-center whitespace-nowrap bg-transparent leading-none [color:var(--foreground-color-default)] [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-medium)]",
    border: "border-solid [border-width:var(--border-width-thin)] rounded-[var(--border-radius-full)]",
    size: {
        small: "h-[var(--base-size-20)] px-[var(--base-size-6)] py-0",
        medium: "h-[var(--base-size-24)] px-[var(--base-size-6)] py-0",
        large: "h-[var(--base-size-24)] px-[var(--base-size-8)] py-0",
    } satisfies Record<LabelSize, string>,
    variant: {
        default: "[border-color:var(--border-color-default)]",
        primary: "[border-color:var(--foreground-color-default)]",
        secondary: "[color:var(--foreground-color-muted)] [border-color:var(--border-color-muted)]",
        accent: "[color:var(--foreground-color-accent)] [border-color:var(--background-color-accent-emphasis)]",
        success:
            "[color:var(--foreground-color-success)] [border-color:var(--background-color-success-emphasis)]",
        attention:
            "[color:var(--foreground-color-attention)] [border-color:var(--background-color-attention-emphasis)]",
        severe: "[color:var(--foreground-color-severe)] [border-color:var(--background-color-severe-emphasis)]",
        danger: "[color:var(--foreground-color-danger)] [border-color:var(--border-color-danger-emphasis)]",
        done: "[color:var(--foreground-color-done)] [border-color:var(--background-color-done-emphasis)]",
        sponsors:
            "[color:var(--foreground-color-sponsors)] [border-color:var(--background-color-sponsors-emphasis)]",
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
