import * as React from "react";
import { createPortal } from "react-dom";
import Overlay from "ol/Overlay";
import { unByKey } from "ol/Observable";
import { toLonLat } from "ol/proj";
import { DismissRegular } from "@gamecrafters/base-ui-icons";
import { useMap } from "./useMap";
import { getAddress } from "./geocoding";
import type { MapOverlayContent, MapOverlayProps } from "./types";

const classes = {
    root: "ol-popup",
    closer: "ol-popup-closer",
    content: "ol-popup-content",
};

const CLOSER_ICON_SIZE = 12;

// A popup standing over wherever the map was last clicked, held there by the map rather than by
// the page, so it moves with the ground beneath it as the map is dragged about.
//
// OpenLayers is handed an empty element to hold in place and React draws into it, so what the
// popup holds is written as children rather than as markup. Children given as a function are
// called with where the popup was opened and what stands there, which is the only way to reach
// an address that is still being asked for when the popup opens
function MapOverlay({ children, ...options }: MapOverlayProps) {
    const map = useMap();
    const [content, setContent] = React.useState<MapOverlayContent>();
    const overlayRef = React.useRef<Overlay | null>(null);
    const elementRef = React.useRef<HTMLDivElement | null>(null);

    if (!elementRef.current) {
        elementRef.current = document.createElement("div");
    }

    const element = elementRef.current;

    React.useEffect(() => {
        if (!map) return;

        const overlay = new Overlay({ ...options, element });
        overlayRef.current = overlay;
        map.addOverlay(overlay);

        const key = map.on("singleclick", async (event) => {
            const { coordinate } = event;
            const [lon, lat] = toLonLat(coordinate);

            // The popup opens on the click rather than on the answer to it, so it stands where
            // it was asked for straight away and the address fills in once it arrives
            overlay.setPosition(coordinate);
            setContent({ coordinate, lonLat: [lon, lat], address: "" });

            const zoom = Math.ceil(map.getView().getZoom() ?? 0);
            let address = "";

            try {
                address = await getAddress(lon, lat, zoom);
            } catch {
                // A geocoder that cannot be reached leaves the line blank rather than taking
                // the popup down with it
            }

            setContent({ coordinate, lonLat: [lon, lat], address });
        });

        return () => {
            unByKey(key);
            map.removeOverlay(overlay);
            overlayRef.current = null;
        };
    }, [map, element]);

    const close = () => {
        overlayRef.current?.setPosition(undefined);
        setContent(undefined);
    };

    let body: React.ReactNode;

    if (typeof children === "function") {
        // Children given as a function are only called once the popup has been opened, since
        // until then there is nowhere to tell them about
        body = content ? children(content) : null;
    } else {
        body = children;
    }

    return createPortal(
        <div className={classes.root} data-component="MapOverlay">
            <button type="button" className={classes.closer} aria-label="Close" onClick={close}>
                <DismissRegular size={CLOSER_ICON_SIZE} />
            </button>
            <div className={classes.content}>{body}</div>
        </div>,
        element,
    );
}

MapOverlay.displayName = "MapOverlay";

export { MapOverlay };
