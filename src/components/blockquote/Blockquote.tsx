import * as React from "react";
import { classNames, cva } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BlockquoteProps, BlockquoteSize, BlockquoteVariant } from "./Blockquote.types";

const blockquoteVariants = cva("blockquote", {
    variants: {
        size: {
            large: "blockquote-large",
            medium: "blockquote-medium",
            small: "blockquote-small",
        } satisfies Record<BlockquoteSize, string>,
        variant: {
            subtle: "blockquote-subtle",
            default: "blockquote-default",
            emphasis: "blockquote-emphasis",
        } satisfies Record<BlockquoteVariant, string>,
    },
});

function Blockquote<As extends React.ElementType = "blockquote">(
    props: BlockquoteProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        as: Component = "blockquote",
        className,
        size = "medium",
        variant = "default",
        ...rest
        // The cite attribute a blockquote carries of its own travels through with the rest
    } = props as BlockquoteProps<"blockquote">;

    return (
        <Component
            ref={ref}
            className={classNames(blockquoteVariants({ size, variant }), className)}
            data-component="Blockquote"
            data-size={size}
            data-variant={variant}
            {...rest}
        />
    );
}

Blockquote.displayName = "Blockquote";

export default fixedForwardRef(Blockquote);
