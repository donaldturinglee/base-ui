import ScaleLine from "ol/control/ScaleLine";
import { useMapControl } from "./useMapControl";
import type { MapScaleLineControlProps } from "../types";

// What a length on the screen stands for on the ground. It is redrawn as the map is moved, since
// a projection stretches the ground differently the further it is from the equator
function MapScaleLineControl(props: MapScaleLineControlProps) {
    useMapControl(() => new ScaleLine(props));

    return null;
}

MapScaleLineControl.displayName = "MapScaleLineControl";

export { MapScaleLineControl };
