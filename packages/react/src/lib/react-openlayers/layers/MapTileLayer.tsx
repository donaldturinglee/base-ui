import TileLayer from "ol/layer/Tile";
import { useMapLayer } from "./useMapLayer";
import type { MapTileLayerProps } from "../types";

// Ground drawn from tiles cut to a grid, which is what almost every map is drawn on: a tile is
// asked for only where it is to be seen, so the whole world is drawn without the whole world
// being fetched
function MapTileLayer({ name, ...options }: MapTileLayerProps) {
    useMapLayer(() => new TileLayer(options), name);

    return null;
}

MapTileLayer.displayName = "MapTileLayer";

export { MapTileLayer };
