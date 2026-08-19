import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { fromLonLat } from "ol/proj";
import type { Map as OlMap } from "ol";
import type { FeatureLike } from "ol/Feature";
import type { Coordinate } from "ol/coordinate";

// Every marker a map is given lives on one layer of its own rather than on whichever layer
// happens to be there, so that a marker can be found again to be taken off, and so that the
// markers are drawn over everything beneath them
const MARKER_LAYER_KEY = "markerLayer";
const MARKER_LAYER_Z_INDEX = 1;

// What a pin is painted where it is not told otherwise. It is written as a value rather than
// taken from a stylesheet because the pin is drawn into a picture rather than into the document,
// and so is out of reach of anything that repaints the rest of the map
export const DEFAULT_MARKER_COLOR = "#257ECA";

// The pin is drawn forty pixels tall in a box fifteen units across, which is what the path below
// was drawn against
const MARKER_SIZE = 40;
const MARKER_VIEW_BOX = 15;

// A teardrop standing on its point, with a hole through the top of it
const MARKER_PATH =
    "M7.5,0C5.0676,0,2.2297,1.4865,2.2297,5.2703 " +
    "C2.2297,7.8378,6.2838,13.5135,7.5,15c1.0811-1.4865,5.2703-7.027,5.2703-9.7297" +
    "C12.7703,1.4865,9.9324,0,7.5,0z";

const findMarkerLayer = (map: OlMap) =>
    map
        .getLayers()
        .getArray()
        .find((layer) => layer.get("key") === MARKER_LAYER_KEY) as VectorLayer | undefined;

// A pin drawn as a picture rather than as a shape, since OpenLayers draws an icon far more
// cheaply than it draws a shape carrying a letter. It is handed over as a data URI, so a map
// draws its markers without reaching for anything across the network
export function getMarkerImage(color: string = DEFAULT_MARKER_COLOR, label: string = "") {
    const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" width="${MARKER_SIZE}" ` +
        `height="${MARKER_SIZE}" viewBox="0 0 ${MARKER_VIEW_BOX} ${MARKER_VIEW_BOX}">` +
        `<path fill="${color}" d="${MARKER_PATH}"/>` +
        '<circle cx="7.5" cy="5.3" r="1.5" fill="white"/>' +
        `<text x="50%" y="50%" text-anchor="middle" fill="white" font-size="6px">${label}</text>` +
        "</svg>";

    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

// Drops a pin at a pair of coordinates, making the layer the markers share if it is not there
// yet. The feature is handed back so a caller can hang whatever it knows about the place on it
export function addMarker(
    map: OlMap,
    lonLat: Coordinate,
    color: string = DEFAULT_MARKER_COLOR,
    label: string = "",
) {
    let markerLayer = findMarkerLayer(map);

    if (!markerLayer) {
        markerLayer = new VectorLayer({
            source: new VectorSource(),
            properties: { key: MARKER_LAYER_KEY },
            zIndex: MARKER_LAYER_Z_INDEX,
        });
        map.addLayer(markerLayer);
    }

    const marker = new Feature({ geometry: new Point(fromLonLat(lonLat)) });

    marker.setStyle(
        new Style({
            image: new Icon({
                scale: 1,
                // The pin is held by its point rather than by its middle, so it stands on what it
                // marks rather than covering it
                anchor: [0.5, MARKER_SIZE],
                anchorXUnits: "fraction",
                anchorYUnits: "pixels",
                src: getMarkerImage(color, label),
            }),
        }),
    );

    markerLayer.getSource()?.addFeature(marker);

    return marker;
}

// Takes a pin off again. A feature that was never on the markers' layer is left alone, since
// what is picked out of the map under a pointer is as likely to be something that was drawn
export function removeMarker(map: OlMap, marker: FeatureLike) {
    const source = findMarkerLayer(map)?.getSource();

    if (source?.hasFeature(marker)) {
        source.removeFeature(marker);
    }
}
