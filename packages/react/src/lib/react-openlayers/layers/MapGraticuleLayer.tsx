import GraticuleLayer from "ol/layer/Graticule";
import { useMapLayer } from "./useMapLayer";
import type { MapGraticuleLayerProps } from "../types";

// The lines of longitude and latitude, drawn over whatever is beneath them. How many are drawn
// follows how far in the map is, so the grid stays readable rather than closing up
function MapGraticuleLayer({ name, ...options }: MapGraticuleLayerProps) {
    useMapLayer(() => new GraticuleLayer(options), name);

    return null;
}

MapGraticuleLayer.displayName = "MapGraticuleLayer";

export { MapGraticuleLayer };
