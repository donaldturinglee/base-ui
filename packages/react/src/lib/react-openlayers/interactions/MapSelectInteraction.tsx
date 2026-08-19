import * as React from "react";
import Geometry from "ol/geom/Geometry";
import Select from "ol/interaction/Select";
import Circle from "ol/style/Circle";
import Fill from "ol/style/Fill";
import Stroke from "ol/style/Stroke";
import Style from "ol/style/Style";
import Text from "ol/style/Text";
import { unByKey } from "ol/Observable";
import { getArea, getLength } from "ol/sphere";
import { useMap } from "../useMap";
import { useMapInteraction } from "./useMapInteraction";
import type { FeatureLike } from "ol/Feature";
import type { MapSelectInteractionProps } from "../types";

const SELECTED_COLOR = "#ff0000";
const SELECTED_FILL_COLOR = "rgba(255, 0, 0, 0.4)";

const METRES_IN_KILOMETRE = 1000;
const SQUARE_METRES_IN_SQUARE_KILOMETRE = 1_000_000;

// The measurement is written on the canvas rather than in the document, so it carries a font of
// its own and is drawn light on dark twice over to stand out against whatever is beneath it
const createLabel = (text: string) =>
    new Text({
        text,
        font: "12px Calibri,sans-serif",
        fill: new Fill({ color: "#000" }),
        stroke: new Stroke({ color: "#fff", width: 3 }),
        offsetY: -10,
    });

// What a held shape is drawn as, and what is worth saying about it: a line carries how long it
// is and a shape enclosing ground how large. Both are read off the sphere rather than off the
// projection, which stretches the further it is from the equator and would have a field in
// Norway measuring several times a field of the same size on the equator
const defaultStyle = (feature: FeatureLike) => {
    const geometry = feature.getGeometry();

    if (!(geometry instanceof Geometry)) return undefined;

    const type = geometry.getType();

    if (type === "Point") {
        return new Style({
            image: new Circle({
                radius: 6,
                fill: new Fill({ color: SELECTED_FILL_COLOR }),
                stroke: new Stroke({ color: SELECTED_COLOR, width: 2 }),
            }),
        });
    }

    if (type === "LineString") {
        const style = new Style({
            stroke: new Stroke({ color: SELECTED_COLOR, width: 3 }),
        });
        const length = getLength(geometry) / METRES_IN_KILOMETRE;

        if (length > 0) {
            style.setText(createLabel(`Length: ${length.toFixed(2)} km`));
        }

        return style;
    }

    const style = new Style({
        fill: new Fill({ color: SELECTED_FILL_COLOR }),
        stroke: new Stroke({ color: SELECTED_COLOR, width: 2 }),
    });

    try {
        const area = getArea(geometry) / SQUARE_METRES_IN_SQUARE_KILOMETRE;

        if (area > 0) {
            style.setText(createLabel(`Area: ${area.toFixed(2)} km²`));
        }
    } catch {
        // Not every shape encloses ground, and one that does not has no area to be measured
    }

    return style;
};

// Taking hold of what is drawn on the map, so that a shape can be read, measured and deleted.
// Backspace takes whatever is held off the layer it was drawn on, which is what the drawing
// control leaves a reader with no other way of doing
function MapSelectInteraction({
    onSelect,
    style = defaultStyle,
    ...options
}: MapSelectInteractionProps) {
    const map = useMap();
    const select = useMapInteraction(() => new Select({ ...options, style }));

    // The callback is read off a reference rather than closed over, so a caller passing a fresh
    // function on every render does not have the listener taken off and put back each time
    const onSelectRef = React.useRef(onSelect);

    React.useEffect(() => {
        onSelectRef.current = onSelect;
    }, [onSelect]);

    React.useEffect(() => {
        const key = select.on("select", (event) => {
            // Whatever has just been let go of gives up the style it was drawn in while it was
            // held, so it goes back to being drawn as its layer draws it
            event.deselected.forEach((feature) => feature.setStyle(undefined));

            if (event.selected.length > 0) {
                onSelectRef.current?.(event);
            }
        });

        return () => unByKey(key);
    }, [select]);

    // The key is read off the element the map draws into rather than off the page, so a map that
    // is not being looked at does not answer to what is being typed somewhere else
    React.useEffect(() => {
        if (!map) return;

        const element = map.getTargetElement();
        if (!element) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Backspace") return;

            const features = select.getFeatures();

            features.forEach((feature) => {
                select.getLayer(feature)?.getSource()?.removeFeature(feature);
            });

            features.clear();
        };

        element.addEventListener("keydown", onKeyDown);

        return () => element.removeEventListener("keydown", onKeyDown);
    }, [map, select]);

    return null;
}

MapSelectInteraction.displayName = "MapSelectInteraction";

export { MapSelectInteraction };
