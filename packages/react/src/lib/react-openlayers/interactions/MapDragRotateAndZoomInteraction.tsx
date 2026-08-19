import DragRotateAndZoom from "ol/interaction/DragRotateAndZoom";
import { useMapInteraction } from "./useMapInteraction";
import type { MapDragRotateAndZoomInteractionProps } from "../types";

// Turning and zooming the map by dragging across it with shift held down, which is the only way
// to reach a rotation on a pointer that has no second axis to turn
function MapDragRotateAndZoomInteraction(props: MapDragRotateAndZoomInteractionProps) {
    useMapInteraction(() => new DragRotateAndZoom(props));

    return null;
}

MapDragRotateAndZoomInteraction.displayName = "MapDragRotateAndZoomInteraction";

export { MapDragRotateAndZoomInteraction };
