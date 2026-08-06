import * as React from "react";
import { classNames } from "../../utilities/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { BubbleContentProps } from "./Bubble.types";

const classes = {
    root: "bubble-content",
};

// The painted surface, and the words on it. Everything the variant settles — the ground, the ink,
// the border, the corners — lands here rather than on the bubble, so anything else the bubble
// carries stands beside the surface rather than on it.
//
// A turn that can be acted on is rendered as the thing that acts: `as="button"` for one that is
// pressed, `as="a"` for one that leads somewhere. The pointer and the focus ring follow from the
// element rather than from a prop of its own, so a surface that does nothing is never drawn as
// though it does
function BubbleContent<As extends React.ElementType = "div">(
    props: BubbleContentProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as BubbleContentProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="Bubble.Content"
            {...rest}
        />
    );
}

BubbleContent.displayName = "Bubble.Content";

export default fixedForwardRef(BubbleContent);
