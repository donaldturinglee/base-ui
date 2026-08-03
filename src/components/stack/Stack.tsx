import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    StackAlign,
    StackDirection,
    StackGap,
    StackJustify,
    StackPadding,
    StackProps,
    StackWrap,
} from "./Stack.types";

const stackVariants = cva(
    // The gap scale sets `--stack-gap`, so leaving `gap` unset falls back to the normal step
    "flex content-start gap-[var(--stack-gap,var(--stack-gap-normal))]",
    {
        variants: {
            gap: {
                none: "[--stack-gap:0]",
                tight: "[--stack-gap:var(--base-size-4)]",
                condensed: "[--stack-gap:var(--stack-gap-condensed)]",
                cozy: "[--stack-gap:var(--base-size-12)]",
                normal: "[--stack-gap:var(--stack-gap-normal)]",
                spacious: "[--stack-gap:var(--stack-gap-spacious)]",
            } satisfies Record<StackGap, string>,
            direction: {
                horizontal: "flex-row",
                vertical: "flex-col",
            } satisfies Record<StackDirection, string>,
            align: {
                stretch: "items-stretch",
                start: "items-start",
                center: "items-center",
                end: "items-end",
                baseline: "items-baseline",
            } satisfies Record<StackAlign, string>,
            wrap: {
                wrap: "flex-wrap",
                nowrap: "flex-nowrap",
            } satisfies Record<StackWrap, string>,
            justify: {
                start: "justify-start",
                center: "justify-center",
                end: "justify-end",
                "space-between": "justify-between",
                "space-evenly": "justify-evenly",
            } satisfies Record<StackJustify, string>,
            padding: {
                none: "p-0",
                tight: "p-[var(--base-size-4)]",
                condensed: "p-[var(--stack-padding-condensed)]",
                cozy: "p-[var(--base-size-12)]",
                normal: "p-[var(--stack-padding-normal)]",
                spacious: "p-[var(--stack-padding-spacious)]",
            } satisfies Record<StackPadding, string>,
            // `px` and `py` resolve to the logical padding axes, so these override `padding` on
            // one axis
            paddingBlock: {
                none: "py-0",
                tight: "py-[var(--base-size-4)]",
                condensed: "py-[var(--stack-padding-condensed)]",
                cozy: "py-[var(--base-size-12)]",
                normal: "py-[var(--stack-padding-normal)]",
                spacious: "py-[var(--stack-padding-spacious)]",
            } satisfies Record<StackPadding, string>,
            paddingInline: {
                none: "px-0",
                tight: "px-[var(--base-size-4)]",
                condensed: "px-[var(--stack-padding-condensed)]",
                cozy: "px-[var(--base-size-12)]",
                normal: "px-[var(--stack-padding-normal)]",
                spacious: "px-[var(--stack-padding-spacious)]",
            } satisfies Record<StackPadding, string>,
        },
    },
);

function Stack<As extends React.ElementType = "div">(
    props: StackProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        gap,
        direction = "vertical",
        align = "stretch",
        wrap = "nowrap",
        justify = "start",
        padding = "none",
        paddingBlock,
        paddingInline,
        ...rest
    } = props as StackProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(
                stackVariants({
                    gap,
                    direction,
                    align,
                    wrap,
                    justify,
                    padding,
                    paddingBlock,
                    paddingInline,
                }),
                className,
            )}
            data-component="Stack"
            data-gap={gap}
            data-direction={direction}
            data-align={align}
            data-wrap={wrap}
            data-justify={justify}
            data-padding={padding}
            data-padding-block={paddingBlock}
            data-padding-inline={paddingInline}
            {...rest}
        />
    );
}

Stack.displayName = "Stack";

export default fixedForwardRef(Stack);
