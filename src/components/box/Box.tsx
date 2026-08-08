import * as React from "react";
import { classNames, cva } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type {
    BoxBackground,
    BoxBorder,
    BoxOverflow,
    BoxPadding,
    BoxProps,
    BoxRadius,
    BoxShadow,
} from "./Box.types";

const boxVariants = cva("box", {
    variants: {
        padding: {
            none: "box-padding-none",
            tight: "box-padding-tight",
            condensed: "box-padding-condensed",
            cozy: "box-padding-cozy",
            normal: "box-padding-normal",
            spacious: "box-padding-spacious",
        } satisfies Record<BoxPadding, string>,
        // The block and inline classes are named after the whole-box ones in the stylesheet, so
        // either one overrides `padding` on its own axis
        paddingBlock: {
            none: "box-padding-block-none",
            tight: "box-padding-block-tight",
            condensed: "box-padding-block-condensed",
            cozy: "box-padding-block-cozy",
            normal: "box-padding-block-normal",
            spacious: "box-padding-block-spacious",
        } satisfies Record<BoxPadding, string>,
        paddingInline: {
            none: "box-padding-inline-none",
            tight: "box-padding-inline-tight",
            condensed: "box-padding-inline-condensed",
            cozy: "box-padding-inline-cozy",
            normal: "box-padding-inline-normal",
            spacious: "box-padding-inline-spacious",
        } satisfies Record<BoxPadding, string>,
        background: {
            none: "box-background-none",
            default: "box-background-default",
            muted: "box-background-muted",
            inset: "box-background-inset",
            emphasis: "box-background-emphasis",
        } satisfies Record<BoxBackground, string>,
        border: {
            none: "box-border-none",
            default: "box-border-default",
            muted: "box-border-muted",
        } satisfies Record<BoxBorder, string>,
        radius: {
            none: "box-radius-none",
            small: "box-radius-small",
            medium: "box-radius-medium",
            large: "box-radius-large",
            full: "box-radius-full",
        } satisfies Record<BoxRadius, string>,
        shadow: {
            none: "box-shadow-none",
            xsmall: "box-shadow-xsmall",
            small: "box-shadow-small",
            medium: "box-shadow-medium",
        } satisfies Record<BoxShadow, string>,
        overflow: {
            visible: "box-overflow-visible",
            hidden: "box-overflow-hidden",
        } satisfies Record<BoxOverflow, string>,
    },
});

// The plain surface of the system: the box reached for when something needs the padding, the
// fill, the border, the corners and the shadow the library already names, without the layout a
// stack or a card brings along with it. A bare box is a plain element, so what it is drawn as
// is left to say what it means
function Box<As extends React.ElementType = "div">(
    props: BoxProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "div",
        className,
        padding = "none",
        paddingBlock,
        paddingInline,
        background = "none",
        border = "none",
        radius = "none",
        shadow = "none",
        overflow = "visible",
        ...rest
    } = props as BoxProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(
                boxVariants({
                    padding,
                    paddingBlock,
                    paddingInline,
                    background,
                    border,
                    radius,
                    shadow,
                    overflow,
                }),
                className,
            )}
            data-component="Box"
            data-padding={padding}
            data-padding-block={paddingBlock}
            data-padding-inline={paddingInline}
            data-background={background}
            data-border={border}
            data-radius={radius}
            data-shadow={shadow}
            data-overflow={overflow}
            {...rest}
        />
    );
}

Box.displayName = "Box";

export default fixedForwardRef(Box);
