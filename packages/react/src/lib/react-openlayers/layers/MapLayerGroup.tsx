import LayerGroup from "ol/layer/Group";
import { useMapLayer } from "./useMapLayer";
import { MapLayerGroupContext } from "./MapLayerGroupContext";
import type { MapLayerGroupProps } from "../types";

// Layers gathered under one of their own, so that a handful of them can be shown, hidden or
// ordered together rather than one at a time. A group is itself a layer, so groups can be
// written inside groups and the whole reads as a tree
function MapLayerGroup({ children, name, ...options }: MapLayerGroupProps) {
    const group = useMapLayer(() => new LayerGroup(options), name);

    return <MapLayerGroupContext.Provider value={group}>{children}</MapLayerGroupContext.Provider>;
}

MapLayerGroup.displayName = "MapLayerGroup";

export { MapLayerGroup };
