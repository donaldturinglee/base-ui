import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import VectorLayer from "ol/layer/Vector";
import { toLonLat } from "ol/proj";
import type { Map as OlMap } from "ol";
import type Point from "ol/geom/Point";
import type Icon from "ol/style/Icon";
import type Style from "ol/style/Style";
import { Map, useMap, DEFAULT_MAP_LATITUDE, DEFAULT_MAP_LONGITUDE, DEFAULT_MAP_ZOOM } from ".";
import type { MapProps } from "./Map.types";

const originalResizeObserver = window.ResizeObserver;

// The map itself is not handed back to a caller, so it is picked up the way anything drawn
// inside one picks it up: from the map above it. That is what everything below reads the view
// and the pins off, so what is checked is the map rather than the props it was given
let olMap: OlMap | undefined;

function CaptureMap() {
    olMap = useMap();

    return null;
}

const renderMap = (props: MapProps = {}) =>
    render(
        <Map {...props}>
            <CaptureMap />
            {props.children}
        </Map>,
    );

// The component's own root, which is the outer of the two: the wrapper a ref is forwarded to
// stands around the element OpenLayers draws into
const map = () => document.querySelector<HTMLElement>("[data-component='Map']")!;

const surface = () => map().querySelector<HTMLElement>(".map-surface")!;

const toolbar = () => map().querySelector<HTMLElement>(".map-toolbar")!;

const viewport = () => map().querySelector<HTMLElement>(".ol-viewport")!;

const view = () => olMap!.getView();

// Every pin a map is given stands on one layer of its own, which is the only vector layer a map
// drawn from these props carries
const markers = () => {
    const layer = olMap
        ?.getLayers()
        .getArray()
        .find((candidate) => candidate instanceof VectorLayer) as VectorLayer | undefined;

    return layer?.getSource()?.getFeatures() ?? [];
};

const markerLonLat = (index = 0) => {
    const geometry = markers()[index]?.getGeometry() as Point | undefined;

    return geometry ? toLonLat(geometry.getCoordinates()) : [];
};

// The pin is drawn as a picture handed over as a data URI, so what it is painted and what it
// carries are read back off the source rather than off anything in the document
const markerSource = (index = 0) => {
    const style = markers()[index]?.getStyle() as Style | undefined;

    return (style?.getImage() as Icon | undefined)?.getSrc() ?? "";
};

describe("Map", () => {
    // jsdom has no ResizeObserver, and OpenLayers watches the element it draws into so that the
    // ground is drawn again whenever the room it has changes
    beforeEach(() => {
        olMap = undefined;
        window.ResizeObserver = class {
            observe() {}
            unobserve() {}
            disconnect() {}
        } as unknown as typeof ResizeObserver;
    });

    afterEach(() => {
        window.ResizeObserver = originalResizeObserver;
    });

    it("renders a div element", () => {
        renderMap();
        expect(map().tagName).toBe("DIV");
    });

    it("tags the root element with a data-component attribute", () => {
        renderMap();
        expect(map()).toHaveAttribute("data-component", "Map");
    });

    it("draws the ground into an element of its own inside the root", () => {
        renderMap();
        expect(surface()).toBeInTheDocument();
        expect(viewport()).toBeInTheDocument();
    });

    it("stands as a region, since a map is moved about within rather than looked at", () => {
        renderMap();
        expect(screen.getByRole("region")).toBe(map());
    });

    it("names the region, so that it can be found and skipped past", () => {
        renderMap();
        expect(map()).toHaveAttribute("aria-label", "Map");
    });

    it("lets a label given by the caller win over the one it falls back to", () => {
        renderMap({ "aria-label": "Office location" });
        expect(map()).toHaveAttribute("aria-label", "Office location");
    });

    it("leaves the name to what it points at where it is labelled by another element", () => {
        render(
            <>
                <h2 id="heading">Where we are</h2>
                <Map aria-labelledby="heading" />
            </>,
        );
        expect(map()).toHaveAttribute("aria-labelledby", "heading");
        expect(map()).not.toHaveAttribute("aria-label");
    });

    it("takes focus, so that the ground can be panned without a pointer", () => {
        renderMap();
        expect(map()).toHaveAttribute("tabindex", "0");
    });

    it("answers to the name the map was told to read keys off", () => {
        renderMap({ id: "office-map" });
        expect(map()).toHaveAttribute("id", "office-map");
    });

    it("names an element to read keys off even where the caller named none", () => {
        renderMap();
        expect(map().getAttribute("id")).toBeTruthy();
    });

    it("stands at 2261 Market Street, San Francisco, until it is told otherwise", () => {
        expect(DEFAULT_MAP_LATITUDE).toBeCloseTo(37.7649804, 6);
        expect(DEFAULT_MAP_LONGITUDE).toBeCloseTo(-122.4323829, 6);
    });

    it("points the map at 2261 Market Street where it was given nowhere", () => {
        renderMap();
        const [longitude, latitude] = toLonLat(view().getCenter()!);
        expect(longitude).toBeCloseTo(DEFAULT_MAP_LONGITUDE, 4);
        expect(latitude).toBeCloseTo(DEFAULT_MAP_LATITUDE, 4);
        expect(view().getZoom()).toBe(DEFAULT_MAP_ZOOM);
    });

    it("points the map at the coordinates it was given", () => {
        renderMap({ latitude: 51.5007, longitude: -0.1246, zoom: 12 });
        const [longitude, latitude] = toLonLat(view().getCenter()!);
        expect(longitude).toBeCloseTo(-0.1246, 4);
        expect(latitude).toBeCloseTo(51.5007, 4);
        expect(view().getZoom()).toBe(12);
    });

    it("falls back to a zoom close enough in to read the street off", () => {
        expect(DEFAULT_MAP_ZOOM).toBe(16);
    });

    it("moves a map already standing rather than building another one", () => {
        const { rerender } = renderMap();
        const first = viewport();

        rerender(
            <Map latitude={48.8584} longitude={2.2945}>
                <CaptureMap />
            </Map>,
        );
        expect(viewport()).toBe(first);
    });

    it("drops a pin where the map is pointed", () => {
        renderMap();
        const [longitude, latitude] = markerLonLat();
        expect(markers()).toHaveLength(1);
        expect(longitude).toBeCloseTo(DEFAULT_MAP_LONGITUDE, 4);
        expect(latitude).toBeCloseTo(DEFAULT_MAP_LATITUDE, 4);
    });

    it("drops no pin where it was asked not to", () => {
        renderMap({ marker: false });
        expect(markers()).toHaveLength(0);
    });

    it("moves the pin rather than leaving a second one behind", () => {
        const { rerender } = renderMap({ latitude: 51.5007, longitude: -0.1246 });
        expect(markerLonLat()[0]).toBeCloseTo(-0.1246, 4);

        rerender(
            <Map latitude={48.8584} longitude={2.2945}>
                <CaptureMap />
            </Map>,
        );
        expect(markers()).toHaveLength(1);
        expect(markerLonLat()[0]).toBeCloseTo(2.2945, 4);
    });

    it("takes the pin away when it is turned off", () => {
        const { rerender } = renderMap();
        expect(markers()).toHaveLength(1);

        rerender(
            <Map marker={false}>
                <CaptureMap />
            </Map>,
        );
        expect(markers()).toHaveLength(0);
    });

    it("paints the pin the colour it was given", () => {
        renderMap({ markerColor: "blue" });
        expect(markerSource()).toContain(encodeURIComponent('fill="blue"'));
    });

    it("gives the pin the letter it was given", () => {
        renderMap({ markerLabel: "A" });
        expect(markerSource()).toContain(encodeURIComponent(">A<"));
    });

    it("draws the zoom and the attribution on every map, asked for or not", () => {
        renderMap();
        expect(viewport().querySelector(".ol-zoom")).toBeInTheDocument();
        expect(viewport().querySelector(".ol-attribution")).toBeInTheDocument();
    });

    it("draws no extra controls where none were asked for", () => {
        renderMap();
        expect(toolbar().children).toHaveLength(0);
        expect(map().querySelector(".ol-scale-line")).toBeNull();
    });

    it("draws the controls it was asked for, in the order they were named", () => {
        renderMap({ controls: ["search", "layers", "draw"] });
        expect(
            Array.from(toolbar().children).map((child) => child.getAttribute("data-component")),
        ).toEqual(["MapSearchControl", "MapLayersControl", "MapDrawControl"]);
    });

    it("gathers the controls a reader presses into one row rather than piling them up", () => {
        renderMap({ controls: ["fullScreen", "search"] });
        expect(toolbar().querySelector(".ol-full-screen")).toBeInTheDocument();
        expect(toolbar().querySelector(".search-control")).toBeInTheDocument();
    });

    it("leaves the scale line at the foot of the map rather than among the buttons", () => {
        renderMap({ controls: ["scaleLine"] });
        expect(toolbar().children).toHaveLength(0);
        expect(viewport().querySelector(".ol-scale-line")).toBeInTheDocument();
    });

    it("renders children inside the map, so that they can attach themselves to it", () => {
        renderMap({ children: <Map.ScaleLineControl /> });
        expect(viewport().querySelector(".ol-scale-line")).toBeInTheDocument();
    });

    it("hands the width it was given to the stylesheet, in pixels where it was a number", () => {
        renderMap({ width: 640 });
        expect(map()).toHaveStyle({ "--map-width": "640px" });
    });

    it("passes a width written out to the stylesheet as it was written", () => {
        renderMap({ width: "50%" });
        expect(map()).toHaveStyle({ "--map-width": "50%" });
    });

    it("leaves the width to whatever the map was put in where it was given none", () => {
        renderMap();
        expect(map().getAttribute("style") ?? "").not.toContain("--map-width");
    });

    it("hands the height it was given to the stylesheet, in pixels where it was a number", () => {
        renderMap({ height: 480 });
        expect(map()).toHaveStyle({ "--map-height": "480px" });
    });

    it("passes a height written out to the stylesheet as it was written", () => {
        renderMap({ height: "60vh" });
        expect(map()).toHaveStyle({ "--map-height": "60vh" });
    });

    it("leaves the height to the stylesheet where it was given none", () => {
        renderMap();
        expect(map().getAttribute("style") ?? "").not.toContain("--map-height");
    });

    it("takes a width and a height together", () => {
        renderMap({ width: 640, height: 360 });
        expect(map()).toHaveStyle({ "--map-width": "640px" });
        expect(map()).toHaveStyle({ "--map-height": "360px" });
    });

    it("keeps a style passed in alongside the height it sets", () => {
        renderMap({ height: 320, style: { opacity: 0.5 } });
        expect(map()).toHaveStyle({ opacity: "0.5" });
        expect(map()).toHaveStyle({ "--map-height": "320px" });
    });

    it("does not leak the drawing props onto the element", () => {
        renderMap({
            latitude: 51.5007,
            longitude: -0.1246,
            zoom: 12,
            width: 640,
            height: 360,
            markerLabel: "A",
        });
        expect(map()).not.toHaveAttribute("latitude");
        expect(map()).not.toHaveAttribute("longitude");
        expect(map()).not.toHaveAttribute("zoom");
        // Both are attributes a browser would honour on some elements, so a leak here would be
        // a size set twice over rather than one quietly ignored
        expect(map()).not.toHaveAttribute("width");
        expect(map()).not.toHaveAttribute("height");
        expect(map()).not.toHaveAttribute("marker");
        expect(map()).not.toHaveAttribute("markerLabel");
    });

    it("forwards a ref to the root element", () => {
        const ref = React.createRef<HTMLDivElement>();
        render(<Map ref={ref} />);
        expect(ref.current).toBe(map());
    });

    it("merges a custom className onto the root element", () => {
        renderMap({ className: "custom" });
        expect(map()).toHaveClass("map", "custom");
    });

    it("passes extra props onto the root element", () => {
        renderMap({ "data-testid": "office-map" } as MapProps);
        expect(map()).toHaveAttribute("data-testid", "office-map");
    });
});
