import { useContext } from "react";
import { MapLayerGroupContext } from "./MapLayerGroupContext";

// The group the nearest `MapLayerGroup` above put within reach, or undefined where there is none
export const useMapLayerGroup = () => useContext(MapLayerGroupContext);
