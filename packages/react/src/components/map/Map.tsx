import * as React from "react";
import { fromLonLat } from "ol/proj";
import { useId } from "../../hooks/useId";
import { useMergedRefs } from "../../hooks/useMergedRefs";
import { classNames } from "../../lib/classnames";
import {
    addMarker,
    removeMarker,
    useMap,
    Map as MapSurface,
    MapDrawControl,
    MapFullScreenControl,
    MapLayersControl,
    MapScaleLineControl,
    MapSearchControl,
} from "../../lib/react-openlayers";
import { fixedForwardRef } from "../../utilities/polymorphic";
import type { MapControl, MapProps } from "./Map.types";

const classes = {
    root: "map",
    surface: "map-surface",
    toolbar: "map-toolbar",
};

// 2261 Market Street, San Francisco, CA 94114, as the geocoder the search control asks gives it
// back. A map has to stand somewhere before it has been told where, and somewhere on a street
// reads as a map, where nought and nought falls in the middle of an ocean
export const DEFAULT_MAP_LATITUDE = 37.7649804;
export const DEFAULT_MAP_LONGITUDE = -122.4323829;

// Close enough in to read the street the address stands on, and far enough out to hold the block
// around it
export const DEFAULT_MAP_ZOOM = 16;

// What a screen reader hears a map called where the caller has not named it. A map showing one
// address is better named for that address, but a name is worth having either way: it is what
// the region is found by and skipped past
const DEFAULT_LABEL = "Map";

// How long the ground takes to travel under a map that has been told to look somewhere else.
// Long enough to be followed, short enough not to be waited on
const TRAVEL_DURATION = 500;

const NO_CONTROLS: readonly MapControl[] = [];

// The half of the map's own props that say where it stands, with nothing left out: whatever the
// caller left out the map has settled by the time any of it is handed on
type MapLocationProps = Required<Pick<MapProps, "latitude" | "longitude" | "zoom" | "marker">> &
    Pick<MapProps, "markerColor" | "markerLabel">;

// Where the map stands: what it is pointed at, how far in it is drawn, and the pin saying which
// of what can be seen is the place meant.
//
// A map is built once and moved thereafter rather than built again, since rebuilding one loses
// everything the reader has done to it and fetches every tile a second time. That is why this is
// written against the map rather than as a view handed to it: a view is what a map is built
// with, and what is wanted here is what a map is told afterwards.
//
// The first time round there is nothing to travel from, so the map is simply put where it
// belongs. Every time after, the ground is eased across, which is what says where the new place
// stands against the old one rather than leaving the reader somewhere else without warning
function MapLocation({
    latitude,
    longitude,
    zoom,
    marker,
    markerColor,
    markerLabel,
}: MapLocationProps) {
    const map = useMap();
    const standingRef = React.useRef(false);

    React.useEffect(() => {
        if (!map) return;

        const view = map.getView();
        const center = fromLonLat([longitude, latitude]);

        if (standingRef.current) {
            view.animate({ center, zoom, duration: TRAVEL_DURATION });
            return;
        }

        standingRef.current = true;
        view.setCenter(center);
        view.setZoom(zoom);
    }, [map, latitude, longitude, zoom]);

    React.useEffect(() => {
        if (!map || !marker) return;

        const pin = addMarker(map, [longitude, latitude], markerColor, markerLabel);

        return () => removeMarker(map, pin);
    }, [map, latitude, longitude, marker, markerColor, markerLabel]);

    return null;
}

MapLocation.displayName = "MapLocation";

// Ground drawn from OpenStreetMap tiles, standing at somewhere given as latitude and longitude.
//
// What a map is usually wanted for is one place: an address, a pin on it, and enough of what
// surrounds it to say where that is. That is what the props settle, so a map showing somewhere
// is written as one element rather than assembled. Everything else OpenLayers can draw is
// written as children, which attach themselves to the map around them, and what is written
// there hangs off this component: `Map.Overlay`, `Map.TileLayer`, and the rest.
//
// The map is a region rather than a picture, since it can be moved about within: it takes focus,
// and the arrow keys pan it while the plus and minus keys draw it in and out. Those keys are
// read off this element rather than off the page, so a map that is not being looked at does not
// answer to what is being typed somewhere else
function Map(
    props: MapProps,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: React.ForwardedRef<any>,
) {
    const {
        latitude = DEFAULT_MAP_LATITUDE,
        longitude = DEFAULT_MAP_LONGITUDE,
        zoom = DEFAULT_MAP_ZOOM,
        width,
        height,
        controls = NO_CONTROLS,
        marker = true,
        markerColor,
        markerLabel,
        id: idProp,
        className,
        style,
        children,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        ...rest
    } = props;

    // The map is told which element to read keys off by name rather than handed the element
    // itself, since nothing rendered here is in the document yet on the render it is built from
    const id = useId(idProp);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const mergedRef = useMergedRefs(ref, rootRef);

    // OpenLayers places each control itself unless it is handed somewhere to go, and every
    // control handed the same somewhere is drawn into it in the order the controls were named.
    // That is what keeps a map carrying three of them from drawing them one on top of another,
    // and what leaves no hole where one that was not asked for would have stood.
    //
    // The row is made rather than rendered because a control is built on the first render,
    // before anything React has written has reached the document
    const toolbarRef = React.useRef<HTMLDivElement | null>(null);

    if (!toolbarRef.current) {
        const element = document.createElement("div");
        element.className = classes.toolbar;
        toolbarRef.current = element;
    }

    const toolbar = toolbarRef.current;

    React.useEffect(() => {
        rootRef.current?.append(toolbar);

        return () => toolbar.remove();
    }, [toolbar]);

    // A name given by the caller stands, whichever way it was given. Only where neither was is
    // the map named for what it is, since a region without a name is one a reader cannot tell
    // from the next
    const label = ariaLabelledBy ? undefined : (ariaLabel ?? DEFAULT_LABEL);

    const renderControl = (control: MapControl) => {
        switch (control) {
            // Read rather than pressed, so it keeps the foot of the map, where a scale is
            // looked for, rather than joining the row of buttons
            case "scaleLine":
                return <MapScaleLineControl key={control} />;
            // Full screen is taken on the whole component rather than on the ground alone, so
            // that the controls standing over the map are still there to be pressed once it
            // has filled the screen
            case "fullScreen":
                return <MapFullScreenControl key={control} target={toolbar} source={id} />;
            case "search":
                return <MapSearchControl key={control} target={toolbar} />;
            case "layers":
                return <MapLayersControl key={control} target={toolbar} />;
            case "draw":
                return <MapDrawControl key={control} target={toolbar} />;
        }
    };

    return (
        <div
            ref={mergedRef}
            id={id}
            role="region"
            tabIndex={0}
            aria-label={label}
            aria-labelledby={ariaLabelledBy}
            className={classNames(classes.root, className)}
            style={
                {
                    ...style,
                    // How much of the page the map takes is the one thing the class cannot
                    // settle on its own, since it is the caller who says
                    "--map-width": typeof width === "number" ? `${width}px` : width,
                    "--map-height": typeof height === "number" ? `${height}px` : height,
                } as React.CSSProperties
            }
            data-component="Map"
            {...rest}
        >
            <MapSurface className={classes.surface} keyboardEventTarget={id}>
                <MapLocation
                    latitude={latitude}
                    longitude={longitude}
                    zoom={zoom}
                    marker={marker}
                    markerColor={markerColor}
                    markerLabel={markerLabel}
                />
                {controls.map(renderControl)}
                {children}
            </MapSurface>
        </div>
    );
}

Map.displayName = "Map";

export default fixedForwardRef(Map);
