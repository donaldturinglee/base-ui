import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { LayerCardSectionProps } from "./LayerCard.types";

const classes = {
    root: "layer-card-secondary",
};

// The layer behind: what the card is about, said quietly. It is pulled up and down into the room
// the primary layer takes, so that only a strip of it shows above and below rather than a band as
// deep as the words it holds
function LayerCardSecondary<As extends React.ElementType = "div">(
    props: LayerCardSectionProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, ...rest } = props as LayerCardSectionProps<"div">;

    return (
        <Component
            ref={ref}
            className={classNames(classes.root, className)}
            data-component="LayerCard.Secondary"
            {...rest}
        />
    );
}

LayerCardSecondary.displayName = "LayerCard.Secondary";

export default fixedForwardRef(LayerCardSecondary);
