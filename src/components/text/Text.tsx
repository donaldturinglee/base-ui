import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { TextProps, TextSize, TextWeight, TextWhiteSpace } from "./Text.types";

const classes = {
    root: "[font-family:var(--font-stack-sans-serif)] [font-weight:var(--text-body-weight)]",
    size: {
        large: "[font-size:var(--text-body-size-large)] [line-height:var(--text-body-line-height-large)]",
        medium: "[font-size:var(--text-body-size-medium)] [line-height:var(--text-body-line-height-medium)]",
        small: "[font-size:var(--text-body-size-small)] [line-height:var(--text-body-line-height-small)]",
    } satisfies Record<TextSize, string>,
    weight: {
        light: "[font-weight:var(--base-text-weight-light)]",
        normal: "[font-weight:var(--base-text-weight-normal)]",
        medium: "[font-weight:var(--base-text-weight-medium)]",
        semibold: "[font-weight:var(--base-text-weight-semibold)]",
    } satisfies Record<TextWeight, string>,
    whiteSpace: {
        pre: "whitespace-pre",
        normal: "whitespace-normal",
        nowrap: "whitespace-nowrap",
        "pre-wrap": "whitespace-pre-wrap",
        "pre-line": "whitespace-pre-line",
    } satisfies Record<TextWhiteSpace, string>,
};

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
            className={classNames(
                classes.root,
                classes.size[size],
                weight && classes.weight[weight],
                whiteSpace && classes.whiteSpace[whiteSpace],
                className,
            )}
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
