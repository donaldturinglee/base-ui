import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TextProps, TextSize, TextWeight, TextWhiteSpace } from "./Text.types";

const textVariants = cva("text", {
    variants: {
        size: {
            large: "text-size-large",
            medium: "text-size-medium",
            small: "text-size-small",
        } satisfies Record<TextSize, string>,
        weight: {
            light: "text-weight-light",
            normal: "text-weight-normal",
            medium: "text-weight-medium",
            semibold: "text-weight-semibold",
        } satisfies Record<TextWeight, string>,
        whiteSpace: {
            pre: "whitespace-pre",
            normal: "whitespace-normal",
            nowrap: "whitespace-nowrap",
            "pre-wrap": "whitespace-pre-wrap",
            "pre-line": "whitespace-pre-line",
        } satisfies Record<TextWhiteSpace, string>,
    },
});

function Text<As extends React.ElementType = "span">(
    props: TextProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "span",
        className,
        size = "medium",
        weight,
        whiteSpace,
        ...rest
    } = props as TextProps<"span">;

    return (
        <Component
            ref={ref}
            className={classNames(textVariants({ size, weight, whiteSpace }), className)}
            data-component="Text"
            data-size={size}
            data-weight={weight}
            data-white-space={whiteSpace}
            {...rest}
        />
    );
}

Text.displayName = "Text";

export default fixedForwardRef(Text);
