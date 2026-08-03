import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CounterLabelProps, CounterLabelVariant } from "./CounterLabel.types";

const classes = {
    srOnly: "sr-only",
};

const counterLabelVariants = cva(
    [
        "inline-block px-[var(--base-size-6)] py-[var(--base-size-2)] leading-none [font-size:var(--text-body-size-small)] [font-weight:var(--base-text-weight-semibold)]",
        "border-solid border-[length:var(--border-width-thin)] border-[color:var(--counter-border-color)] rounded-[var(--border-radius-full)]",
        // A counter with nothing to count takes up no space
        "empty:hidden",
    ],
    {
        variants: {
            variant: {
                primary:
                    "text-foreground-on-emphasis bg-[var(--counter-background-color-emphasis)]",
                secondary: "text-foreground-default bg-[var(--counter-background-color-muted)]",
            } satisfies Record<CounterLabelVariant, string>,
        },
    },
);

function CounterLabel<As extends React.ElementType = "span">(
    props: CounterLabelProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        variant = "secondary",
        children,
        ...rest
    } = props as CounterLabelProps<"span">;

    return (
        <>
            <Component
                ref={ref}
                aria-hidden="true"
                className={classNames(counterLabelVariants({ variant }), className)}
                data-component="CounterLabel"
                data-variant={variant}
                {...rest}
            >
                {children}
            </Component>
            {/* The count is announced here instead, so it reads as part of the surrounding
                sentence. Browsers strip a plain leading space, so this uses a non-breaking one */}
            <span className={classes.srOnly}>&nbsp;({children})</span>
        </>
    );
}

CounterLabel.displayName = "CounterLabel";

export default fixedForwardRef(CounterLabel);
