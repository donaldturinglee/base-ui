import MousePosition from "ol/control/MousePosition";
import { useMapControl } from "./useMapControl";
import type { MapMousePositionControlProps } from "../types";

// Where on the ground the pointer is standing, written out as it moves. Which projection the
// coordinates are read in is the control's own to be told, since the map's is rarely the one a
// reader wants them in
function MapMousePositionControl(props: MapMousePositionControlProps) {
    useMapControl(() => new MousePosition(props));

    return null;
}

MapMousePositionControl.displayName = "MapMousePositionControl";

export { MapMousePositionControl };
