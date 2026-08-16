import LayerCardBase from "./LayerCard";
import LayerCardPrimary from "./LayerCardPrimary";
import LayerCardSecondary from "./LayerCardSecondary";

export const LayerCard = Object.assign(LayerCardBase, {
    Secondary: LayerCardSecondary,
    Primary: LayerCardPrimary,
});

export { LayerCardSecondary, LayerCardPrimary };
export * from "./LayerCard.types";
