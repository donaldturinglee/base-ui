import FullScreen from "ol/control/FullScreen";
import { useMapControl } from "./useMapControl";
import type { MapFullScreenControlProps } from "../types";

// Takes the map to the whole of the screen and back again. The browser only allows this from
// something the reader pressed, which is why it is a control rather than something a caller sets
function MapFullScreenControl(props: MapFullScreenControlProps) {
    useMapControl(() => new FullScreen(props));

    return null;
}

MapFullScreenControl.displayName = "MapFullScreenControl";

export { MapFullScreenControl };
