import * as React from "react";
import Feature from "ol/Feature";
import PointerInteraction from "ol/interaction/Pointer";
import { useMapInteraction } from "./useMapInteraction";
import type MapBrowserEvent from "ol/MapBrowserEvent";
import type { Coordinate } from "ol/coordinate";
import type { MapPointerInteractionProps } from "../types";

// What is being dragged and where it was last seen
type Dragging = {
    feature: Feature;
    coordinate: Coordinate;
};

// Dragging what is drawn on the map about, and saying with the pointer what can be taken hold
// of. The shape is moved by its geometry rather than by its style, so what is dragged is where
// the feature is rather than only where it is drawn.
//
// What is being dragged is kept in a reference rather than in the closure the handlers were
// written in: the interaction is built once and goes on calling the handlers it was built with,
// which would otherwise be reading what the first render happened to see
function MapPointerInteraction(props: MapPointerInteractionProps) {
    const draggingRef = React.useRef<Dragging | null>(null);

    const handleDownEvent = (event: MapBrowserEvent) => {
        const feature = event.map.forEachFeatureAtPixel(event.pixel, (found) => found);

        if (!(feature instanceof Feature)) {
            // Answering false leaves the pointer to the map, which is then dragged instead of
            // what is drawn on it
            return false;
        }

        draggingRef.current = { feature, coordinate: event.coordinate };

        return true;
    };

    const handleDragEvent = (event: MapBrowserEvent) => {
        const dragging = draggingRef.current;
        if (!dragging) return;

        const geometry = dragging.feature.getGeometry();
        if (!geometry) return;

        // The shape is moved by how far the pointer has come since it was last seen rather than
        // by where it started, so a shape taken hold of off centre keeps its offset
        geometry.translate(
            event.coordinate[0] - dragging.coordinate[0],
            event.coordinate[1] - dragging.coordinate[1],
        );

        dragging.coordinate = event.coordinate;
    };

    const handleMoveEvent = (event: MapBrowserEvent) => {
        const feature = event.map.forEachFeatureAtPixel(event.pixel, (found) => found);
        const element = event.map.getTargetElement();

        if (element) {
            element.style.cursor = feature ? "pointer" : "";
        }
    };

    const handleUpEvent = () => {
        draggingRef.current = null;

        // Answering false is what ends the drag
        return false;
    };

    useMapInteraction(
        () =>
            new PointerInteraction({
                handleDownEvent,
                handleDragEvent,
                handleMoveEvent,
                handleUpEvent,
                ...props,
            }),
    );

    return null;
}

MapPointerInteraction.displayName = "MapPointerInteraction";

export { MapPointerInteraction };
