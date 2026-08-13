import * as React from "react";
import { createPortal } from "react-dom";
import Draw from "ol/interaction/Draw";
import Modify from "ol/interaction/Modify";
import Snap from "ol/interaction/Snap";
import GeoJSON from "ol/format/GeoJSON";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import {
    ArrowMoveRegular,
    CircleRegular,
    CircleSmallRegular,
    LineRegular,
    ShapesRegular,
} from "@gamecrafters/base-ui-icons";
import { classNames } from "../../classnames";
import { useMap } from "../useMap";
import { useMapCustomControl } from "./useMapCustomControl";
import type { MapDrawControlProps, MapDrawShape } from "../types";

const classes = {
    root: "draw-control",
    toggle: "draw-control-toggle",
    shapes: "draw-control-shapes",
    shape: "draw-control-shape",
};

const ICON_SIZE = 12;

const DRAW_LAYER_KEY = "drawLayer";

// A line is drawn between two points rather than along many, so what it measures is a distance
// between somewhere and somewhere else rather than the length of a path
const LINE_MAX_POINTS = 2;

// What is drawn is drawn on a canvas rather than in the document, so it is painted in colours of
// its own rather than in the design tokens the rest of the control is dressed by
const DRAW_STYLE = {
    "fill-color": "rgba(255, 255, 255, 0.2)",
    "stroke-color": "#8c62ff",
    "stroke-width": 2,
    "circle-radius": 7,
    "circle-fill-color": "#8c62ff",
};

// The shapes are written out in longitude and latitude rather than in the projection the map
// draws them in, so what is saved reads the same wherever it is opened again
const GEO_JSON_OPTIONS = {
    dataProjection: "EPSG:4326",
    featureProjection: "EPSG:3857",
};

const DEFAULT_FILE_NAME = "react-openlayers-geojson.json";

const SHAPES = [
    { shape: "Point", label: "Draw a point", Icon: CircleSmallRegular },
    { shape: "LineString", label: "Draw a line", Icon: LineRegular },
    { shape: "Circle", label: "Draw a circle", Icon: CircleRegular },
] as const;

// What the drawing is held on, kept together so that one lazy reference stands for all three
type DrawTools = {
    source: VectorSource;
    layer: VectorLayer;
    modify: Modify;
};

// Drawing on the map, and saving what was drawn.
//
// The control opens onto a row of shapes, one of which is being drawn at a time; choosing the
// one already being drawn puts the pen down again and leaves what was drawn open to being
// reshaped. Escape abandons a shape half drawn, and Shift+S writes the lot out as GeoJSON.
//
// What is drawn stays where it was drawn while the control is shut. Only the layer and the
// interactions come off, so opening it again finds the shapes still there
function MapDrawControl({ target, className, fileName = DEFAULT_FILE_NAME }: MapDrawControlProps) {
    const map = useMap();
    const element = useMapCustomControl(
        "MapDrawControl",
        classNames(classes.root, className),
        target,
    );

    const [open, setOpen] = React.useState(false);
    const [shape, setShape] = React.useState<MapDrawShape | null>(null);

    const toolsRef = React.useRef<DrawTools | null>(null);
    const drawRef = React.useRef<Draw | null>(null);

    if (!toolsRef.current) {
        const source = new VectorSource();

        toolsRef.current = {
            source,
            layer: new VectorLayer({
                source,
                style: DRAW_STYLE,
                properties: { key: DRAW_LAYER_KEY },
            }),
            modify: new Modify({ source }),
        };
    }

    const tools = toolsRef.current;

    const save = React.useCallback(() => {
        const features = tools.source.getFeatures();
        const geoJson = new GeoJSON().writeFeaturesObject(features, GEO_JSON_OPTIONS);
        const file = new Blob([JSON.stringify(geoJson)], { type: "application/json" });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");

        link.href = url;
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(url);
    }, [tools, fileName]);

    React.useEffect(() => {
        if (!map || !open) return;

        map.addLayer(tools.layer);
        map.addInteraction(tools.modify);

        return () => {
            map.removeInteraction(tools.modify);
            map.removeLayer(tools.layer);
        };
    }, [map, open, tools]);

    React.useEffect(() => {
        if (!map || !open || !shape) return;

        const draw =
            shape === "LineString"
                ? new Draw({ source: tools.source, type: shape, maxPoints: LINE_MAX_POINTS })
                : new Draw({ source: tools.source, type: shape });
        const snap = new Snap({ source: tools.source });

        drawRef.current = draw;
        map.addInteraction(draw);
        map.addInteraction(snap);

        return () => {
            map.removeInteraction(snap);
            map.removeInteraction(draw);
            drawRef.current = null;
        };
    }, [map, open, shape, tools]);

    // The keys are read off the element the map draws into rather than off the page, so a map
    // that is not being looked at does not answer to what is being typed somewhere else
    React.useEffect(() => {
        if (!map || !open) return;

        const targetElement = map.getTargetElement();
        if (!targetElement) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                drawRef.current?.abortDrawing();
            } else if (event.shiftKey && event.key === "S") {
                save();
            }
        };

        targetElement.addEventListener("keydown", onKeyDown);

        return () => targetElement.removeEventListener("keydown", onKeyDown);
    }, [map, open, save]);

    const toggle = () => {
        setOpen((wasOpen) => !wasOpen);
        setShape(null);
    };

    // Choosing the shape already being drawn puts the pen down, which is what leaves the drawing
    // open to being reshaped without anything further being added to it
    const chooseShape = (next: MapDrawShape | null) => {
        setShape((current) => (current === next ? null : next));
    };

    return createPortal(
        <>
            <button
                type="button"
                className={classes.toggle}
                title="Click here to start drawing. Shift+S to save as GeoJSON"
                aria-expanded={open}
                onClick={toggle}
            >
                <ShapesRegular size={ICON_SIZE} />
            </button>
            {open ? (
                <div className={classes.shapes}>
                    {SHAPES.map(({ shape: value, label, Icon }) => (
                        <button
                            key={value}
                            type="button"
                            className={classes.shape}
                            title={`${label}. Hold shift to draw freehand`}
                            aria-pressed={shape === value}
                            onClick={() => chooseShape(value)}
                        >
                            <Icon size={ICON_SIZE} />
                        </button>
                    ))}
                    <button
                        type="button"
                        className={classes.shape}
                        title="Move and reshape what has been drawn"
                        aria-pressed={shape === null}
                        onClick={() => chooseShape(null)}
                    >
                        <ArrowMoveRegular size={ICON_SIZE} />
                    </button>
                </div>
            ) : null}
        </>,
        element,
    );
}

MapDrawControl.displayName = "MapDrawControl";

export { MapDrawControl };
