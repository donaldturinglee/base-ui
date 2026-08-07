import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { CounterLabelProps, CounterLabelVariant } from "./CounterLabel.types";

const classes = {
    srOnly: "sr-only",
};

const counterLabelVariants = cva("counter-label", {
    variants: {
        variant: {
            primary: "counter-label-primary",
            secondary: "counter-label-secondary",
        } satisfies Record<CounterLabelVariant, string>,
    },
});

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
