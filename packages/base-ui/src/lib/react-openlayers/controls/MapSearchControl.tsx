import * as React from "react";
import { createPortal } from "react-dom";
import { fromLonLat } from "ol/proj";
import { SearchRegular } from "@gamecrafters/base-ui-icons";
import { classNames } from "../../classnames";
import { useMap } from "../useMap";
import { getLonLat } from "../geocoding";
import { addMarker, DEFAULT_MARKER_COLOR } from "../marker";
import { useMapCustomControl } from "./useMapCustomControl";
import type { MapSearchControlProps } from "../types";

const classes = {
    root: "search-control",
    toggle: "search-control-toggle",
    input: "search-control-input",
};

const ICON_SIZE = 24;

// Close enough in to see the street the answer stands on
const DEFAULT_SEARCH_ZOOM = 18;

const DEFAULT_PLACEHOLDER = "Search for a place";

// Finding somewhere by name. The search is put to the same geocoder the rest of this library
// asks, so a map carries no key and reaches for nothing beyond where its tiles come from.
//
// The answer is taken as read: the likeliest of them is marked and the map is drawn around it,
// which is what a reader typing an address rather than choosing from a list is asking for
function MapSearchControl({
    target,
    className,
    zoom = DEFAULT_SEARCH_ZOOM,
    color = DEFAULT_MARKER_COLOR,
    placeholder = DEFAULT_PLACEHOLDER,
}: MapSearchControlProps) {
    const map = useMap();
    const element = useMapCustomControl(
        "MapSearchControl",
        classNames(classes.root, className),
        target,
    );

    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");

    const search = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!map || !query) return;

        const [result] = await getLonLat(query, 1);
        if (!result) return;

        const lonLat = [Number(result.lon), Number(result.lat)];
        const marker = addMarker(map, lonLat, color);
        marker.set("address", result.display_name);

        map.getView().setCenter(fromLonLat(lonLat));
        map.getView().setZoom(zoom);
    };

    return createPortal(
        <form onSubmit={search}>
            <button
                type="button"
                className={classes.toggle}
                title={placeholder}
                aria-expanded={open}
                onClick={() => setOpen((wasOpen) => !wasOpen)}
            >
                <SearchRegular size={ICON_SIZE} />
            </button>
            {open ? (
                <input
                    type="search"
                    className={classes.input}
                    value={query}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    autoComplete="off"
                    onChange={(event) => setQuery(event.target.value)}
                />
            ) : null}
        </form>,
        element,
    );
}

MapSearchControl.displayName = "MapSearchControl";

export { MapSearchControl };
