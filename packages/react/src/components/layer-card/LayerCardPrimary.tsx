import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { LayerCardSectionProps } from "./LayerCard.types";

const classes = {
    root: "layer-card-primary",
};

// The layer in front: the card proper, raised onto the one behind it. It carries neither colour
// nor underline of its own, so that rendering it as a link leaves it looking like the card it is
// rather than like a line of link text
function LayerCardPrimary<As extends React.ElementType = "div">(
    props: LayerCardSectionProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as LayerCardSectionProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="LayerCard.Primary"
            {...rest}
        />
    );
}

LayerCardPrimary.displayName = "LayerCard.Primary";

export default fixedForwardRef(LayerCardPrimary);
