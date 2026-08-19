import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
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

const stackVariants = cva("stack", {
    variants: {
        gap: {
            none: "stack-gap-none",
            tight: "stack-gap-tight",
            condensed: "stack-gap-condensed",
            cozy: "stack-gap-cozy",
            normal: "stack-gap-normal",
            spacious: "stack-gap-spacious",
        } satisfies Record<StackGap, string>,
        direction: {
            horizontal: "stack-horizontal",
            vertical: "stack-vertical",
        } satisfies Record<StackDirection, string>,
        align: {
            stretch: "stack-align-stretch",
            start: "stack-align-start",
            center: "stack-align-center",
            end: "stack-align-end",
            baseline: "stack-align-baseline",
        } satisfies Record<StackAlign, string>,
        wrap: {
            wrap: "stack-wrap",
            nowrap: "stack-nowrap",
        } satisfies Record<StackWrap, string>,
        justify: {
            start: "stack-justify-start",
            center: "stack-justify-center",
            end: "stack-justify-end",
            "space-between": "stack-justify-space-between",
            "space-evenly": "stack-justify-space-evenly",
        } satisfies Record<StackJustify, string>,
        padding: {
            none: "stack-padding-none",
            tight: "stack-padding-tight",
            condensed: "stack-padding-condensed",
            cozy: "stack-padding-cozy",
            normal: "stack-padding-normal",
            spacious: "stack-padding-spacious",
        } satisfies Record<StackPadding, string>,
        // The block and inline classes are named after the whole-box ones in the
        // stylesheet, so either one overrides `padding` on its own axis
        paddingBlock: {
            none: "stack-padding-block-none",
            tight: "stack-padding-block-tight",
            condensed: "stack-padding-block-condensed",
            cozy: "stack-padding-block-cozy",
            normal: "stack-padding-block-normal",
            spacious: "stack-padding-block-spacious",
        } satisfies Record<StackPadding, string>,
        paddingInline: {
            none: "stack-padding-inline-none",
            tight: "stack-padding-inline-tight",
            condensed: "stack-padding-inline-condensed",
            cozy: "stack-padding-inline-cozy",
            normal: "stack-padding-inline-normal",
            spacious: "stack-padding-inline-spacious",
        } satisfies Record<StackPadding, string>,
    },
});

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
