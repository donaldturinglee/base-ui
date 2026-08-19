import WebGLTileLayer from "ol/layer/WebGLTile";
import { useMapLayer } from "./useMapLayer";
import type { MapWebGLTileLayerProps } from "../types";

// Tiles drawn by the graphics card rather than by the canvas, which is what a layer being
// recoloured as it is read needs: the band arithmetic behind it is done where the pixels are
function MapWebGLTileLayer({ name, ...options }: MapWebGLTileLayerProps) {
    useMapLayer(() => new WebGLTileLayer(options), name);

    return null;
}

MapWebGLTileLayer.displayName = "MapWebGLTileLayer";

export { MapWebGLTileLayer };
