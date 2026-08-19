import OverviewMap from "ol/control/OverviewMap";
import { useMapControl } from "./useMapControl";
import type { MapOverviewMapControlProps } from "../types";

// A second map drawn further out, with a box on it saying which part of it the first is showing.
// It is what tells a reader who has zoomed a long way in where they have ended up
function MapOverviewMapControl(props: MapOverviewMapControlProps) {
    useMapControl(() => new OverviewMap(props));

    return null;
}

MapOverviewMapControl.displayName = "MapOverviewMapControl";

export { MapOverviewMapControl };
