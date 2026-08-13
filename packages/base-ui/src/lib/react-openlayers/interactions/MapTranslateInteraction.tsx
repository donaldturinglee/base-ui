import Translate from "ol/interaction/Translate";
import { useMapInteraction } from "./useMapInteraction";
import type { MapTranslateInteractionProps } from "../types";

// Moving what is drawn on the map by dragging it, the ground beneath staying where it is. What
// can be taken hold of is narrowed by the features or the layers it is given, and is everything
// drawn on the map where it is given neither
function MapTranslateInteraction(props: MapTranslateInteractionProps) {
    useMapInteraction(() => new Translate(props));

    return null;
}

MapTranslateInteraction.displayName = "MapTranslateInteraction";

export { MapTranslateInteraction };
