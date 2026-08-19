import VectorLayer from "ol/layer/Vector";
import { useMapLayer } from "./useMapLayer";
import type { MapVectorLayerProps } from "../types";

// Shapes drawn from their coordinates rather than from a picture of them, so what is on the
// layer can be pointed at, picked out and restyled without anything being fetched again
function MapVectorLayer({ name, ...options }: MapVectorLayerProps) {
    useMapLayer(() => new VectorLayer(options), name);

    return null;
}

MapVectorLayer.displayName = "MapVectorLayer";

export { MapVectorLayer };
