import * as React from "react";
import View from "ol/View";
import { useMap } from "./useMap";
import type { MapViewProps } from "./types";

// Where the map looks and how far in it is drawn. Setting a view replaces the one the map was
// built with, so this is what a caller reaches for rather than rebuilding the map around a
// centre it should have been given.
//
// The view is settled once, when the map is first there. Moving a map that is already standing
// is the view's own to do, since a view built afresh has none of the movement behind it
function MapView(props: MapViewProps) {
    const map = useMap();

    React.useEffect(() => {
        if (!map) return;
        map.setView(new View(props));
    }, [map]);

    return null;
}

MapView.displayName = "MapView";

export { MapView };
