import type * as React from "react";

// One of the controls a map can be asked to carry. Zoom, rotation and attribution are drawn by
// every map already, so they are not named here; what is named is what a caller has to ask for.
//
// Only the controls that stand up on their own are listed. An overview map has to be told what
// to draw itself from, and a mouse position is worth having on a map being surveyed rather than
// on one being read, so both are written as children instead
export type MapControl = "draw" | "fullScreen" | "layers" | "scaleLine" | "search";

export type MapProps = React.ComponentPropsWithoutRef<"div"> & {
    // Where the map is pointed, written the way an address is looked up rather than the way the
    // map draws it: degrees of latitude and longitude, which the component turns into the metres
    // the projection measures in. Left out, the map stands at 2261 Market Street, San Francisco
    latitude?: number;
    longitude?: number;
    // How far in the map is drawn. Around sixteen is a block and the streets around it; each step
    // up halves what is shown, so eighteen is a building and twelve a city
    zoom?: number;
    // How wide and how tall the map stands. A number is read as pixels, and anything else is
    // passed to CSS as it was written, so a map can be given a size in whatever units the page
    // is laid out in.
    //
    // Only the height has to be settled: a map left to itself is as wide as whatever it was put
    // in, the way anything else on the page is, but it is drawn to the room it is given and so
    // would be drawn to nothing at all were it left to find a height the same way
    width?: number | string;
    height?: number | string;
    // Which of the extra controls are drawn, in the order they are named
    controls?: readonly MapControl[];
    // Whether a pin is dropped where the map is pointed. A map standing at an address is usually
    // showing that address rather than the ground around it, so one is dropped unless asked not
    marker?: boolean;
    // What the pin is painted. It is drawn into a picture rather than into the document, so it
    // cannot be repainted from a stylesheet the way the rest of the map can
    markerColor?: string;
    // The letter the pin carries, for a map whose pins are being read against a list beside it
    markerLabel?: string;
    // Anything further the map is built from: layers, overlays, further controls, interactions.
    // Each attaches itself to the map around it, so where it is written among the rest does not
    // matter beyond the order the controls are drawn in
    children?: React.ReactNode;
    className?: string;
};
