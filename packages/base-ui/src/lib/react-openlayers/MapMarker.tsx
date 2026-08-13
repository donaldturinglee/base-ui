import * as React from "react";
import { unByKey } from "ol/Observable";
import { fromLonLat, toLonLat } from "ol/proj";
import { useMap } from "./useMap";
import { getLonLat } from "./geocoding";
import { addMarker, removeMarker, DEFAULT_MARKER_COLOR } from "./marker";
import type { MapMarkerProps } from "./types";

// What a pin may carry. Anything outside this is stepped over on the way to the next one, so a
// marker started from a space walks on to a digit rather than to a punctuation mark
const LABEL_PATTERN = /^[0-9A-Z]$/;
const LABEL_MAX_CODE = 127;

// The label after this one. It walks the character codes rather than counting, so a run started
// anywhere reads on from there, and once it runs off the end it starts again from the beginning
const getNextLabel = (label: string) => {
    let code = label.charCodeAt(0);

    do {
        code = Number.isNaN(code) || code >= LABEL_MAX_CODE ? 0 : code + 1;
    } while (!LABEL_PATTERN.test(String.fromCharCode(code)));

    return String.fromCharCode(code);
};

// A pin standing somewhere on the map, and the clicking that drops further ones beside it.
//
// Where it stands can be given as a pair of coordinates or as an address to be looked up. An
// address is asked of a geocoder over the network, so the marker for one arrives a moment after
// the map does, carrying what the geocoder made of the address it was given
function MapMarker({
    lonLat,
    address,
    color = DEFAULT_MARKER_COLOR,
    label = " ",
    addOnClick = false,
    removeOnClick = false,
}: MapMarkerProps) {
    const map = useMap();

    // Each marker dropped by a click carries the label after the last one, so the walk is kept
    // across renders rather than starting again from the label the component was given
    const labelRef = React.useRef(label);

    React.useEffect(() => {
        if (!map) return;

        if (lonLat) {
            addMarker(map, lonLat, color, labelRef.current);
            map.getView().setCenter(fromLonLat(lonLat));
            return;
        }

        if (!address) return;

        getLonLat(address, 1).then((results) => {
            const [result] = results;
            if (!result) return;

            const found = [Number(result.lon), Number(result.lat)];
            const marker = addMarker(map, found, color, labelRef.current);
            // What the geocoder made of the address is hung on the feature, so whatever picks
            // the marker out of the map again has it without asking a second time
            marker.set("address", result.display_name);
            map.getView().setCenter(fromLonLat(found));
        });
    }, [map]);

    React.useEffect(() => {
        if (!map || (!addOnClick && !removeOnClick)) return;

        const key = map.on("singleclick", (event) => {
            const feature = map.forEachFeatureAtPixel(event.pixel, (found) => found);

            // A click landing on something takes it away, and a click landing on nothing drops
            // another pin. One click cannot do both, which is what keeps a marker from being
            // dropped on the spot one was just taken from
            if (feature) {
                if (removeOnClick) {
                    removeMarker(map, feature);
                }
                return;
            }

            if (addOnClick) {
                labelRef.current = getNextLabel(labelRef.current);
                addMarker(map, toLonLat(event.coordinate), color, labelRef.current);
            }
        });

        return () => unByKey(key);
    }, [map, color, addOnClick, removeOnClick]);

    return null;
}

MapMarker.displayName = "MapMarker";

export { MapMarker };
