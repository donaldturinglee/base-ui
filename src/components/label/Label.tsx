import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { LabelProps, LabelSize, LabelVariant } from "./Label.types";

const labelVariants = cva("label", {
    variants: {
        size: {
            small: "label-small",
            medium: "label-medium",
            large: "label-large",
        } satisfies Record<LabelSize, string>,
        variant: {
            default: "label-default",
            primary: "label-primary",
            secondary: "label-secondary",
            accent: "label-accent",
            success: "label-success",
            attention: "label-attention",
            severe: "label-severe",
            danger: "label-danger",
            done: "label-done",
            sponsors: "label-sponsors",
        } satisfies Record<LabelVariant, string>,
    },
});

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
            className={classNames(labelVariants({ size, variant }), className)}
            data-component="Label"
            data-size={size}
            data-variant={variant}
            {...rest}
        />
    );
}

Label.displayName = "Label";

export default fixedForwardRef(Label);
