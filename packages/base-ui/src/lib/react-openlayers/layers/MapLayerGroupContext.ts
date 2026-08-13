import { createContext } from "react";
import type LayerGroup from "ol/layer/Group";

// The group a layer stands within, in reach of the layers written inside a `MapLayerGroup` and
// of nothing else. A layer with no group above it reads this as undefined and goes on the map
export const MapLayerGroupContext = createContext<LayerGroup | undefined>(undefined);
