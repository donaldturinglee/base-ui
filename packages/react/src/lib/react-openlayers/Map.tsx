import * as React from "react";
import { createPortal } from "react-dom";
import { Map as OlMap } from "ol";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { defaults as defaultControls } from "ol/control/defaults";
import { AddRegular, SubtractRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../classnames";
import { MapContext } from "./MapContext";
import type { MapProps } from "./types";

const classes = {
    root: "ol-map",
};

// Where a map stands and how far in it is drawn until it is given a view of its own. The zoom is
// far enough out to hold the whole world, so a map given nothing shows somewhere rather than
// showing the middle of an ocean at street level
const DEFAULT_CENTER = [0, 0];
const DEFAULT_ZOOM = 2;

const ZOOM_ICON_SIZE = 12;

// A map, and the ground everything drawn on one stands on. The layers, the controls and the
// interactions are written as children rather than passed in as options, so a map reads as the
// sum of what is written within it and each piece can be put there or left out on its own.
//
// What the map is built with is read once, when the element it draws into is first there.
// Building another map would lose where the first was left standing, so a caller changing where
// the map looks reaches for `MapView` or for the map's own view rather than for these
function Map({ children, className, style, ...options }: MapProps) {
    const [map, setMap] = React.useState<OlMap>();
    const containerRef = React.useRef<HTMLDivElement>(null);

    // The zoom buttons are drawn by React rather than written into the control as markup, so
    // they carry the same icons the rest of the design system is drawn from. OpenLayers is
    // handed two empty elements to put inside the buttons, and React fills them in below
    const zoomInRef = React.useRef<HTMLSpanElement | null>(null);
    const zoomOutRef = React.useRef<HTMLSpanElement | null>(null);

    if (!zoomInRef.current) {
        zoomInRef.current = document.createElement("span");
    }

    if (!zoomOutRef.current) {
        zoomOutRef.current = document.createElement("span");
    }

    const zoomInLabel = zoomInRef.current;
    const zoomOutLabel = zoomOutRef.current;

    React.useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const olMap = new OlMap({
            layers: [new TileLayer({ source: new OSM() })],
            controls: defaultControls({ zoomOptions: { zoomInLabel, zoomOutLabel } }),
            view: new View({ center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM }),
            ...options,
            // The map draws into the element rendered below rather than wherever it was told to,
            // so a target passed among the options cannot take the drawing somewhere else
            target: container,
        });

        setMap(olMap);

        return () => {
            // Letting go of the element is what stops the map drawing into it. The map itself is
            // left to be collected once nothing holds it
            olMap.setTarget(undefined);
            setMap(undefined);
        };
        // The map is built once, against the element it draws into. Everything else is settled
        // by the children, which attach themselves to the map as soon as it is there
    }, []);

    return (
        <MapContext.Provider value={map}>
            <div
                ref={containerRef}
                className={classNames(classes.root, className)}
                style={style}
                data-component="Map"
            >
                {children}
            </div>
            {createPortal(<AddRegular size={ZOOM_ICON_SIZE} />, zoomInLabel)}
            {createPortal(<SubtractRegular size={ZOOM_ICON_SIZE} />, zoomOutLabel)}
        </MapContext.Provider>
    );
}

Map.displayName = "Map";

export { Map };
