import ImageLayer from "ol/layer/Image";
import { useMapLayer } from "./useMapLayer";
import type { MapImageLayerProps } from "../types";

// Ground drawn as one picture rather than as tiles, asked for again each time the map is moved.
// It is what a source that renders to order gives back, and it costs one request where a tile
// layer costs many
function MapImageLayer({ name, ...options }: MapImageLayerProps) {
    useMapLayer(() => new ImageLayer(options), name);

    return null;
}

MapImageLayer.displayName = "MapImageLayer";

export { MapImageLayer };
