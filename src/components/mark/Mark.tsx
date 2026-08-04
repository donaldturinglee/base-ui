import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MarkProps, MarkSize, MarkVariant, MarkWeight } from "./Mark.types";

const markVariants = cva("mark", {
    variants: {
        variant: {
            attention: "mark-attention",
            accent: "mark-accent",
            success: "mark-success",
            danger: "mark-danger",
            neutral: "mark-neutral",
        } satisfies Record<MarkVariant, string>,
        size: {
            large: "mark-size-large",
            medium: "mark-size-medium",
            small: "mark-size-small",
        } satisfies Record<MarkSize, string>,
        weight: {
            light: "mark-weight-light",
            normal: "mark-weight-normal",
            medium: "mark-weight-medium",
            semibold: "mark-weight-semibold",
        } satisfies Record<MarkWeight, string>,
    },
});

// A run of text picked out for the reader rather than by the writer's stress, so the ground it
// sits on does the marking and the letters are left alone. Neither size nor weight is answered
// here unless a caller asks for one, so the highlight takes the type of whatever it sits within
function Mark<As extends React.ElementType = "mark">(
    props: MarkProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "mark",
        className,
        variant = "attention",
        size,
        weight,
        ...rest
    } = props as MarkProps<"mark">;

    return (
        <Component
            ref={ref}
            className={classNames(markVariants({ variant, size, weight }), className)}
            data-component="Mark"
            data-variant={variant}
            data-size={size}
            data-weight={weight}
            {...rest}
        />
    );
}

Mark.displayName = "Mark";

export default fixedForwardRef(Mark);
