import HeatmapLayer from "ol/layer/Heatmap";
import { useMapLayer } from "./useMapLayer";
import type { MapHeatmapLayerProps } from "../types";

// Points drawn as a wash of colour rather than one at a time, so that where they gather can be
// read off a layer holding more of them than could be told apart as shapes
function MapHeatmapLayer({ name, ...options }: MapHeatmapLayerProps) {
    useMapLayer(() => new HeatmapLayer(options), name);

    return null;
}

MapHeatmapLayer.displayName = "MapHeatmapLayer";

export { MapHeatmapLayer };
