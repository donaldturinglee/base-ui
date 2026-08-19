import * as React from "react";
import { classNames } from "../../lib/classnames";
import { fixedForwardRef } from "../../utilities/polymorphic";
import LayerCardPrimary from "./LayerCardPrimary";
import LayerCardSecondary from "./LayerCardSecondary";
import type { LayerCardProps } from "./LayerCard.types";

const classes = {
    surface: "layer-card",
    layered: "layer-card-layered",
};

// Whether the card was handed layers to stack rather than content to hold. A fragment is looked
// through rather than counted as content, since sections built from a list arrive wrapped in one
const hasLayers = (children: React.ReactNode): boolean =>
    React.Children.toArray(children).some((child) => {
        if (!React.isValidElement(child)) {
            return false;
        }

        if (child.type === LayerCardPrimary || child.type === LayerCardSecondary) {
            return true;
        }

        if (child.type === React.Fragment) {
            const { children: nested } = child.props as { children?: React.ReactNode };
            return hasLayers(nested);
        }

        return false;
    });

// A card that is one surface or two, settled by what it was given rather than by a prop. Handed
// content, it is a plain surface to put something on; handed a Secondary and a Primary, it becomes
// the recessed layer those stack on, so a card can be labelled by what sits behind it.
//
//     <LayerCard className="p-4">Get started</LayerCard>
//
//     <LayerCard>
//         <LayerCard.Secondary>Next steps</LayerCard.Secondary>
//         <LayerCard.Primary>Get started</LayerCard.Primary>
//     </LayerCard>
//
// A plain surface holds no padding of its own, since what goes on it settles how much it wants.
// The two layers bring their own, being a shape the design system settles rather than the caller
function LayerCard<As extends React.ElementType = "div">(
    props: LayerCardProps<As>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const { as: Component = "div", className, children, ...rest } = props as LayerCardProps<"div">;

    const layered = hasLayers(children);

    return (
        <Component
            ref={ref}
            className={classNames(layered ? classes.layered : classes.surface, className)}
            data-component="LayerCard"
            data-layered={layered ? "" : undefined}
            {...rest}
        >
            {children}
        </Component>
    );
}

LayerCard.displayName = "LayerCard";

export default fixedForwardRef(LayerCard);
