// The colours the series are drawn in, in the order they are handed out. The order is fixed:
// the third series is always purple whether or not the first two are still on the chart, so
// that filtering a chart never repaints what is left standing.
//
// Every one of them is a step of the display scale, which themes.css turns the other way up
// for the dark theme, so the same step reads against either surface. The six checks a
// categorical palette has to pass — lightness band, chroma floor, separation under colour
// blindness, separation under full colour vision, and contrast against the surface — were run
// over both themes and pass for all five.
//
// Five is the whole of it. A sixth hue that told itself apart from these under deuteranopia is
// not there to be had in this scale: teal and cyan go grey at the steps that hold their
// contrast, and brown and grey are below the chroma floor outright. A chart with more than
// five things to say should gather the tail into one series of its own rather than reach for
// another colour.
export const CHART_SERIES_COLORS = [
    "var(--base-display-color-blue-5)",
    "var(--base-display-color-orange-5)",
    "var(--base-display-color-purple-5)",
    "var(--base-display-color-green-5)",
    "var(--base-display-color-pink-5)",
];

// What is left over for anything past the palette. It is deliberately not another hue: a
// colour made up to fill the gap reads as one of the five under colour blindness and says
// something the chart cannot back up
export const CHART_OVERFLOW_COLOR = "var(--foreground-color-muted)";

// The colour a series is drawn in: the caller's own where they gave one, and otherwise the
// step of the palette that belongs to its place in the list
export const getSeriesColor = (index: number, color?: string) =>
    color ?? CHART_SERIES_COLORS[index] ?? CHART_OVERFLOW_COLOR;
