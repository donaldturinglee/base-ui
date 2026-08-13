import Attribution from "ol/control/Attribution";
import { useMapControl } from "./useMapControl";
import type { MapAttributionControlProps } from "../types";

// Who the ground beneath the map belongs to. Every source a map is drawn from carries its own,
// and the control gathers whichever of them are being drawn at the time
function MapAttributionControl(props: MapAttributionControlProps) {
    useMapControl(() => new Attribution(props));

    return null;
}

MapAttributionControl.displayName = "MapAttributionControl";

export { MapAttributionControl };
